import React from 'react';
import { useConnection } from './ConnectionProvider';

type GameReducerState = {
  // loading: boolean;
  step: number;
  player: Player;
  game?: Game;
};

const initialState: GameReducerState = {
  // loading: false,
  step: 0,
  player: { id: '', name: '' },
};

const Reducer = (state: GameReducerState, action: { type: string; payload?: any }) => {
  const { type, payload } = action;
  switch (type) {
    case 'set-loading':
      return { ...state, loading: payload };
    case 'set-player':
      return { ...state, player: payload, step: 1 };
    case 'set-game':
      return { ...state, game: payload, step: 2 };
    case 'choose-card': {
      const { player_id, value } = payload as { player_id: string; value: number };
      const game = { ...state.game };
      game.cards = { ...game.cards, [player_id]: value };
      return { ...state, game };
    }
    case 'new-player': {
      const { id, name } = payload as Player;
      const game = { ...state.game };
      game.players = { ...game.players, [id]: name };
      return { ...state, game };
    }
    case 'game-status': {
      const game = { ...state.game, status: payload };
      return { ...state, game };
    }
    default:
      return state;
  }
};

type GameContextValue = GameReducerState & {
  setName: (n: string) => void;
  startGame: (n?: string) => void;
  chooseCard: (value: number) => void;
  processGame: () => void;
};
const GameContext = React.createContext<GameContextValue>({
  ...initialState,
  setName: () => {},
  startGame: () => {},
  chooseCard: () => {},
  processGame: () => {},
});

type GameManagerProps = {
  children: (n: number) => React.ReactNode;
};
export const GameManager: React.FC<GameManagerProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(Reducer, initialState);

  const connection = useConnection();

  React.useEffect(() => {
    const value = localStorage.getItem('player');
    if (!connection || !value) return;
    // dispatch({ type: 'set-loading', payload: true });
    connection?.emit('player:init', JSON.parse(value), (payload: GameReducerState['player']) => {
      dispatch({ type: 'set-player', payload });
      // dispatch({ type: 'set-loading', payload: false });
    });
  }, [connection]);

  React.useEffect(() => {
    if (!connection) return;
    connection.on('game:card-chosen', (payload: { game_id: string; player_id: string; value: number }) => {
      dispatch({ type: 'choose-card', payload });
    });
    connection.on('game:new-player', (payload: Player) => dispatch({ type: 'new-player', payload }));
    connection.on('game:status-change', (payload: string) => dispatch({ type: 'game-status', payload }));
    return () => {
      connection.off('game:card-chosen');
      connection.off('game:new-player');
    };
  }, [connection]);

  if (!connection) return null; // TODO: add loader

  const value = {
    ...state,
    setName: (payload: string) => {
      connection.emit('player:create', payload, (payload: GameReducerState['player']) => {
        localStorage.setItem('player', JSON.stringify(payload));
        dispatch({ type: 'set-player', payload });
      });
    },
    startGame: (payload?: string) => {
      connection.emit('game:start', payload, (game: Exclude<GameReducerState['game'], undefined>) => {
        dispatch({ type: 'set-game', payload: game });
        window.history.pushState(state, '', `/game/${game.id}`);
      });
    },
    chooseCard: (payload: number) => connection.emit('game:choose-card', state.game.id, payload),
    processGame: () => connection.emit('game:process', state.game.id),
  };

  console.log(value);

  // steps: 1 - enter name; 2 - join/create game; 3 - poker
  return <GameContext.Provider value={value}>{children(state.step)}</GameContext.Provider>;
};

export const useGame = () => React.useContext(GameContext);
