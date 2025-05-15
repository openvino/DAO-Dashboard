import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { HiQuestionMarkCircle } from 'react-icons/hi2';

interface DefaultActionProps {
  action: IProposalAction;
}

/**
 * Default action component, for when it has not yet been supported specifically
 * @returns Simple wrapper showing an unknown action message
 */
const DefaultAction = ({ action }: DefaultActionProps) => {
  return (
    <ActionWrapper
      icon={HiQuestionMarkCircle}
      title="Unknown action"
      description="This action is not supported in the web-app yet"
    />
  );
};

export default DefaultAction;
