import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { customAlphabet } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { Cron } from '@nestjs/schedule';

type PlayerSocket = { player: Player } & Socket;

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly GameService: GameService) {}

  @WebSocketServer()
  server: Server;

  @Cron('* */10 * * * *')
  async handleCron() {
    const keys = this.GameService.getAll();
    for (const game_id of keys) {
      const sockets = await this.server.in(game_id).fetchSockets();
      if (!sockets.length) this.GameService.deleteById(game_id);
    }
  }

  @SubscribeMessage('player:create')
  createPlayer(@ConnectedSocket() client: PlayerSocket, @MessageBody() name: string) {
    const player = {
      id: customAlphabet('1234567890abcdef', 8)(),
      name,
    };
    client.player = player;
    return player;
  }

  @SubscribeMessage('player:connect')
  initPlayer(@ConnectedSocket() client: PlayerSocket, @MessageBody() player: Player) {
    client.player = player;
    return player;
  }

  @SubscribeMessage('game:start')
  startGame(@ConnectedSocket() client: PlayerSocket, @MessageBody() id?: string) {
    try {
      let game: Game | undefined;
      if (!id) game = this.GameService.create(client.player);
      else {
        game = this.GameService.getById(id);
        if (Object.keys(game.players).length > 24) throw new Error('Too many players');
        game.players[client.player.id] = client.player;
        this.server.to(game.id).emit('game:new-player', client.player);
      }
      client.join(game.id);
      return game;
    } catch (error) {
      throw new WsException(error instanceof Error ? error.message : 'Something went wrong...');
    }
  }

  @SubscribeMessage('game:quit')
  quitGame(@ConnectedSocket() client: PlayerSocket, @MessageBody() game_id: string) {
    try {
      const player_id = client.player.id;
      const game = this.GameService.getById(game_id);
      delete game.players[player_id];
      this.server.to(game_id).emit('game:remove-player', player_id);
      client.leave(game_id);
    } catch (error) {
      throw new WsException(error instanceof Error ? error.message : 'Something went wrong...');
    }
  }

  @SubscribeMessage('game:choose-card')
  chooseCard(@ConnectedSocket() client: PlayerSocket, @MessageBody() [game_id, value]: [string, number]) {
    try {
      const player_id = client.player.id;
      const game = this.GameService.getById(game_id);
      if (game.players[player_id].card === value) delete game.players[player_id].card;
      else game.players[player_id].card = value;
      this.server.to(game_id).emit('game:card-chosen', {
        game_id,
        player_id,
        value: game.players[player_id].card,
      });
    } catch (error) {
      throw new WsException(error instanceof Error ? error.message : 'Something went wrong...');
    }
  }

  @SubscribeMessage('game:process')
  processGame(@MessageBody() game_id: string) {
    try {
      const game = this.GameService.getById(game_id);
      if (game.status === 'in-progress') {
        game.status = 'expiring';
        game.timer_id = setTimeout(() => {
          game.status = 'ended';
          const players = Object.values(game.players);
          const estimates = players.map(p => p.card).filter(c => typeof c === 'number');
          const stats = estimates.reduce((count, item) => ((count[item] = count[item] + 1 || 1), count), {});
          const average = estimates.reduce((a, b) => a + b, 0) / estimates.length;
          players.forEach(player => {
            delete player.card;
          });
          this.server.to(game_id).emit('game:update-status', game.status, { stats, average: average.toFixed(2) });
        }, 2400);
      } else if (game.status === 'ended') {
        game.status = 'in-progress';
        clearTimeout(game.timer_id);
        game.timer_id = undefined;
      }
      this.server.to(game_id).emit('game:update-status', game.status);
    } catch (error) {
      throw new WsException(error instanceof Error ? error.message : 'Something went wrong...');
    }
  }
}
