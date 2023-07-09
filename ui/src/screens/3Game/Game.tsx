import EstimationCards from './EstimationCards';
import GamingDesk from './GamingDesk';

const Game = () => {
  return (
    <div className="flex flex-col h-full">
      <GamingDesk />
      <EstimationCards />
    </div>
  );
};

export default Game;
