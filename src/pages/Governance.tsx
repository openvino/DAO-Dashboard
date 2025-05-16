import { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/Tabs';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import SortSelector from '@/src/components/ui/SortSelector';
import ProposalCard from '@/src/components/governance/ProposalCard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { cn } from '@/src/lib/utils';
import { Proposal, ProposalStatus } from '@/src/types/proposal';
import { useAllProposals } from '@/src/hooks/useAllProposals';

const tabs: ProposalStatus[] = [
  'ALL',
  'Active',
  'Pending',
  'Succeeded',
  'Executed',
  'Defeated',
];

export default function Governance() {
  const [currentTab, setCurrentTab] = useState<ProposalStatus>('ALL');

  const { proposals, loading, error } = useAllProposals();

  const filteredProposals =
    currentTab === 'ALL'
      ? proposals
      : proposals.filter((p) => p.status === currentTab);

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Proposals"
        aside={
          <Link
            to="/governance/new-proposal"
            variant="default"
            label="New proposal"
          />
        }
      />

      <Tabs
        defaultValue="ALL"
        onValueChange={(v) => setCurrentTab(v as ProposalStatus)}
      >
        {/* Tabs UI */}
        <div className="flex flex-wrap items-center gap-x-4">
          <TabsList className="flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                <span className="capitalize">{tab.toLowerCase()}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <SortSelector setSortBy={() => {}} setDirection={() => {}} />
        </div>

        {/* Tabs Content */}
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <ProposalCardList
              proposals={filteredProposals}
              loading={loading}
              error={error}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ProposalCardList({
  proposals,
  loading,
  error,
  doubleColumn = true,
}: {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
  doubleColumn?: boolean;
}) {
  if (loading) {
    return (
      <div className={cn('grid gap-4', doubleColumn && 'lg:grid-cols-2')}>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!proposals.length) {
    return <p className="text-center text-gray-500">No proposals found</p>;
  }

  return (
    <div className={cn('grid gap-4', doubleColumn && 'lg:grid-cols-2')}>
      {proposals.map((p) => (
        <ProposalCard key={p.id} proposal={p} />
      ))}
    </div>
  );
}
