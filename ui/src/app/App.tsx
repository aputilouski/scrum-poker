import { theme } from '../theme';
import { MantineProvider } from '@mantine/core';
import { GameManager } from './GameManager';
import Layout from '../components/Layout';
import EnterName from '../screens/1EnterName';
import ChooseGame from '../screens/2ChooseGame';
import Game from '../screens/3Game';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:9000', { transports: ['websocket'] });

// socket.emit('test', { name: 'Nest' }, (response: string) => console.log(typeof response, response));

const App = () => {
  const getStep = (step: number) => {
    switch (step) {
      case 1:
        return <ChooseGame />;
      case 2:
        return <Game />;
      case 0:
      default:
        return <EnterName />;
    }
  };

  return (
    <MantineProvider withNormalizeCSS theme={theme}>
      <Layout>
        <GameManager>{getStep}</GameManager>
      </Layout>
    </MantineProvider>
  );
};

export default App;
