import React from 'react';
import { TextInput, Select, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from 'app/GameManager';

const votingSystems = [
  {
    value: 'fibonacci',
    label: 'Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)',
    cards: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
  },
  {
    value: 'quadratic',
    label: 'Powers of 2 (0, 1, 2, 4, 8, 16, 32, 64)',
    cards: [0, 1, 2, 4, 8, 16, 32, 64],
  },
  {
    value: 'intermediate',
    label: 'Intermediate (0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)',
    cards: [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
  },
  {
    value: 'custom',
    label: 'Custom',
    cards: [],
  },
];

const CreateGame = () => {
  const { startGame } = useGame();

  const form = useForm({
    initialValues: {
      votingSystem: 'fibonacci',
      values: '1,2,3,5,8,13',
    },
    validate: { values: n => (/^\d+(\.\d+)?(\s*,\s*\d+(\.\d+)?)*$/.test(n) ? null : 'Invalid string') },
  });

  const { setFieldValue } = form;

  React.useEffect(() => {
    const values = localStorage.getItem('custom-cards');
    if (!values) return;
    setFieldValue('values', values);
  }, [setFieldValue]);

  const onSubmit = ({ votingSystem, values }: { votingSystem: string; values: string }) => {
    const cards =
      votingSystem === 'custom'
        ? values.replace(/ /g, '').split(',').map(Number)
        : votingSystems.find(s => s.value === votingSystem)?.cards;
    if (votingSystem === 'custom') localStorage.setItem('custom-cards', values);

    return startGame(undefined, cards);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={form.onSubmit(onSubmit)}>
      <Select //
        label="Voting system"
        data={votingSystems}
        {...form.getInputProps('votingSystem')}
      />

      {form.values.votingSystem === 'custom' && (
        <TextInput //
          autoFocus
          withAsterisk
          label="Enter your values"
          {...form.getInputProps('values')}
        />
      )}

      <Button className="block w-full" type="submit">
        Create
      </Button>
    </form>
  );
};

export default CreateGame;
