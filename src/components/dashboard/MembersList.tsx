import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { Member } from '@/src/hooks/useMembers';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';

const MemberCard = ({ member }: { member: Member }) => {
  return (
    <Card
      size="sm"
      className="flex flex-row items-center justify-between bg-popover"
    >
      <Address
        address={member.address}
        hasLink={true}
        maxLength={AddressLength.Medium}
        showCopy={false}
        jazziconSize="md"
      />
      {member.bal !== null && (
        <p className="whitespace-nowrap">
          {member.bal} {CHAIN_METADATA.rep.nativeCurrency.symbol}
        </p>
      )}
    </Card>
  );
};

const MembersList = ({
  members,
  loading,
  error,
}: {
  members: Member[];
  loading: boolean;
  error: string | null;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      {members.map((member) => (
        <MemberCard key={member.address} member={member} />
      ))}
    </div>
  );
};

export default MembersList;
