import React from 'react';
import { Button } from '@mantine/core';

const estimations = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const EstimationCards = () => {
  const [selectedEstimation, setEstimation] = React.useState<number>();

  const onClick = (e: React.MouseEvent) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest('button');
    if (button)
      setEstimation(estimation => {
        const newEstimation = parseFloat(button.innerText);
        return newEstimation === estimation ? undefined : newEstimation;
      });
  };

  return (
    <div className="pb-12 pt-4 flex flex-row gap-3 justify-center" onClick={onClick}>
      {estimations.map(estimation => (
        <Button
          key={estimation}
          className="w-20 h-28 text-3xl border-2 tracking-tight"
          variant={selectedEstimation === estimation ? 'filled' : 'outline'}>
          {estimation}
        </Button>
      ))}
    </div>
  );
};

export default EstimationCards;
