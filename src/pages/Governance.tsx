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
import { ethers } from 'ethers';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { IProposalAction } from '../components/proposal/ProposalActions';

export type ProposalStatus =
  | 'ALL'
  | 'Active'
  | 'Pending'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

export type Proposal = {
  id: string;
  status: ProposalStatus;
  creatorAddress: string;
  startDate: Date;
  endDate: Date;
  result: {
    yes: bigint;
    no: bigint;
  };
  totalVotingWeight: bigint;
  metadata: {
    title: string;
    summary: string;
  };
  actions: IProposalAction[];
};

const tabs: ProposalStatus[] = [
  'ALL',
  'Active',
  'Pending',
  'Succeeded',
  'Executed',
  'Defeated',
];

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
];

export default function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<ProposalStatus>('ALL');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const provider = ethers5Adapter.provider.toEthers({
          client,
          chain: baseSepolia,
        });
        const gov = new ethers.Contract(
          import.meta.env.VITE_GOVERNOR_ADDRESS!,
          GovernorArtifact.abi,
          provider
        );

        const allProposals = await Promise.all(
          hardcodedProposalIds.map(async ({ id, block }) => {
            const [stateBN, snapshotBN, deadlineBN, votes] = await Promise.all([
              gov.state(id),
              gov.proposalSnapshot(id),
              gov.proposalDeadline(id),
              gov.proposalVotes(id),
            ]);

            const [against, forVotes, abstain] = votes.map((v: any) =>
              BigInt(v.toString())
            );
            const totalVotes = against + forVotes + abstain;

            const logs = await gov.queryFilter(
              gov.filters.ProposalCreated(),
              block,
              block
            );
            const ev = logs.find((e) => e.args?.proposalId.toString() === id);

            const description: string = ev?.args?.description ?? '';
            const proposer: string = ev?.args?.proposer ?? '';
            const [title, summary] = description.split('\n');

            // Convertir deadlineBN a timestamp
            const deadlineBlock = await provider.getBlock(
              deadlineBN.toNumber()
            );
            const deadlineTimestamp = deadlineBlock?.timestamp;
            const deadlineDate = deadlineTimestamp
              ? new Date(deadlineTimestamp * 1000)
              : new Date();

            const snapshotBlock = await provider.getBlock(
              snapshotBN.toNumber()
            );
            const startTimestamp = snapshotBlock?.timestamp;
            const startDate = startTimestamp
              ? new Date(startTimestamp * 1000)
              : new Date();

            return {
              id,
              status: interpretState(Number(stateBN)),
              creatorAddress: proposer,
              startDate,
              endDate: deadlineDate,
              result: {
                yes: forVotes,
                no: against,
              },
              totalVotingWeight: totalVotes,
              metadata: {
                title: title || 'Untitled Proposal',
                summary: summary || '',
              },
            };
          })
        );

        setProposals(allProposals);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

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

function interpretState(n: number): ProposalStatus {
  const states: ProposalStatus[] = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed',
  ];
  return states[n] || 'Pending';
}
