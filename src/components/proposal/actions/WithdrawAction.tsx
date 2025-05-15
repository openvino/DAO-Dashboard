import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { HiArrowRight, HiBanknotes } from 'react-icons/hi2';

export type ProposalWithdrawAction = IProposalAction & {
  params: {
    amount: bigint;
    tokenAddress: string;
    to: string;
  };
};

interface WithdrawActionProps extends AccordionItemProps {
  action: ProposalWithdrawAction;
}

const WithdrawAction = ({ action, ...props }: WithdrawActionProps) => {
  return (
    <ActionWrapper
      icon={HiBanknotes}
      title="Withdraw assets"
      description="Withdraw assets from the DAO treasury"
      {...props}
    >
      <div className="space-y-2">
        <Card variant="outline" size="sm">
          <p className="text-base font-medium">Mock Token</p>
          <p className="text-sm text-popover-foreground/80">
            {Number(action.params.amount) / 1e18} MOCK
          </p>
        </Card>
        <div className="flex items-center gap-x-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">From</p>
            <p className="font-medium">DAO Treasury</p>
          </Card>
          <HiArrowRight className="h-4 w-4 shrink-0 text-popover-foreground/80" />
          <Card variant="outline" size="sm" className="font-medium">
            <p className="text-xs font-normal text-popover-foreground/80">To</p>
            <Address
              address={action.params.to}
              maxLength={AddressLength.Medium}
              hasLink={false}
              showCopy={false}
              replaceYou={false}
            />
          </Card>
        </div>
      </div>
    </ActionWrapper>
  );
};

export default WithdrawAction;
