import History from '@/src/components/icons/History';
import ProposalMilestone from '@/src/components/proposal/ProposalMilestone';
import { MainCard } from '@/src/components/ui/MainCard';
import type { Proposal } from '@/src/pages/Governance';

const ProposalHistory = ({
  proposal,
  loading = false,
  className,
}: {
  proposal: Proposal;
  loading?: boolean;
  className?: string;
}) => {
  const {
    status,
    creationDate,
    creationBlock,
    startDate,
    endDate,
    executionDate,
  } = proposal;

  const milestones = [
    {
      label: 'Published',
      variant: 'done',
      date: creationDate,
      blockNumber: creationBlock,
    },
    {
      label: 'Voting starts',
      variant: status === 'Pending' ? 'upcoming' : 'done',
      date: startDate,
    },
    {
      label: 'Voting ends',
      variant: status === 'Active' ? 'loading' : 'done',
      date: endDate,
    },
    ...(status === 'Executed'
      ? [
          {
            label: 'Executed',
            variant: 'done',
            date: executionDate ?? new Date(),
          },
        ]
      : []),
  ];

  return (
    <MainCard
      loading={loading}
      className={className}
      icon={History}
      header="History"
    >
      <div className="relative">
        <div className="absolute bottom-6 left-[0.5625rem] top-2 w-0.5 bg-popover-foreground/60" />
        <div className="relative z-10 flex flex-col gap-y-6">
          {milestones.map((milestone, i) => (
            <ProposalMilestone
              key={i}
              label={milestone.label}
              variant={milestone.variant}
              date={milestone.date}
              blockNumber={milestone.blockNumber}
              className=""
            />
          ))}
        </div>
      </div>
    </MainCard>
  );
};

export default ProposalHistory;
