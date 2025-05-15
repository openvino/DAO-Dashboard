import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { Proposal, ProposalStatus } from '@/src/types/proposal';
import { hardcodedProposalIds } from '@/src/pages/Governance';

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

export function useAllProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

            const deadlineBlock = await provider.getBlock(
              deadlineBN.toNumber()
            );
            const deadlineDate = deadlineBlock
              ? new Date(deadlineBlock.timestamp * 1000)
              : new Date();

            const snapshotBlock = await provider.getBlock(
              snapshotBN.toNumber()
            );
            const startDate = snapshotBlock
              ? new Date(snapshotBlock.timestamp * 1000)
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
              actions: [],
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

  return { proposals, loading, error };
}
