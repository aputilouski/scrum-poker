import { Button } from '@mantine/core';
import { useGame } from 'app/GameManager';
import clsx from 'clsx';
import React from 'react';

type PlayersBarProps = {
  position: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  players: string[];
  game: Game;
};

const positionClassNames = {
  top: 'left-0 -top-24 flex-row w-full gap-12',
  right: '-right-20 top-0 flex-col h-full gap-6',
  bottom: 'left-0 -bottom-24 flex-row w-full gap-12',
  left: '-left-20 top-0 flex-col h-full gap-6',
};

const PlayersBar: React.FC<PlayersBarProps> = ({ position, className, players: keys, game }) => (
  <div className={clsx('flex justify-center', positionClassNames[position], className)}>
    {keys.map(key => (
      <div key={key} className="flex flex-col items-center gap-3 w-12">
        {game.status !== 'ended' ? (
          <div className={clsx('w-9 h-14 rounded', game.cards[key] ? 'bg-blue-500' : 'bg-gray-200')} />
        ) : (
          <div className="border-2 border-blue-500 border-solid w-9 h-14 flex justify-center items-center rounded">
            <span className="font-bold text-blue-500 text-lg">{game.cards[key]}</span>
          </div>
        )}

        <div className="font-bold leading-none">{game.players[key]}</div>
      </div>
    ))}
  </div>
);

const getPlayersByPosition = (keys: string[]) =>
  keys.reduce<{ top: string[]; right: string[]; bottom: string[]; left: string[] }>(
    (state, key, index) => {
      if (index < 4 || (index >= 16 && index < 18)) {
        if (index % 2) state.top.push(key);
        else state.bottom.push(key);
      } else if (index % 4 === 0) state.left.push(key);
      else if (index % 4 === 1) state.right.push(key);
      else if (index % 4 === 2) state.bottom.push(key);
      else state.top.push(key);
      return state;
    },
    { top: [], right: [], bottom: [], left: [] }
  );

const GamingDesk = () => {
  const { game, player, processGame } = useGame();

  const [timing, setTiming] = React.useState<number>(3);
  React.useEffect(() => {
    if (!game?.status) return;
    if (game.status === 'in-progress') setTiming(3);
    else if (game.status === 'expiring') {
      const timer1 = setTimeout(() => setTiming(t => t - 1), 1000);
      const timer2 = setTimeout(() => setTiming(t => t - 1), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [game?.status]);

  if (!game) return null;

  const keys = Object.keys(game.players);

  const { top, right, bottom, left } = getPlayersByPosition(keys);

  const isCaptain = game.captain_id === player.id;
  const allowShowCards = isCaptain && Object.keys(game.cards).length;

  return (
    <div className="grow relative">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="grid grid-cols-12 justify-items-center gap-1 w-max">
          {/* players at the left */}
          <div className="col-span-2">
            <PlayersBar position="left" players={left} game={game} />
          </div>

          <div className="col-span-8 flex flex-col justify-center gap-4">
            {/* players at the top */}
            <PlayersBar position="top" players={top} game={game} />

            {/* desc */}
            <div
              className=" bg-blue-500/25 flex items-center justify-center rounded-xl"
              style={{
                width: keys.length > 10 ? 96 * (bottom.length + 1) : 384,
                height: keys.length > 10 ? 56 * (bottom.length + 1) : 224,
              }}>
              {game.status === 'in-progress' &&
                (allowShowCards ? (
                  <Button onClick={() => processGame()} size="lg">
                    Show Cards
                  </Button>
                ) : (
                  <span className="text-lg">Pick your cards!</span>
                ))}
              {game.status === 'expiring' && <div className="font-bold text-5xl">{timing}</div>}
              {game.status === 'ended' && isCaptain && (
                <Button onClick={() => processGame()} size="lg" color="dark">
                  Play again
                </Button>
              )}
            </div>

            {/* players at the bottom */}
            <PlayersBar position="bottom" players={bottom} game={game} />
          </div>

          {/* players at the right */}
          <div className="col-span-2">
            <PlayersBar position="right" players={right} game={game} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingDesk;
