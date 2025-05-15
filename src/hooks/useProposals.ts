import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import { Proposal } from '@/src/pages/Governance';

const GovernorABI = GovernorArtifact.abi;

export function useProposals(
  governorAddress: string,
  provider: ethers.Provider
) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const governor = new ethers.Contract(
          governorAddress,
          GovernorABI,
          provider
        );
        const events = await governor.queryFilter(
          'ProposalCreated',
          0,
          'latest'
        );

        const mapped = await Promise.all(
          events.map(async (e: any) => {
            const state = await governor.state(e.args.proposalId);
            return {
              id: e.args.proposalId.toString(),
              status: interpretState(state),
              creatorAddress: e.args.proposer,
              startDate: new Date(),
              endDate: new Date(),
              result: { yes: 0n, no: 0n },
              totalVotingWeight: 0n,
              metadata: {
                title: e.args.description.split('\n')[0] || 'Untitled',
                summary: e.args.description.split('\n')[1] || '',
              },
            };
          })
        );

        setProposals(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [governorAddress, provider]);

  return { proposals, loading, error };
}

function interpretState(stateNumber: number) {
  const states = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed',
  ];
  return states[stateNumber] || 'Unknown';
}
