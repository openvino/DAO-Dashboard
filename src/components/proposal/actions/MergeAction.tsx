import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { FaGithub } from 'react-icons/fa';
import { Card } from '@/src/components/ui/Card';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';

export type ProposalMergeAction = IProposalAction & {
  params: {
    url: string;
  };
};

interface MergeActionProps extends AccordionItemProps {
  action: ProposalMergeAction;
}

const MergeAction = ({ action, ...props }: MergeActionProps) => {
  const getParsedUrl = () => {
    try {
      const url = new URL(action.params.url);
      const [, owner, repo, , pullNumber] = url.pathname.split('/');
      return {
        owner: owner || 'Unknown',
        repo: repo || 'Unknown',
        pullNumber: pullNumber || 'Unknown',
      };
    } catch (err) {
      console.warn('Invalid PR URL:', action.params.url);
      return {
        owner: 'Invalid',
        repo: '-',
        pullNumber: '-',
      };
    }
  };

  const { owner, repo, pullNumber } = getParsedUrl();

  return (
    <ActionWrapper
      icon={FaGithub}
      title="Merge Pull Request"
      description="Merge the specified pull request into the corresponding branch"
      {...props}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Owner</p>
            <p className="font-medium">{owner}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Repository</p>
            <p className="font-medium">{repo}</p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">
            Pull request #{pullNumber}
          </p>
          <a
            className="flex flex-row items-center gap-x-2 text-primary-highlight transition-colors duration-200 hover:text-primary-highlight/80"
            href={action.params.url}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
            <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
          </a>
        </Card>
      </div>
    </ActionWrapper>
  );
};

export default MergeAction;
