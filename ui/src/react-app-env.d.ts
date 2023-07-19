/// <reference types="react-scripts" />

type Player = { id: string; name: string };

type Game = {
  id: string;
  status: 'in-progress' | 'expiring' | 'ended';
  captain_id: string;
  players: {
    [k: string]: Player & { card?: number };
  };
  cards: number[];
};
