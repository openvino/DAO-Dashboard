import { useToast } from '@/src/hooks/useToast';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { MainCard } from '@/src/components/ui/MainCard';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import ProposalActions, {
  IProposalAction,
} from '@/src/components/proposal/ProposalActions';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import { ProposalFormAction } from '@/src/components/newProposal/steps/Actions';
import { ethers } from 'ethers';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { client } from '@/src/config/thirdwebClient';
import { baseSepolia } from 'thirdweb/chains';

import { useActiveAccount } from 'thirdweb/react';
import { govAbi } from '@/src/abis/governor';
import { DescriptionWithResources } from '@/src/utils/descriptionBuilder';

export const Confirmation = () => {
  const { dataStep1, dataStep3 } = useNewProposalFormContext();
  const { toast } = useToast();
  const account = useActiveAccount();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    try {
      if (!account?.address) {
        throw new Error('You need to connect your wallet');
      }

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

      const targets: string[] = [];
      const values: bigint[] = [];
      const calldatas: string[] = [];

      const actions = dataStep3?.actions || [];
      for (const action of actions) {
        if (action.name === 'withdraw_assets') {
          const iface = new ethers.utils.Interface([
            'function withdraw(address to, uint256 amount, address tokenAddress)',
          ]);
          const calldata = iface.encodeFunctionData('withdraw', [
            action.recipient,
            action.amount,
            action.tokenAddress,
          ]);
          targets.push(import.meta.env.VITE_TIMELOCK_ADDRESS!);
          values.push(0n);
          calldatas.push(calldata);
        }
        if (action.name === 'mint_tokens') {
          const iface = new ethers.utils.Interface([
            'function mint((address to, uint256 amount, uint256 tokenId)[])',
          ]);
          const calldata = iface.encodeFunctionData('mint', [action.wallets]);
          targets.push(import.meta.env.VITE_TIMELOCK_ADDRESS!);
          values.push(0n);
          calldatas.push(calldata);
        }
      }

      const rawDescription = DescriptionWithResources(dataStep1!);
      const tx = await governor.propose(
        targets,
        values,
        calldatas,
        rawDescription
      );
      await tx.wait();

      toast({
        title: 'Proposal submitted',
        description: 'Successfully created proposal on-chain',
        variant: 'success',
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message ?? 'Something went wrong',
        variant: 'error',
      });
    }
  };

  const htmlClean = DOMPurify.sanitize(
    dataStep1?.description ?? '<p>Proposal has no body</p>'
  );

  const actions: IProposalAction[] =
    dataStep3?.actions.map((action: ProposalFormAction) => {
      switch (action.name) {
        case 'withdraw_assets':
          return {
            method: 'withdraw',
            interface: 'IWithdraw',
            params: {
              to: action.recipient,
              amount: action.amount,
              tokenAddress: action.tokenAddress,
            },
          };
        case 'mint_tokens':
          return {
            method: 'mint',
            interface: 'IMint',
            params: {
              to: action.wallets.map((wallet) => ({
                to: wallet.address,
                amount: wallet.amount,
                tokenId: 0,
              })),
            },
          };
        default:
          return {
            method: '',
            interface: '',
            params: {},
          };
      }
    }) ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HeaderCard
          variant="outline"
          title={dataStep1?.title ?? 'No title'}
          className="md:col-span-2"
        >
          <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
            {dataStep1?.summary ?? 'No summary'}
          </p>
          {dataStep1?.description !== '<p></p>' && (
            <div
              className="styled-editor-content"
              dangerouslySetInnerHTML={{ __html: htmlClean }}
            />
          )}
        </HeaderCard>

        <div className="flex flex-col gap-y-4">
          <ProposalResources
            variant="outline"
            resources={dataStep1?.resources ?? []}
          />
          <ProposalActions variant="outline" actions={actions} />
        </div>

        <MainCard
          icon={HiChatBubbleLeftRight}
          variant="outline"
          header="Voting settings"
        >
          <p className="italic text-highlight-foreground/80">
            Default settings from contract will be applied.
          </p>
        </MainCard>
      </div>

      <ErrorWrapper name="submit" error={errors?.root?.step4error as any}>
        <StepNavigator />
      </ErrorWrapper>
    </form>
  );
};
