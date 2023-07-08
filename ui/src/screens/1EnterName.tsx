import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from '../app/GameManager';

const EnterName = () => {
  const form = useForm({
    initialValues: { name: '' },
    validate: { name: n => (/^.{2,32}$/.test(n) ? null : 'Invalid name') },
  });

  const { setName } = useGame();

  return (
    <div className="mx-auto max-w-sm h-full flex items-center">
      <form className="grow mb-24" onSubmit={form.onSubmit(({ name }) => setName(name))}>
        <TextInput //
          autoFocus
          withAsterisk
          label="Enter your name"
          {...form.getInputProps('name')}
        />
        <Button className="block w-full mt-2" type="submit">
          Enter
        </Button>
      </form>
    </div>
  );
};

export default EnterName;
