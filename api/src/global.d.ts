type Player = { id: string; name: string };

type Game = {
  id: string;
  status: 'in-progress' | 'expiring' | 'ended';
  captain_id: string;
  players: {
    [k: string]: string;
  };
  cards: {
    [k: string]: number;
  };
  timer_id?: NodeJS.Timeout;
};
