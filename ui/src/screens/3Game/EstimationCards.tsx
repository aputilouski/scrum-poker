import React from 'react';
import { Button } from '@mantine/core';
import { useGame } from 'app/GameManager';

const estimations = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const EstimationCards = () => {
  const { player, game, chooseCard, result } = useGame();
  if (!game || !player) return null;
  if (game.status === 'ended' && result) return null;

  const onClick = (e: React.MouseEvent) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest('button');
    if (button) chooseCard(parseFloat(button.innerText));
  };

  return (
    <div className="pb-12 pt-4 flex flex-row gap-3 justify-center" onClick={onClick}>
      {estimations.map(estimation => (
        <Button
          key={estimation}
          className="w-20 h-28 text-3xl border-2 tracking-tight"
          variant={game.cards[player.id] === estimation ? 'filled' : 'outline'}
          disabled={game.status === 'ended'}>
          {estimation}
        </Button>
      ))}
    </div>
  );
};

export default EstimationCards;
