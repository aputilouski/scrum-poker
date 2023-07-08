import React from 'react';

type GameReducerState = {
  step: number;
  name: string;
  game: string;
};
const initialState: GameReducerState = {
  step: 0,
  name: '',
  game: '',
};
const Reducer = (state: GameReducerState, action: { type: string; payload: any }) => {
  const { type, payload } = action;
  switch (type) {
    case 'set-name':
      return { ...state, name: payload, step: 1 };
    case 'create-game':
      return { ...state, game: payload, step: 2 };
    default:
      return state;
  }
};

type GameContextValue = GameReducerState & {
  setName: (n: string) => void;
  setGame: (n: string) => void;
};
const GameContext = React.createContext<GameContextValue>({
  ...initialState,
  setName: () => {},
  setGame: () => {},
});

type GameManagerProps = {
  children: (n: number) => React.ReactNode;
};
export const GameManager: React.FC<GameManagerProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(Reducer, initialState);

  const value = {
    ...state,
    setName: (payload: string) => dispatch({ type: 'set-name', payload }),
    setGame: (payload: string) => dispatch({ type: 'create-game', payload }),
  };

  console.log(value);

  // steps: 1 - enter name; 2 - join/create game; 3 - poker
  return <GameContext.Provider value={value}>{children(state.step)}</GameContext.Provider>;
};

export const useGame = () => React.useContext(GameContext);
