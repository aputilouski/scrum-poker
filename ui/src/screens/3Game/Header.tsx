import { Button, CopyButton } from '@mantine/core';
import { useGame } from 'app/GameManager';

const Header = () => {
  const { game, quitGame } = useGame();
  if (!game) return null;
  return (
    <div className="absolute py-3 z-10 w-full flex justify-between">
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
