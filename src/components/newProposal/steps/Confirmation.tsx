'use client';

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
import { OviTokenAbi } from '@/src/abis/ovi';

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
      if (!account?.address) throw new Error('You need to connect your wallet');

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

      const actions = dataStep3?.actions || [];
      const targets: string[] = [];
      const values: number[] = [];
      const calldatas: string[] = [];

      const iface = new ethers.utils.Interface(
        OviTokenAbi.filter((item) => item.type !== 'error')
      );

      for (const action of actions) {
        if (action.name === 'withdraw_assets') {
          const calldata = iface.encodeFunctionData('transfer', [
            action.recipient,
            ethers.utils.parseUnits(action.amount, 18),
          ]);
          targets.push(action.tokenAddress);
          values.push(0);
          calldatas.push(calldata);
        }

        if (action.name === 'split') {
          const calldata = iface.encodeFunctionData('split', []);
          targets.push(action.tokenAddress);
          values.push(0);
          calldatas.push(calldata);
        }
      }

      // descripción sin HTML ni saltos de línea
      const description =
        (dataStep1?.title ?? 'Untitled') +
        '\n\n' +
        (dataStep1?.summary ?? '') +
        '\n\n' +
        (dataStep1?.description ?? '').replace(/<\/?[^>]+(>|$)/g, ''); // limpia HTML

      const tx = await governor.propose(
        targets,
        values,
        calldatas,
        description
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
            method: 'transfer',
            interface: 'IERC20',
            params: {
              to: action.recipient,
              amount: action.amount,
              tokenAddress: action.tokenAddress,
            },
          };
        case 'split':
          return {
            method: 'split',
            interface: 'IOvi',
            params: {},
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
