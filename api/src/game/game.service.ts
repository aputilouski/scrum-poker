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

  chooseCard(game_id: string, player_id: string, value: number) {
    const game: Game = games.get(game_id);
    if (!game) throw new WsException('Game not found');
    game.cards[player_id] = value;
  }

  changeGameStatus(game: Game, status: Game['status']) {
    game.status = status;
  }

  // findAll() {
  //   return `This action returns all game`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} game`;
  // }

  // update(id: number, updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} game`;
  // }
}
