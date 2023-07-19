import React from 'react';
import { Button } from '@mantine/core';
import { useGame } from 'app/GameManager';

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
      {game.cards.map(card => (
        <Button
          key={card}
          className="w-20 h-28 text-3xl border-2 tracking-tight"
          variant={game.players[player.id].card === card ? 'filled' : 'outline'}
          disabled={game.status === 'ended'}>
          {card}
        </Button>
      ))}
    </div>
  );
};

export default EstimationCards;
