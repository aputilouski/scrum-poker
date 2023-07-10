import EstimationCards from './EstimationCards';
import GamingDesk from './GamingDesk';
import GameResults from './GameResults';
import Header from './Header';

const Game = () => (
  <div className="flex flex-col h-full">
    <Header />
    <GamingDesk />
    <EstimationCards />
    <GameResults />
  </div>
);

export default Game;
