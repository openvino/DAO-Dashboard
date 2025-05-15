import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper, {
  ActionContentSeparator,
} from '@/src/components/proposal/actions/ActionWrapper';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { HiCircleStack } from 'react-icons/hi2';

export type ProposalMintAction = IProposalAction & {
  params: {
    to: {
      to: string;
      amount: bigint;
      tokenId: bigint;
    }[];
  };
};

interface MintActionProps extends AccordionItemProps {
  action: ProposalMintAction;
}

const MintAction = ({ action, ...props }: MintActionProps) => {
  return (
    <ActionWrapper
      icon={HiCircleStack}
      title="Mint tokens"
      description="Mint tokens to a selection of wallets"
      {...props}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {action.params.to.map((item, index) => (
          <Card
            key={index}
            variant="outline"
            size="sm"
            className="flex flex-row items-center justify-between text-right"
          >
            <Address
              address={item.to}
              maxLength={AddressLength.Small}
              hasLink
              showCopy={false}
              replaceYou={false}
              jazziconSize="md"
            />
            <p className="text-popover-foreground/80">
              + {Number(item.amount) / 1e18} MOCK
            </p>
          </Card>
        ))}
      </div>

      <ActionContentSeparator />

      <div className="text-sm text-popover-foreground/80">
        Summary not available in this version.
      </div>
    </ActionWrapper>
  );
};

export default MintAction;
