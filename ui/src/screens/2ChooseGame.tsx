import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from '../app/GameManager';

const ChooseGame = () => {
  const form = useForm({
    initialValues: { id: '' },
    // validate: { name: n => (/^.{2,32}$/.test(n) ? null : 'Invalid name') },
  });

  const { setGame } = useGame();

  return (
    <div className="mx-auto max-w-sm h-full flex items-center">
      <div className="grow">
        <form
        // onSubmit={form.onSubmit(({ name }) => setName(name))}
        >
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
          onClick={() => setGame('')}
          size="lg">
          Create my game
        </Button>
      </div>
    </div>
  );
};

export default ChooseGame;
