import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/src/components/ui/Card';
import { Proposal } from '@/src/pages/Governance';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalStatusBadge';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { cn, countdownText } from '@/src/lib/utils';

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const {
    id,
    status,
    creatorAddress,
    result,
    totalVotingWeight,
    metadata,
    endDate,
  } = proposal;

  const percentFor =
    totalVotingWeight > 0n
      ? Math.floor(Number((result.yes * 10000n) / totalVotingWeight) / 100)
      : 0;

  const statusText =
    status === 'Active'
      ? `Ends in ${countdownText(endDate)}`
      : status === 'Pending'
      ? 'Pending...'
      : `${percentFor}% For`;

  return (
    <Link to={`/governance/proposals/${id}`}>
      <Card className="transition-colors duration-200 hover:border-muted">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-semibold leading-tight">
              {metadata.title}
            </p>
            <span className="text-sm text-muted-foreground">
              {metadata.summary}
            </span>
          </div>
          <ProposalStatusBadge status={status} />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="hidden xs:inline">Proposed by </span>
            <Address
              address={creatorAddress}
              maxLength={AddressLength.Medium}
              hasLink={false}
              showCopy={false}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{statusText}</span>
            <HiOutlineArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
