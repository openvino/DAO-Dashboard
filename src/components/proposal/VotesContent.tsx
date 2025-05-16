// @ts-nocheck
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Progress } from '@/src/components/ui/Progress';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { Button } from '@/src/components/ui/Button';

import { formatUnits } from 'ethers/lib/utils';
import { DetailedProposal } from '@/src/types/detailedProposal';

interface VotesContentProps {
  proposal: DetailedProposal;
  refetch: () => void;
  onVote: (support: number) => void;
}

const VotesContent = ({ proposal, onVote }: VotesContentProps) => {
  const total = proposal.totalVotingWeight || 1n;
  const yes = proposal.result?.yes || 0n;
  const no = proposal.result?.no || 0n;
  const abstain = proposal.result?.abstain || 0n;

  const options = [
    { label: 'YES', value: yes },
    { label: 'NO', value: no },
    { label: 'ABSTAIN', value: abstain },
  ];

  const [selected, setSelected] = useState<string>('YES');

  const canVote = proposal.status === 'Active';

  const supportMap: Record<string, number> = {
    YES: 1,
    NO: 0,
    ABSTAIN: 2,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canVote) return;
    const support = supportMap[selected];
    if (support !== undefined) onVote(support);
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <RadioGroup value={selected} onValueChange={setSelected}>
        <Accordion type="single" collapsible className="space-y-2">
          {options.map(({ label, value }) => {
            const percentage = Number((value * 100n) / total);
            const formatted = Number(formatUnits(value, 18)).toFixed(2);
            return (
              <AccordionItem key={label} value={label}>
                <div className="flex flex-row items-center gap-x-2">
                  <RadioGroupItem value={label} id={label} />
                  <AccordionTrigger className="flex w-full flex-col gap-y-2">
                    <div className="flex w-full flex-row justify-between">
                      <p className="capitalize">{label}</p>
                      <div className="flex flex-row gap-x-4">
                        <p>{formatted} VOTES</p>
                        <p className="w-12 text-right text-primary">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                    <Progress value={percentage} size="sm" />
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  {value === 0n && (
                    <p className="text-center italic text-muted">
                      No votes yet.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </RadioGroup>

      <div className="flex flex-row items-center gap-x-4">
        <Button type="submit" disabled={!canVote}>
          Vote
        </Button>
      </div>
    </form>
  );
};

export default VotesContent;
