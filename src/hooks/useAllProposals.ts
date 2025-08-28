import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { Proposal, ProposalStatus } from '@/src/types/proposal';

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
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const fetchProposals = async () => {
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

        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/routes/daoRoute`.replace(/([^:]\/)\/+/g, '$1');
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Secret': import.meta.env.VITE_API_SECRET!,
          },
        });
        console.log('RESSSSSSS', res);

        if (!res.ok) throw new Error('Failed to fetch proposals from API');

        const rawProposals: { id: string; block: number }[] = await res.json();

        // ⏱️ Estimar secondsPerBlock
        const latest = await provider.getBlock('latest');
        await new Promise((r) => setTimeout(r, 3000));
        const latest2 = await provider.getBlock('latest');

        let secondsPerBlock = 12;
        if (latest2.number > latest.number) {
          secondsPerBlock =
            (latest2.timestamp - latest.timestamp) /
            (latest2.number - latest.number);
        }

        const allProposals: Proposal[] = [];

        for (const { id, block } of rawProposals) {
          const blockNumber = Number(block);

          try {
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
                  (targetBlock - creationBlock.number) * secondsPerBlock * 1000
              );
            };

            const startDate = estimateDateFromBlock(snapshotBN.toNumber());
            const endDate = estimateDateFromBlock(deadlineBN.toNumber());

            allProposals.push({
              id,
              status: interpretState(Number(stateBN)),
              creatorAddress: proposer,
              startDate,
              endDate,
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
            });

            await new Promise((r) => setTimeout(r, 250));
          } catch (innerErr) {
            console.warn(`⚠️ Skipping proposal ${id} due to error:`, innerErr);
          }
        }

        setProposals(allProposals);
      } catch (err: any) {
        console.error('❌ Error fetching all proposals:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, loading, error };
}
