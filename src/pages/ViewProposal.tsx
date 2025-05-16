import { useParams } from 'react-router-dom';
import { HiChevronLeft, HiOutlineClock } from 'react-icons/hi2';
import { Link } from '@/src/components/ui/Link';
import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalStatusBadge';
import ProposalVotes from '@/src/components/proposal/ProposalVotes';
import ProposalActions from '@/src/components/proposal/ProposalActions';
import ProposalHistory from '@/src/components/proposal/ProposalHistory';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';
import { countdownText } from '@/src/lib/utils';
import { useProposalById } from '@/src/hooks/useProposalById';
import { hardcodedProposalIds } from './Governance';
import { useActiveAccount } from 'thirdweb/react';
import { ethers } from 'ethers';
import { govAbi } from '@/src/abis/governor';
import { baseSepolia } from 'thirdweb/chains';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { client } from '@/src/config/thirdwebClient';
import { decodeRevertReason } from '@/src/utils/decodeRevertReason';

type ViewParams = { id: string };

const ViewProposal: React.FC = () => {
  const { id } = useParams<ViewParams>();
  const account = useActiveAccount();
  const userAddress = account?.address;

  const { proposal, loading, error } = useProposalById(id || '');

  if (loading) {
    return (
      <div className="space-y-2">
        <Link
          to="/governance"
          icon={HiChevronLeft}
          variant="outline"
          label="All proposals"
          className="text-lg"
        />
        <HeaderCard loading title="Loading proposal..." />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="space-y-2">
        <Link
          to="/governance"
          icon={HiChevronLeft}
          variant="outline"
          label="All proposals"
          className="text-lg"
        />
        <HeaderCard title={error ?? 'Proposal not found'} />
      </div>
    );
  }

  const {
    metadata: { title, summary },
    creatorAddress,
    status,
    startDate,
    endDate,
    executionDate,
    result,
    totalVotingWeight,
    rawDescription,
    targets,
    values,
    calldatas,
  } = proposal;

  const statusText = () => {
    switch (status) {
      case 'Pending':
        return 'Starts in ' + countdownText(startDate);
      case 'Active':
        return 'Ends in ' + countdownText(endDate);
      case 'Queued':
        return executionDate
          ? 'Executed ' + countdownText(executionDate) + ' ago'
          : 'Ready to execute';
      case 'Executed':
        return (
          'Executed ' +
          (executionDate ? countdownText(executionDate) + ' ago' : '')
        );
      default:
        return 'Ended ' + countdownText(endDate) + ' ago';
    }
  };
  console.log('STATUS', status);

  const canQueue = status === 'Succeeded';
  const canExecute = status === 'Queued';

  const handleAction = async () => {
    try {
      if (!account?.address) throw new Error('No connected wallet');

      const signer = await ethers5Adapter.signer.toEthers({
        client,
        chain: baseSepolia,
        account,
      });

      const governor = new ethers.Contract(
        import.meta.env.VITE_GOVERNOR_ADDRESS!,
        govAbi,
        signer
      );

      const parsedValues = values.map((v, i) => {
        try {
          return ethers.BigNumber.from(v);
        } catch (err) {
          console.error(`❌ Valor inválido en values[${i}]:`, v);
          throw new Error(`Invalid value at index ${i}`);
        }
      });

      const descriptionHash = ethers.utils.id(rawDescription);

      let tx;
      if (canQueue) {
        tx = await governor.queue(
          targets,
          parsedValues,
          calldatas,
          descriptionHash
        );
        console.log('📥 Proposal queued:', tx.hash);
        await tx.wait();
      } else if (canExecute) {
        console.log({
          targets,
          parsedValues,
          calldatas,
          descriptionHash,
        });

        tx = await governor.execute(
          targets,
          parsedValues,
          calldatas,
          descriptionHash,
          {
            gasLimit: 800_000,
          }
        );
        console.log('✅ Proposal executed:', tx.hash);
        await tx.wait();
      } else {
        throw new Error(
          `Cannot queue or execute proposal in current state: ${status}`
        );
      }
    } catch (err: any) {
      console.error('❌ Error al procesar propuesta:', err);
      const revertData =
        err?.error?.data?.data ?? err?.data?.data ?? err?.data ?? null;

      if (typeof revertData === 'string') {
        const decoded = decodeRevertReason(revertData);
        if (decoded) console.error('💥 Revert reason:', decoded);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Link
        to="/governance"
        icon={HiChevronLeft}
        variant="outline"
        label="All proposals"
        className="text-lg"
      />
      <div className="space-y-6">
        <HeaderCard
          loading={false}
          title={title}
          aside={
            <div className="flex flex-row-reverse items-center justify-between gap-y-4 sm:flex-col sm:items-end">
              <ProposalStatusBadge size="md" status={status} />
              <div className="flex flex-row items-center gap-x-2 text-highlight-foreground/60">
                <HiOutlineClock className="h-5 w-5 shrink-0" />
                {statusText()}
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-y-3">
            <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
              {summary}
            </p>
            <div className="flex items-center gap-x-1 text-sm">
              <span className="text-highlight-foreground/60">Published by</span>
              <Address
                address={creatorAddress}
                maxLength={AddressLength.Medium}
                hasLink
                showCopy={false}
              />
            </div>
          </div>
        </HeaderCard>

        <div className="grid grid-cols-7 gap-6">
          <div className="col-span-full flex flex-col gap-y-6 lg:col-span-4">
            <ProposalVotes
              loading={false}
              proposal={{ ...proposal, result, totalVotingWeight }}
              refetch={() => {}}
            />
            <ProposalActions loading={false} actions={proposal.actions}>
              {(canQueue || canExecute) && (
                <div className="flex flex-row items-center gap-x-4">
                  <Button
                    disabled={!userAddress}
                    type="button"
                    label={canQueue ? 'Queue Proposal' : 'Execute Proposal'}
                    onClick={handleAction}
                  />
                  {!userAddress && (
                    <ConnectWalletWarning
                      action={canQueue ? 'to queue' : 'to execute'}
                    />
                  )}
                </div>
              )}
            </ProposalActions>
          </div>

          <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
            <ProposalHistory proposal={proposal} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;
