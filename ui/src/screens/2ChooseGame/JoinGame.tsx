import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from 'app/GameManager';

const JoinGame = () => {
  const { startGame } = useGame();

  const form = useForm({
    initialValues: { id: '' },
    validate: { id: n => (/^.{8,}$/.test(n) ? null : 'Invalid game id') },
  });

  return (
    <form onSubmit={form.onSubmit(({ id }) => startGame(id))}>
      <TextInput //
        autoFocus
        withAsterisk
        label="Game id"
        {...form.getInputProps('id')}
      />
      <Button className="block w-full mt-2" type="submit">
        Join
      </Button>
    </form>
  );
};

export default JoinGame;
