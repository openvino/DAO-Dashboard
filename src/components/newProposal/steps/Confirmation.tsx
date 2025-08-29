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
      const values: ethers.BigNumber[] = [];
      const calldatas: string[] = [];

      // Interfaces
      const oviIface = new ethers.utils.Interface(
        OviTokenAbi.filter((item) => item.type !== 'error')
      );
      const payoutIface = new ethers.utils.Interface([
        'function pay(address to)',
      ]);

      // Opcional: contrato Payout para ETH nativo (owner = Timelock)
      const PAYOUT_ADDRESS = import.meta.env.VITE_PAYOUT_ADDRESS as
        | string
        | undefined;

      for (const action of actions) {
        if (action.name === 'withdraw_assets') {
          const isEth = (action as any).assetType === 'eth';

          if (isEth) {
            if (!PAYOUT_ADDRESS) {
              throw new Error(
                'Missing VITE_PAYOUT_ADDRESS. Deploy Payout and set it in your env.'
              );
            }
            // ETH: target = Payout (contrato), value = amount (wei), data = pay(recipient)
            const ethValue = ethers.utils.parseEther(action.amount);
            const calldata = payoutIface.encodeFunctionData('pay', [
              action.recipient,
            ]);

            targets.push(PAYOUT_ADDRESS);
            values.push(ethValue);
            calldatas.push(calldata);
          } else {
            // ERC-20: target = token, value = 0, data = transfer(recipient, amount)
            const calldata = oviIface.encodeFunctionData('transfer', [
              action.recipient,
              // ⚠️ si tenés los decimales reales del token, reemplazá 18 por esos decimales
              ethers.utils.parseUnits(action.amount, 18),
            ]);
            targets.push(action.tokenAddress);
            values.push(ethers.constants.Zero);
            calldatas.push(calldata);
          }
        }

        if (action.name === 'split') {
          const calldata = oviIface.encodeFunctionData('split', []);
          targets.push(action.tokenAddress);
          values.push(ethers.constants.Zero);
          calldatas.push(calldata);
        }
      }

      const description =
        (dataStep1?.title ?? 'Untitled') +
        '\n\n' +
        (dataStep1?.summary ?? '') +
        '\n\n' +
        (dataStep1?.description ?? '').replace(/<\/?[^>]+(>|$)/g, '');

      const tx = await governor.propose(
        targets,
        values,
        calldatas,
        description
      );
      const receipt = await tx.wait();

      const event = receipt.events?.find((e) => e.event === 'ProposalCreated');
      if (!event) throw new Error('ProposalCreated event not found');

      const proposalId = event.args?.proposalId?.toString();
      const blockNumber = receipt.blockNumber;

      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/routes/daoRoute`.replace(/([^:]\/)\/+/g, '$1');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': import.meta.env.VITE_API_SECRET!,
        },
        body: JSON.stringify({ id: proposalId, block: blockNumber }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Failed to save proposal to backend:\n${body}`);
      }

      toast({
        title: 'Proposal submitted',
        description: 'Successfully created proposal on-chain and stored in DB',
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
        case 'withdraw_assets': {
          const isEth = (action as any).assetType === 'eth';
          return {
            method: 'transfer',
            interface: isEth ? 'INative' : 'IERC20',
            params: isEth
              ? {
                  to: action.recipient,
                  amount: action.amount,
                }
              : {
                  to: action.recipient,
                  amount: action.amount,
                  tokenAddress: action.tokenAddress,
                },
          };
        }
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

// 'use client';

// import { useToast } from '@/src/hooks/useToast';
// import {
//   StepNavigator,
//   useNewProposalFormContext,
// } from '@/src/pages/NewProposal';
// import { HeaderCard } from '@/src/components/ui/HeaderCard';
// import { MainCard } from '@/src/components/ui/MainCard';
// import { useForm } from 'react-hook-form';
// import DOMPurify from 'dompurify';
// import { HiChatBubbleLeftRight } from 'react-icons/hi2';
// import { ErrorWrapper } from '../../ui/ErrorWrapper';
// import ProposalActions, {
//   IProposalAction,
// } from '@/src/components/proposal/ProposalActions';
// import { ProposalResources } from '@/src/components/proposal/ProposalResources';
// import { ProposalFormAction } from '@/src/components/newProposal/steps/Actions';
// import { ethers } from 'ethers';
// import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
// import { client } from '@/src/config/thirdwebClient';
// import { baseSepolia } from 'thirdweb/chains';
// import { useActiveAccount } from 'thirdweb/react';
// import { govAbi } from '@/src/abis/governor';
// import { OviTokenAbi } from '@/src/abis/ovi';

// export const Confirmation = () => {
//   const { dataStep1, dataStep3 } = useNewProposalFormContext();
//   const { toast } = useToast();
//   const account = useActiveAccount();

//   const {
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async () => {
//     try {
//       if (!account?.address) throw new Error('You need to connect your wallet');

//       const signer = await ethers5Adapter.signer.toEthers({
//         client,
//         chain: baseSepolia,
//         account,
//       });

//       const governor = new ethers.Contract(
//         import.meta.env.VITE_GOVERNOR_ADDRESS!,
//         govAbi,
//         signer
//       );

//       const actions = dataStep3?.actions || [];
//       const targets: string[] = [];
//       const values: ethers.BigNumber[] = [];
//       const calldatas: string[] = [];

//       const iface = new ethers.utils.Interface(
//         OviTokenAbi.filter((item) => item.type !== 'error')
//       );

//       for (const action of actions) {
//         console.log(action.name);

//         if (action.name === 'withdraw_assets') {
//           if (action.tokenAddress === 'native') {
//             // ETH transfer
//             targets.push(action.recipient);
//             values.push(ethers.utils.parseEther(action.amount));
//             calldatas.push('0x');
//           } else {
//             // ERC20 transfer
//             const calldata = iface.encodeFunctionData('transfer', [
//               action.recipient,
//               ethers.utils.parseUnits(action.amount, 18),
//             ]);
//             targets.push(action.tokenAddress);
//             values.push(ethers.constants.Zero);
//             calldatas.push(calldata);
//           }
//         }

//         if (action.name === 'split') {
//           const calldata = iface.encodeFunctionData('split', []);
//           targets.push(action.tokenAddress);
//           values.push(ethers.constants.Zero);
//           calldatas.push(calldata);
//         }
//       }

//       const description =
//         (dataStep1?.title ?? 'Untitled') +
//         '\n\n' +
//         (dataStep1?.summary ?? '') +
//         '\n\n' +
//         (dataStep1?.description ?? '').replace(/<\/?[^>]+(>|$)/g, '');
//       console.log({
//         targets,
//         values,
//         calldatas,
//         description,
//       });
//       const tx = await governor.propose(
//         targets,
//         values,
//         calldatas,
//         description
//       );
//       const receipt = await tx.wait();

//       const event = receipt.events?.find((e) => e.event === 'ProposalCreated');
//       if (!event) throw new Error('ProposalCreated event not found');

//       const proposalId = event.args?.proposalId?.toString();
//       const blockNumber = receipt.blockNumber;

//       const apiUrl = `${
//         import.meta.env.VITE_API_URL
//       }/api/routes/daoRoute`.replace(/([^:]\/)\/+/g, '$1');
//       const res = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Secret': import.meta.env.VITE_API_SECRET!,
//         },
//         body: JSON.stringify({ id: proposalId, block: blockNumber }),
//       });

//       if (!res.ok) {
//         const body = await res.text().catch(() => '');
//         throw new Error(`Failed to save proposal to backend:\n${body}`);
//       }

//       toast({
//         title: 'Proposal submitted',
//         description: 'Successfully created proposal on-chain and stored in DB',
//         variant: 'success',
//       });
//     } catch (err: any) {
//       console.error(err);
//       toast({
//         title: 'Error',
//         description: err.message ?? 'Something went wrong',
//         variant: 'error',
//       });
//     }
//   };

//   const htmlClean = DOMPurify.sanitize(
//     dataStep1?.description ?? '<p>Proposal has no body</p>'
//   );

//   const actions: IProposalAction[] =
//     dataStep3?.actions.map((action: ProposalFormAction) => {
//       switch (action.name) {
//         case 'withdraw_assets':
//           return {
//             method: 'transfer',
//             interface: action.tokenAddress === 'native' ? 'INative' : 'IERC20',
//             params: {
//               to: action.recipient,
//               amount: action.amount,
//               tokenAddress: action.tokenAddress,
//             },
//           };
//         case 'split':
//           return {
//             method: 'split',
//             interface: 'IOvi',
//             params: {},
//           };
//         default:
//           return {
//             method: '',
//             interface: '',
//             params: {},
//           };
//       }
//     }) ?? [];

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <HeaderCard
//           variant="outline"
//           title={dataStep1?.title ?? 'No title'}
//           className="md:col-span-2"
//         >
//           <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
//             {dataStep1?.summary ?? 'No summary'}
//           </p>
//           {dataStep1?.description !== '<p></p>' && (
//             <div
//               className="styled-editor-content"
//               dangerouslySetInnerHTML={{ __html: htmlClean }}
//             />
//           )}
//         </HeaderCard>

//         <div className="flex flex-col gap-y-4">
//           <ProposalResources
//             variant="outline"
//             resources={dataStep1?.resources ?? []}
//           />
//           <ProposalActions variant="outline" actions={actions} />
//         </div>

//         <MainCard
//           icon={HiChatBubbleLeftRight}
//           variant="outline"
//           header="Voting settings"
//         >
//           <p className="italic text-highlight-foreground/80">
//             Default settings from contract will be applied.
//           </p>
//         </MainCard>
//       </div>

//       <ErrorWrapper name="submit" error={errors?.root?.step4error as any}>
//         <StepNavigator />
//       </ErrorWrapper>
//     </form>
//   );
// };
