import clsx from 'clsx';

const players = [
  'User0',
  'User1',
  'User2',
  'User3',
  'User4',
  'User5',
  'User6',
  'User7',
  'User8',
  'User9',
  'User10',
  'User11',
  'User12',
  'User13',
  'User14',
  'User15',
  'User16',
  'User17',
  'User19',
  'User20',
  'User21',
  'User22',
  'User23',
  'User24',
];

type PlayersBarProps = {
  position: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  players: string[];
};

const positionClassNames = {
  top: 'left-0 -top-24 flex-row w-full gap-12',
  right: '-right-20 top-0 flex-col h-full gap-6',
  bottom: 'left-0 -bottom-24 flex-row w-full gap-12',
  left: '-left-20 top-0 flex-col h-full gap-6',
};

const PlayersBar: React.FC<PlayersBarProps> = ({ position, className, players }) => {
  return (
    <div className={clsx('flex justify-center', positionClassNames[position], className)}>
      {players.map(player => (
        <div key={player} className="flex flex-col items-center gap-3 w-12">
          <div className="border-2 border-blue-500 border-solid w-9 h-14 flex justify-center items-center rounded">
            <span className="font-bold text-blue-500 text-lg">1</span>
          </div>
          <div className="font-bold leading-none">{player}</div>
        </div>
      ))}
    </div>
  );
};

const getPlayersByPosition = (players: string[]) =>
  players.reduce<{ top: string[]; right: string[]; bottom: string[]; left: string[] }>(
    (state, item, index) => {
      if (index < 4 || (index >= 16 && index < 18)) {
        if (index % 2) state.top.push(item);
        else state.bottom.push(item);
      } else if (index % 4 === 0) state.left.push(item);
      else if (index % 4 === 1) state.right.push(item);
      else if (index % 4 === 2) state.bottom.push(item);
      else state.top.push(item);
      return state;
    },
    { top: [], right: [], bottom: [], left: [] }
  );

const GamingDesk = () => {
  const { top, right, bottom, left } = getPlayersByPosition(players);

  return (
    <div className="grow relative">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="grid grid-cols-12 justify-items-center gap-1 w-max">
          {/* players at the left */}
          <div className="col-span-2">
            <PlayersBar position="left" players={left} />
          </div>

          {/* desc */}
          <div className="col-span-8 flex flex-col justify-center gap-4">
            {/* players at the top */}
            <PlayersBar position="top" players={top} />

            <div
              // w-96 h-56
              className=" bg-blue-500/25 flex items-center justify-center rounded-xl"
              style={{
                width: players.length > 10 ? 96 * (bottom.length + 1) : 384,
                height: players.length > 10 ? 56 * (bottom.length + 1) : 224,
              }}>
              <span className="text-lg">Pick your cards!</span>
            </div>

            {/* players at the bottom */}
            <PlayersBar position="bottom" players={bottom} />
          </div>

          {/* players at the right */}
          <div className="col-span-2">
            <PlayersBar position="right" players={right} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingDesk;
