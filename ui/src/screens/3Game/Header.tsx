import React from 'react';
import { ActionIcon, Button, CopyButton, TextInput } from '@mantine/core';
import { useGame } from 'app/GameManager';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';

const Username = () => {
  const { player } = useGame();

  const [isEditMode, setEditMode] = React.useState(false);
  const [name, setName] = React.useState(player.name);

  React.useEffect(() => {
    setName(player.name);
  }, [player.name]);

  return (
    <div className="flex items-center text-xl gap-1.5">
      {isEditMode ? (
        <TextInput value={name} onChange={e => setName(e.target.value)} />
      ) : (
        <span className="font-semibold">{player.name}</span>
      )}
      {isEditMode ? (
        <>
          <ActionIcon color="green" variant="light" onClick={() => setEditMode(!isEditMode)}>
            <IconCheck size={24} />
          </ActionIcon>
          <ActionIcon color="red" variant="light" onClick={() => setEditMode(!isEditMode)}>
            <IconX size={24} />
          </ActionIcon>
        </>
      ) : (
        <ActionIcon variant="subtle" onClick={() => setEditMode(!isEditMode)}>
          <IconEdit size={24} />
        </ActionIcon>
      )}
    </div>
  );
};

const Header = () => {
  const { game, quitGame } = useGame();
  if (!game) return null;
  return (
    <div className="absolute py-3 z-10 w-full flex justify-between">
      {/* <Username /> */}
      <div></div>
      <div className="flex gap-4">
        <CopyButton value={window.location.href}>
          {({ copied, copy }) => (
            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
              {copied ? 'Copied' : 'Copy url'}
            </Button>
          )}
        </CopyButton>

        <Button color="red" onClick={() => quitGame()}>
          Quit
        </Button>
      </div>
    </div>
  );
};

export default Header;
