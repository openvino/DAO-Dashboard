// src/components/newProposal/actions/SplitInput.tsx

import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { HiScissors } from 'react-icons/hi2';

export type ProposalFormSplitData = {
  name: 'split';
  tokenAddress: string;
};

export const emptySplitData: ProposalFormSplitData = {
  name: 'split',
  tokenAddress: import.meta.env.VITE_OVI_ADDRESS!,
};

export const SplitInput = ({ onRemove }: { onRemove: () => void }) => {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <HiScissors className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Split OVI tokens</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        This action will call <code>split()</code> on the OVI token contract.
      </p>
    </Card>
  );
};
