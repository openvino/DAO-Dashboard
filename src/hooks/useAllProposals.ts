import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { Proposal, ProposalStatus } from '@/src/types/proposal';

// Base Sepolia block time is ~2 seconds — no need to estimate dynamically
const BASE_SEPOLIA_SECONDS_PER_BLOCK = 2;

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
  return states[n] ?? 'Pending';
}

export function useAllProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProposals = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(null);

    try {
      const provider = ethers5Adapter.provider.toEthers({
        client,
        chain: baseSepolia,
      });

      const gov = new ethers.Contract(
        import.meta.env.VITE_GOVERNOR_ADDRESS!,
        GovernorArtifact.abi,
        provider
      );

      const apiUrl = `${import.meta.env.VITE_API_URL}/api/routes/daoRoute`.replace(
        /([^:]\/)\/+/g,
        '$1'
      );
      const res = await fetch(apiUrl, {
        signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': import.meta.env.VITE_API_SECRET!,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch proposals from API');
      const rawProposals: { id: string; block: number }[] = await res.json();

      if (signal.aborted) return;

      // Fetch all proposals in parallel instead of a sequential loop with delays
      const settled = await Promise.allSettled(
        rawProposals.map(async ({ id, block }) => {
          const blockNumber = Number(block);

          const [stateBN, snapshotBN, deadlineBN, votes] = await Promise.all([
            gov.state(id),
            gov.proposalSnapshot(id),
            gov.proposalDeadline(id),
            gov.proposalVotes(id),
          ]);

          const [against, forVotes, abstain] = (votes as unknown[]).map((v) =>
            BigInt(String(v))
          );
          const totalVotes = against + forVotes + abstain;

          const logs = await gov.queryFilter(
            gov.filters.ProposalCreated(),
            blockNumber,
            blockNumber
          );

          const ev = logs.find((e) => e.args?.proposalId.toString() === id);
          const description: string = ev?.args?.description ?? '';
          const proposer: string = ev?.args?.proposer ?? '';
          const [title, summary] = description.split('\n');

          const creationBlock = await provider.getBlock(blockNumber);

          const estimateDateFromBlock = (targetBlock: number): Date => {
            if (!creationBlock) return new Date();
            return new Date(
              creationBlock.timestamp * 1000 +
                (targetBlock - creationBlock.number) *
                  BASE_SEPOLIA_SECONDS_PER_BLOCK *
                  1000
            );
          };

          const proposal: Proposal = {
            id,
            status: interpretState(Number(stateBN)),
            creatorAddress: proposer,
            startDate: estimateDateFromBlock(snapshotBN.toNumber()),
            endDate: estimateDateFromBlock(deadlineBN.toNumber()),
            result: { yes: forVotes, no: against },
            totalVotingWeight: totalVotes,
            metadata: {
              title: title || 'Untitled Proposal',
              summary: summary || '',
            },
            actions: [],
          };

          return proposal;
        })
      );

      if (signal.aborted) return;

      const allProposals = settled
        .filter(
          (r): r is PromiseFulfilledResult<Proposal> =>
            r.status === 'fulfilled'
        )
        .map((r) => r.value);

      setProposals(allProposals);
    } catch (err: unknown) {
      if (signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchProposals]);

  return { proposals, loading, error, refetch: fetchProposals };
}
