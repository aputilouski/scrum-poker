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

type PlayerSocket = { player: Player } & Socket;

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

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
      game = this.gameService.getById(id);
      game.players[client.player.id] = client.player.name;
      this.server.to(game.id).emit('game:new-player', client.player);
    }
    client.join(game.id);
    return game;
  }

  @SubscribeMessage('game:choose-card')
  chooseCard(@ConnectedSocket() client: PlayerSocket, @MessageBody() [game_id, value]: [string, number]) {
    const player_id = client.player.id;
    this.gameService.chooseCard(game_id, player_id, value);
    this.server.to(game_id).emit('game:card-chosen', { game_id, player_id: player_id, value });
  }

  @SubscribeMessage('game:process')
  processGame(@MessageBody() game_id: string) {
    const game = this.gameService.getById(game_id);
    if (game.status === 'in-progress') {
      this.gameService.changeGameStatus(game, 'expiring');
      game.timer_id = setTimeout(() => {
        this.gameService.changeGameStatus(game, 'ended');
        this.server.to(game_id).emit('game:status-change', game.status);
      }, 3000);
    } else if (game.status === 'ended') {
      this.gameService.changeGameStatus(game, 'in-progress');
      clearTimeout(game.timer_id);
      game.timer_id = undefined;
    }
    this.server.to(game_id).emit('game:status-change', game.status);
  }
}
