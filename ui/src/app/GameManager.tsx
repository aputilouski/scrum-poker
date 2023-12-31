import React from 'react';
import { useConnection } from './ConnectionProvider';

type GameReducerState = {
  // loading: boolean;
  step: number;
  player: Player;
  game?: Game;
  result?: { stats: { [k: number]: number }; average: string };
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
    case 'quit-game':
      return { ...state, game: undefined, step: 1, result: undefined };
    case 'choose-card': {
      if (!state.game) return state;
      const { player_id, value } = payload as { player_id: string; value: number };
      const game = { ...state.game };
      game.players = { ...game.players };
      if (value) game.players[player_id].card = value;
      else delete game.players[player_id].card;
      return { ...state, game };
    }
    case 'add-player': {
      if (!state.game) return state;
      const { id } = payload as Player;
      const game = { ...state.game };
      game.players = { ...game.players, [id]: payload };
      return { ...state, game };
    }
    case 'remove-player': {
      if (!state.game) return state;
      const game = { ...state.game };
      game.players = { ...game.players };
      delete game.players[payload];
      return { ...state, game };
    }
    case 'game-status': {
      if (!state.game) return state;
      const game = { ...state.game, status: payload as Game['status'] };
      if (game.status === 'in-progress')
        Object.values(game.players).forEach(p => {
          delete p.card;
        });
      return { ...state, game, result: undefined };
    }
    case 'set-result': {
      return { ...state, result: payload };
    }
    default:
      return state;
  }
};

type GameContextValue = GameReducerState & {
  setName: (n: string) => void;
  startGame: (n?: string, cards?: number[]) => void;
  chooseCard: (value: number) => void;
  processGame: () => void;
  quitGame: () => void;
};
const GameContext = React.createContext<GameContextValue>({
  ...initialState,
  setName: () => {},
  startGame: () => {},
  chooseCard: () => {},
  processGame: () => {},
  quitGame: () => {},
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
    connection?.emit('player:connect', JSON.parse(value), (payload: GameReducerState['player']) => {
      dispatch({ type: 'set-player', payload });
      // dispatch({ type: 'set-loading', payload: false });
    });
  }, [connection]);

  React.useEffect(() => {
    if (!connection) return;
    connection.on('game:card-chosen', (payload: { game_id: string; player_id: string; value?: number }) => {
      dispatch({ type: 'choose-card', payload });
    });
    connection.on('game:new-player', (payload: Player) => dispatch({ type: 'add-player', payload }));
    connection.on('game:update-status', (payload: string, gameResult: GameReducerState['result']) => {
      dispatch({ type: 'game-status', payload });
      if (gameResult) dispatch({ type: 'set-result', payload: gameResult });
    });
    connection.on('game:remove-player', (payload: string) => dispatch({ type: 'remove-player', payload }));
    return () => {
      connection.off('game:card-chosen');
      connection.off('game:new-player');
    };
  }, [connection]);

  if (!connection) return null; // TODO: add loader

  const value = {
    ...state,
    setName: (name: string) => {
      connection.emit('player:create', name, (payload: GameReducerState['player']) => {
        localStorage.setItem('player', JSON.stringify(payload));
        dispatch({ type: 'set-player', payload });
      });
    },
    startGame: (game_id?: string, cards?: number[]) => {
      connection.emit('game:start', game_id, cards, (game: Exclude<GameReducerState['game'], undefined>) => {
        dispatch({ type: 'set-game', payload: game });
        window.history.pushState(null, '', `/game/${game.id}`);
      });
    },
    chooseCard: (payload: number) => connection.emit('game:choose-card', state.game.id, payload),
    processGame: () => connection.emit('game:process', state.game.id),
    quitGame: () => {
      window.history.pushState(null, '', '/');
      dispatch({ type: 'quit-game' });
      connection.emit('game:quit', state.game.id);
    },
  };

  // steps: 1 - enter name; 2 - join/create game; 3 - poker
  return <GameContext.Provider value={value}>{children(state.step)}</GameContext.Provider>;
};

export const useGame = () => React.useContext(GameContext);
