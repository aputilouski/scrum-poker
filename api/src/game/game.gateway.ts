import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { customAlphabet } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { Cron } from '@nestjs/schedule';

type PlayerSocket = { player: Player } & Socket;

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  @Cron('* */10 * * * *')
  async handleCron() {
    const keys = this.gameService.getAll();

    for (const game_id of keys) {
      const sockets = await this.server.in(game_id).fetchSockets();
      if (sockets.length === 0) this.gameService.deleteById(game_id);
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

  @SubscribeMessage('player:init')
  initPlayer(@ConnectedSocket() client: PlayerSocket, @MessageBody() player: Player) {
    client.player = player;
    return player;
  }

  @SubscribeMessage('game:start')
  startGame(@ConnectedSocket() client: PlayerSocket, @MessageBody() id?: string) {
    let game: Game | undefined;
    if (!id) game = this.gameService.create(client.player);
    else {
      this.gameService.addPlayer(id, client.player);
      this.server.to(game.id).emit('game:new-player', client.player);
    }
    client.join(game.id);
    return game;
  }

  @SubscribeMessage('game:quit')
  quitGame(@ConnectedSocket() client: PlayerSocket, @MessageBody() game_id: string) {
    this.gameService.removePlayer(game_id, client.player.id);
    this.server.to(game_id).emit('game:remove-player', client.player.id);
    client.leave(game_id);
  }

  @SubscribeMessage('game:choose-card')
  chooseCard(@ConnectedSocket() client: PlayerSocket, @MessageBody() [game_id, value]: [string, number]) {
    const player_id = client.player.id;
    const cardValue = this.gameService.chooseCard(game_id, player_id, value);
    this.server.to(game_id).emit('game:card-chosen', { game_id, player_id: player_id, value: cardValue });
  }

  @SubscribeMessage('game:process')
  processGame(@MessageBody() game_id: string) {
    const game = this.gameService.getById(game_id);
    if (game.status === 'in-progress') {
      this.gameService.changeStatus(game, 'expiring');
      game.timer_id = setTimeout(() => {
        this.gameService.changeStatus(game, 'ended');
        const estimates = Object.values(game.cards);
        const stats = estimates.reduce((count, item) => ((count[item] = count[item] + 1 || 1), count), {});
        const average = estimates.reduce((a, b) => a + b, 0) / estimates.length;
        this.gameService.dropCards(game);
        this.server.to(game_id).emit('game:status-change', game.status, { stats, average: average.toFixed(2) });
      }, 1800);
    } else if (game.status === 'ended') {
      this.gameService.changeStatus(game, 'in-progress');
      clearTimeout(game.timer_id);
      game.timer_id = undefined;
    }
    this.server.to(game_id).emit('game:status-change', game.status);
  }
}
