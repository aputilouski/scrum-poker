import { theme } from '../theme';
import { MantineProvider } from '@mantine/core';
import { GameManager } from './GameManager';
import Layout from '../components/Layout';
import EnterName from '../screens/1EnterName';
import ChooseGame from '../screens/2ChooseGame';
import Game from '../screens/3Game';
import { Notifications } from '@mantine/notifications';
import { ConnectionProvider } from './ConnectionProvider';

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
    <MantineProvider withNormalizeCSS withGlobalStyles theme={theme}>
      <Notifications />
      <Layout>
        <ConnectionProvider>
          <GameManager>{getStep}</GameManager>
        </ConnectionProvider>
      </Layout>
    </MantineProvider>
  );
};

export default App;
