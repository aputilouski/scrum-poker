import React from 'react';
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from 'app/GameManager';

const ChooseGame = () => {
  const form = useForm({
    initialValues: { id: '' },
    validate: { id: n => (/^.{8,}$/.test(n) ? null : 'Invalid game id') },
  });

  const { startGame } = useGame();

  React.useEffect(() => {
    const game_id = window.location.href.split('/game/')[1];
    if (game_id) startGame(game_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-sm h-full flex items-center">
      <div className="grow">
        <form onSubmit={form.onSubmit(({ id }) => startGame(id))}>
          <TextInput //
            autoFocus
            withAsterisk
            label="Game id"
            {...form.getInputProps('id')}
          />
          <Button className="block w-full mt-2" type="submit">
            Join game
          </Button>
        </form>

        <div className="text-center mt-5">or</div>

        <Button //
          className="block w-full mt-5"
          onClick={() => startGame()}
          size="lg">
          Create my game
        </Button>
      </div>
    </div>
  );
};

export default ChooseGame;
