import { HiCog } from 'react-icons/hi2';
import { Card } from '../../ui/Card';
import { IProposalAction } from '../ProposalActions';
import ActionWrapper from './ActionWrapper';

export type ProposalChangeParameterAction = IProposalAction & {
  params: {
    plugin: string;
    parameter: string;
    value: string;
  };
};

interface ChangeParameterActionProps {
  action: ProposalChangeParameterAction;
}

export const ChangeParameterAction = ({
  action,
}: ChangeParameterActionProps) => {
  return (
    <ActionWrapper
      icon={HiCog}
      title="Change plugin parameter"
      description="Change the value of a parameter of a plugin"
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Plugin</p>
            <p className="font-medium">{action.params.plugin}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Parameter</p>
            <p className="font-medium">{action.params.parameter}</p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">
            New parameter value
          </p>
          <p className="font-medium">{action.params.value}</p>
        </Card>
      </div>
    </ActionWrapper>
  );
};
