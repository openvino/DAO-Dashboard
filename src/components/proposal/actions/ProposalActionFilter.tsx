/**
 * @file ProposalActionFilter.tsx - Filter for displaying proposal action, based on the action's method call
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import DefaultAction from '@/src/components/proposal/actions/DefaultAction';
import MergeAction, {
  ProposalMergeAction,
} from '@/src/components/proposal/actions/MergeAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import WithdrawAction, {
  ProposalWithdrawAction,
} from '@/src/components/proposal/actions/WithdrawAction';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import {
  ChangeParameterAction,
  ProposalChangeParameterAction,
} from './ChangeParameterAction';

interface ProposalActionProps extends AccordionItemProps {
  action: IProposalAction;
}

/**
 * Display an action in an accordion
 * @param props.action Action to display
 * @returns An AccordionItem with information about the action
 */
const ProposalActionFilter = ({ action, ...props }: ProposalActionProps) => {
  switch (action.method) {
    case 'withdraw':
      return (
        <WithdrawAction action={action as ProposalWithdrawAction} {...props} />
      );
    case 'mint':
      return <MintAction action={action as ProposalMintAction} {...props} />;
    case 'merge':
      return <MergeAction action={action as ProposalMergeAction} {...props} />;
    case 'change':
      return (
        <ChangeParameterAction
          action={action as ProposalChangeParameterAction}
          {...props}
        />
      );
    default:
      return <DefaultAction action={action} {...props} />;
  }
};

export default ProposalActionFilter;
