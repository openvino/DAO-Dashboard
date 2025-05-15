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

export const hardcodedProposalIds: { id: string; block: number }[] = [
  {
    id: '110664158105031933321125525643773478483973945942984556224307758697209944246691',
    block: 25695261,
  },
  {
    id: '53184518023209607080525264667174190731347558945314659756361983511068992607911',
    block: 25708968,
  },
  {
    id: '89799653266998763745583561601686007658116643360931552939368469768171861005453',
    block: 25713656,
  },
  {
    id: '67236855299273384960241026464823341576464283184860174446183126437190215485679',
    block: 25714178,
  },
  {
    id: '105140702467737098054927589847089173940016718726380961764031334710864584625405',
    block: 25720883,
  },
  {
    id: '94179336985877532761371975394087276872831672186078322023245543631954924036992',
    block: 25739849,
  },
  {
    id: '20588325011978504911592413150860794060487008317810190675824731199459467179507',
    block: 25757584,
  },
  {
    id: '10684351425366435751996992516075295388903925133107568952668290889063512079337',
    block: 25760526,
  },
];

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
