import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

const games = new Map<string, Game>();

@Injectable()
export class GameService {
  create(captain: Player, cards: number[]): Game {
    if (!cards) throw new Error('No cards');
    const game: Game = {
      id: nanoid(),
      status: 'in-progress',
      captain_id: captain.id,
      players: {
        [captain.id]: captain,
      },
      cards,
    };
    games.set(game.id, game);
    return game;
  }

  get(id: string): Game | undefined {
    const game = games.get(id);
    if (!game) throw new Error('Game not found');
    return game;
  }

  remove(id: string) {
    return games.delete(id);
  }

  getAll() {
    return games.keys();
  }
}
