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

  getAll() {
    return games.keys();
  }

  deleteById(id: string) {
    return games.delete(id);
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

  addPlayer(game_id: string, player: Player) {
    const game: Game = games.get(game_id);
    if (!game) throw new WsException('Game not found');
    if (Object.keys(game.players).length > 24) throw new WsException('Too many players');
    game.players[player.id] = player.name;
  }

  removePlayer(game_id: string, player_id: string) {
    const game: Game = games.get(game_id);
    if (!game) throw new WsException('Game not found');
    delete game.players[player_id];
    delete game.cards[player_id];
  }
}
