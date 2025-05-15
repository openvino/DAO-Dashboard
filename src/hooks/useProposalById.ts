import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
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

export function useProposalById(id: string, blockNumber: number) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !blockNumber) return;

    const fetch = async () => {
      try {
        setLoading(true);

        const provider = ethers5Adapter.provider.toEthers({
          client,
          chain: baseSepolia,
        });

        const governor = new ethers.Contract(
          import.meta.env.VITE_GOVERNOR_ADDRESS!,
          GovernorArtifact.abi,
          provider
        );

        // Medición del tiempo entre bloques
        let secondsPerBlock = 13;
        try {
          const blockA = await provider.getBlock('latest');
          await new Promise((r) => setTimeout(r, 3000));
          const blockB = await provider.getBlock('latest');
          if (blockB.number > blockA.number) {
            secondsPerBlock =
              (blockB.timestamp - blockA.timestamp) /
              (blockB.number - blockA.number);
          }
        } catch {}

        const logs = await provider.getLogs({
          address: governor.address,
          fromBlock: blockNumber,
          toBlock: blockNumber,
          topics: [governor.interface.getEventTopic('ProposalCreated')],
        });

        const parsedLogs = logs
          .map((log) => {
            try {
              return governor.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        const ev = parsedLogs.find(
          (log) => log?.args?.proposalId.toString() === id
        );
        if (!ev) throw new Error('ProposalCreated event not found');

        const creationBlock = await provider.getBlock(blockNumber);
        const creationDate = new Date(creationBlock.timestamp * 1000);

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

        const getDateFromBlock = async (blockNum: number): Promise<Date> => {
          const block = await provider.getBlock(blockNum);
          return block
            ? new Date(block.timestamp * 1000)
            : new Date(
                Date.now() +
                  (blockNum - creationBlock.number) * secondsPerBlock * 1000
              );
        };

        const startDate = await getDateFromBlock(Number(snapshotBN));
        const endDate = await getDateFromBlock(Number(deadlineBN));

        const args = ev.args;
        console.log('args', args);

        const targets = ev.args[2] as string[];
        const valuesBN = ev.args[3] as ethers.BigNumber[];
        const signatures = ev.args[4] as string[];
        const calldatas = ev.args[5] as string[];
        const voteStart = ev.args[6] as ethers.BigNumber;
        const voteEnd = ev.args[7] as ethers.BigNumber;
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
          console.log(
            'descriptionRaw',
            descriptionRaw,
            'targets',
            targets,
            'valuesBN',
            valuesBN,
            'calldatas',
            calldatas
          );

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

        const voteLogs: ethers.EventLog[] = [];
        const chunkSize = 1000;
        for (
          let from = snapshotBN.toNumber();
          from <= deadlineBN.toNumber();
          from += chunkSize
        ) {
          const to = Math.min(from + chunkSize - 1, deadlineBN.toNumber());
          try {
            const chunkLogs = await governor.queryFilter(
              governor.filters.VoteCast(),
              from,
              to
            );
            voteLogs.push(...chunkLogs);
          } catch {}
        }

        const votesDetailed = voteLogs.map((log) => {
          const { voter, support, weight } = log.args;
          return {
            address: voter,
            support: support.toString(),
            weight: BigInt(weight.toString()),
          };
        });

        const usedVotingWeight = votesDetailed.reduce(
          (acc, v) => acc + v.weight,
          0n
        );

        let executionDate: Date | undefined;
        const execLogs = await governor.queryFilter(
          governor.filters.ProposalExecuted(),
          blockNumber,
          blockNumber + 1000
        );
        const exec = execLogs.find(
          (log) => log.args?.proposalId.toString() === id
        );
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

        setProposal(fullProposal);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setProposal(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, blockNumber]);

  return { proposal, loading, error };
}
