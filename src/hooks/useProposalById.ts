import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { client } from '@/src/config/thirdwebClient';
import GovernorArtifact from '@/src/abis/MyGovernor.json';
import type { Proposal } from '@/src/pages/Governance';
import type { IProposalAction } from '@/src/components/proposal/ProposalActions';
import { knownContracts } from '@/src/utils/knownContracts';

function interpretState(n: number): Proposal['status'] {
  const states: Proposal['status'][] = [
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

/** getLogs en ventanas < 1000 bloques */
async function getLogsChunked(
  provider: ethers.providers.Provider,
  params: {
    address?: string;
    topics?: (string | null)[];
    fromBlock: number;
    toBlock: number;
  },
  chunkSize = 900
) {
  const latest = await provider.getBlockNumber();
  let start = Math.max(0, params.fromBlock);
  let end = Math.min(params.toBlock, latest);
  if (end < start) return [];

  const out: ethers.providers.Log[] = [];
  while (start <= end) {
    const windowEnd = Math.min(start + chunkSize, end);
    const logs = await provider.getLogs({
      ...params,
      fromBlock: start,
      toBlock: windowEnd,
    });
    out.push(...logs);
    start = windowEnd + 1;
  }
  return out;
}

export function useProposalById(id: string) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProposal = async () => {
      try {
        setLoading(true);

        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/routes/daoRoute`.replace(/([^:]\/)\/+/g, '$1');
        const secret = import.meta.env.VITE_API_SECRET;
        if (!apiUrl || !secret)
          throw new Error('Missing VITE_API_URL or VITE_API_SECRET');

        const res = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Secret': secret,
          },
        });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(
            `Backend error: ${res.status} ${res.statusText}\n${body}`
          );
        }

        const proposals: { id: string; block: number }[] = await res.json();
        const proposalInfo = proposals.find((p) => p.id === id);
        if (!proposalInfo) throw new Error('Proposal not found');

        const blockNumber = Number(proposalInfo.block);
        const provider = ethers5Adapter.provider.toEthers({
          client,
          chain: baseSepolia,
        });

        const governor = new ethers.Contract(
          import.meta.env.VITE_GOVERNOR_ADDRESS!,
          GovernorArtifact.abi,
          provider
        );

        // --- ProposalCreated en el mismo bloque (no necesita troceo) ---
        const createdTopic =
          governor.interface.getEventTopic('ProposalCreated');
        const logs = await provider.getLogs({
          address: governor.address,
          fromBlock: blockNumber,
          toBlock: blockNumber,
          topics: [createdTopic],
        });

        const ev = logs
          .map((log) => {
            try {
              return governor.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((log) => log?.args?.proposalId.toString() === id);

        if (!ev) throw new Error('ProposalCreated event not found');

        const creationBlock = await provider.getBlock(blockNumber);
        const creationDate = new Date(creationBlock.timestamp * 1000);

        // --- Estado on-chain ---
        const [stateBN, snapshotBN, deadlineBN, votes] = await Promise.all([
          governor.state(id),
          governor.proposalSnapshot(id),
          governor.proposalDeadline(id),
          governor.proposalVotes(id),
        ]);

        const [against, forVotes, abstain] = votes.map((v: any) =>
          BigInt(v.toString())
        );
        const totalVotes = against + forVotes + abstain;

        const startBlkNum = snapshotBN.toNumber();
        const endBlkNum = deadlineBN.toNumber();

        const [startBlock, endBlock] = await Promise.all([
          provider.getBlock(startBlkNum).catch(() => null),
          provider.getBlock(endBlkNum).catch(() => null),
        ]);

        const startDate = startBlock
          ? new Date(startBlock.timestamp * 1000)
          : creationDate;
        const endDate = endBlock
          ? new Date(endBlock.timestamp * 1000)
          : creationDate;

        // --- Decodificación de acciones desde ProposalCreated ---
        const targets = ev.args[2] as string[];
        const valuesBN = ev.args[3] as BigNumber[];
        const calldatas = ev.args[5] as string[];
        const descriptionRaw = ev.args[8] as string;
        const proposer = ev.args[1] as string;

        const [title, summary] =
          typeof descriptionRaw === 'string' && descriptionRaw.includes('\n')
            ? descriptionRaw.split('\n')
            : [descriptionRaw, ''];

        const actions: IProposalAction[] = calldatas.map((data, i) => {
          const target = targets[i];
          const value = valuesBN[i]?.toString() ?? '0';
          const contractInfo = knownContracts[target?.toLowerCase()];
          if (!contractInfo) {
            return {
              interface: 'unknown',
              method: 'rawCall',
              params: { target, value, calldata: data },
            };
          }
          try {
            const iface = new Interface(contractInfo.abi);
            const parsed = iface.parseTransaction({ data });
            const decodedParams: Record<string, any> = {};
            parsed.functionFragment.inputs.forEach((input, idx) => {
              decodedParams[input.name] = parsed.args[idx];
            });
            return {
              interface: contractInfo.name,
              method: parsed.name,
              params: {
                ...decodedParams,
                target: decodedParams.to ?? decodedParams.target ?? target,
                value: decodedParams.amount?.toString() ?? value,
                calldata: data,
              },
            };
          } catch {
            return {
              interface: contractInfo.name,
              method: 'unknown',
              params: { target, value, calldata: data },
            };
          }
        });

        // --- VoteCast (troceado) ---
        const latest = await provider.getBlockNumber();
        const voteFrom = Math.min(startBlkNum, latest);
        const voteTo = Math.min(endBlkNum, latest);

        let votesDetailed: {
          address: string;
          support: string;
          weight: bigint;
        }[] = [];
        if (voteTo >= voteFrom) {
          const voteTopic = governor.interface.getEventTopic('VoteCast');
          const voteLogs = await getLogsChunked(provider, {
            address: governor.address,
            topics: [voteTopic],
            fromBlock: voteFrom,
            toBlock: voteTo,
          });

          votesDetailed = voteLogs
            .map((log) => {
              try {
                const parsed = governor.interface.parseLog(log);
                const { voter, support, weight } = parsed.args as any;
                return {
                  address: String(voter),
                  support: support.toString(),
                  weight: BigInt(weight.toString()),
                };
              } catch {
                return null;
              }
            })
            .filter(Boolean) as any[];
        }

        const usedVotingWeight = votesDetailed.reduce(
          (acc, v) => acc + v.weight,
          0n
        );

        // --- ProposalExecuted (troceado) ---
        const execTopic = governor.interface.getEventTopic('ProposalExecuted');
        const execLogs = await getLogsChunked(provider, {
          address: governor.address,
          topics: [execTopic],
          fromBlock: blockNumber,
          toBlock: blockNumber + 5000, // margen; igual va troceado
        });

        const exec = execLogs
          .map((log) => {
            try {
              return governor.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((log) => log?.args?.proposalId.toString() === id);

        let executionDate: Date | undefined;
        if (exec) {
          const execBlock = await provider.getBlock(exec.blockNumber);
          executionDate = new Date(execBlock.timestamp * 1000);
        }

        const fullProposal: Proposal = {
          id,
          status: interpretState(Number(stateBN)),
          creatorAddress: proposer,
          startDate,
          endDate,
          creationDate,
          creationBlock: blockNumber,
          executionDate,
          result: { yes: forVotes, no: against },
          totalVotingWeight: totalVotes,
          usedVotingWeight,
          votes: votesDetailed,
          rawDescription: descriptionRaw,
          metadata: { title, summary },
          actions,
          targets,
          values: valuesBN.map((v) => v.toString()),
          calldatas,
        };

        if (!cancelled) setProposal(fullProposal);
      } catch (err: any) {
        console.error('Error loading proposal', err);
        if (!cancelled) {
          setError(err?.message || 'Unknown error');
          setProposal(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProposal();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { proposal, loading, error };
}
