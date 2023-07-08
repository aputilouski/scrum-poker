import { Button } from '@mantine/core';

const estimations = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24];
const EstimationCards = () => {
  return (
    <div className="pb-12 flex flex-row gap-3 justify-center">
      {estimations.map(estimation => (
        <Button key={estimation} className="w-20 h-28 text-3xl border-2" variant="outline">
          {estimation}
        </Button>
      ))}
    </div>
  );
};

const GamingDesk = () => {
  return (
    <div className="grow relative">
      <div className="bg-blue-500/20 w-64 h-36 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        Pick your cards!
      </div>
    </div>
  );
};

const Game = () => {
  return (
    <div className="flex flex-col h-full">
      <GamingDesk />
      <EstimationCards />
    </div>
  );
};

export default Game;
