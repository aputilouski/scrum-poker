import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { nanoid } from 'nanoid';

const games = new Map<string, Game>();

@Injectable()
export class GameService {
  create(captain: Player): Game {
    const game: Game = {
      id: nanoid(),
      status: 'in-progress',
      captain_id: captain.id,
      players: {
        [captain.id]: captain,
      },
      cards: [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    };
    games.set(game.id, game);
    return game;
  }

  getById(id: string): Game | undefined {
    const game = games.get(id);
    if (!game) throw new Error('Game not found');
    return game;
  }

  getAll() {
    return games.keys();
  }

  deleteById(id: string) {
    return games.delete(id);
  }
}
