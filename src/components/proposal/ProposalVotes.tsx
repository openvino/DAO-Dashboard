import { useCallback } from 'react';
import VotesContent from '@/src/components/proposal/VotesContent';
import { Button } from '@/src/components/ui/Button';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { DetailedProposal } from '@/src/hooks/useProposal';
import { calcBigintPercentage, cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { ethers } from 'ethers';
import GovernorAbi from '@/src/abis/MyGovernor.json';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { useActiveAccount } from 'thirdweb/react';

interface ProposalVotesProps {
  proposal: DetailedProposal | null;
  loading: boolean;
  refetch: () => void;
  className?: string;
}

const getCategories = (proposal: DetailedProposal | null): Category[] => {
  if (!proposal) return [];

  const currentParticipation = calcBigintPercentage(
    proposal.usedVotingWeight ?? 0n,
    proposal.totalVotingWeight || 1n
  );

  const uniqueVoters =
    proposal?.votes?.reduce?.(
      (acc, vote) => acc.add(vote.address),
      new Set<string>()
    )?.size ?? 0;

  const start = proposal?.startDate
    ? format(new Date(proposal.startDate), 'Pp')
    : 'Unknown';
  const end = proposal?.endDate
    ? format(new Date(proposal.endDate), 'Pp')
    : 'Unknown';

  return [
    {
      title: 'Voting activity',
      items: [
        { label: 'Current participation', value: `${currentParticipation}%` },
        { label: 'Unique voters', value: uniqueVoters.toString() },
      ],
    },
    {
      title: 'Voting period',
      items: [
        { label: 'Start', value: start },
        { label: 'End', value: end },
      ],
    },
  ];
};

const ProposalVotes = ({
  proposal,
  loading,
  refetch,
  className,
}: ProposalVotesProps) => {
  const account = useActiveAccount();

  const handleVote = useCallback(
    async (support: number) => {
      try {
        if (!proposal) throw new Error('Missing proposal');
        if (!account?.address) throw new Error('No connected wallet');

        const signer = await ethers5Adapter.signer.toEthers({
          client,
          chain: baseSepolia,
          account,
        });

        const governor = new ethers.Contract(
          import.meta.env.VITE_GOVERNOR_ADDRESS!,
          GovernorAbi.abi,
          signer
        );

        const tx = await governor.castVote(proposal.id, support);
        await tx.wait();
        refetch();
      } catch (err) {
        console.error('❌ Error al votar:', err);
      }
    },
    [proposal, account, refetch]
  );

  return (
    <MainCard
      loading={loading}
      className={cn(
        'col-span-full flex flex-col gap-y-4 lg:col-span-4',
        className
      )}
      icon={HiChatBubbleLeftRight}
      header={
        <DefaultMainCardHeader
          value={proposal?.votes?.length ?? 0}
          label="votes"
        />
      }
      aside={
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" label="View details" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voting details</DialogTitle>
              <DialogDescription asChild>
                <CategoryList categories={getCategories(proposal)} />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <div className="flex items-end justify-end">
                <Button variant="subtle" label="Close" />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      }
    >
      {proposal && (
        <VotesContent
          proposal={proposal}
          refetch={refetch}
          onVote={handleVote}
        />
      )}
    </MainCard>
  );
};

export default ProposalVotes;
