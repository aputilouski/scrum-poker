import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { nanoid } from 'nanoid';

const games = new Map();

@Injectable()
export class GameService {
  create(captain: Player): Game {
    const game: Game = {
      id: nanoid(),
      status: 'in-progress',
      captain_id: captain.id,
      players: {
        [captain.id]: captain.name,
      },
      cards: {},
    };
    games.set(game.id, game);
    return game;
  }

  getById(id: string): Game | undefined {
    const game = games.get(id);
    if (!game) throw new WsException('Game not found');
    return game;
  }

  chooseCard(game_id: string, player_id: string, value: number): number | undefined {
    const game: Game = games.get(game_id);
    if (!game) throw new WsException('Game not found');
    if (game.cards[player_id] === value) delete game.cards[player_id];
    else game.cards[player_id] = value;
    return game.cards[player_id];
  }

  changeStatus(game: Game, status: Game['status']) {
    game.status = status;
  }

  dropCards(game: Game) {
    game.cards = {};
  }

  removePlayer(game_id: string, player_id: string) {
    const game: Game = games.get(game_id);
    if (!game) throw new WsException('Game not found');
    delete game.players[player_id];
    delete game.cards[player_id];
  }
}
