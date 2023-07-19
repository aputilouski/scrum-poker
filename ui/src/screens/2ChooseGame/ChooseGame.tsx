import React from 'react';
import { Tabs } from '@mantine/core';
import { useGame } from 'app/GameManager';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';

const ChooseGame = () => {
  const { startGame } = useGame();

  React.useEffect(() => {
    const game_id = window.location.href.split('/game/')[1];
    if (game_id) startGame(game_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-sm h-full flex items-center">
      <Tabs defaultValue="join" className="grow mb-44">
        <Tabs.List position="center" className="mb-4">
          <Tabs.Tab value="join">Join Game</Tabs.Tab>
          <Tabs.Tab value="create">Create Game</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="join">
          <JoinGame />
        </Tabs.Panel>
        <Tabs.Panel value="create">
          <CreateGame />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ChooseGame;
