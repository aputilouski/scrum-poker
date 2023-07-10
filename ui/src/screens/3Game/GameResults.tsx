import { useGame } from 'app/GameManager';

const GameResults = () => {
  const { game, result } = useGame();

  if (game?.status !== 'ended' || !result) return null;

  return (
    <div className="h-28 flex flex-row justify-center gap-10 items-center pt-4 pb-12">
      <div className="flex flex-row gap-4">
        {Object.keys(result.stats).map(key => (
          <div>
            <div className="w-9 h-14 rounded border-gray-400 border-solid border-2 flex items-center justify-center">
              {key}
            </div>
            <div className="text-center mt-3 font-bold leading-none">
              {(result.stats as { [key: string]: number })[key]}
            </div>
          </div>
        ))}
      </div>
      <div className="font-bold text-center">
        <div className="text-2xl">Average:</div>
        <div className="mt-1 text-4xl">{result.average}</div>
      </div>
    </div>
  );
};

export default GameResults;
