import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { HiOutlineClock, HiQuestionMarkCircle } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';
import { truncateMiddle } from '@/src/lib/utils';

type PendingVerification = {
  addressToVerify: string;
  hash: string;
  timestamp: string;
  providerId: string;
  sig: string;
};

type StampInfo = {
  id: string;
  displayName: string;
  url: string;
  icon: React.ReactNode;
};

type PendingVerificationCardProps = {
  verification: PendingVerification;
  refetch?: any;
  pendingVerifications?: PendingVerification[];
  setPendingVerifications?: (
    value:
      | PendingVerification[]
      | ((val: PendingVerification[]) => PendingVerification[])
  ) => void;
};

const availableStamps: StampInfo[] = [];

const PendingVerificationCard: React.FC<PendingVerificationCardProps> = ({
  verification,
  refetch,
  pendingVerifications,
  setPendingVerifications,
}) => {
  const fallBackStampInfo: StampInfo = {
    id: 'unknown',
    displayName: 'Unknown',
    url: 'https://www.google.com',
    icon: <HiQuestionMarkCircle />,
  };

  const stampId = verification.providerId;
  const stampInfo =
    availableStamps.find((stamp) => stamp.id === stampId) ?? fallBackStampInfo;

  const timeLeft = Math.max(
    0,
    parseInt(verification.timestamp ?? '') +
      3600 -
      Math.floor(Date.now() / 1000)
  );

  function getCategories(verification: PendingVerification): Category[] {
    return [
      {
        title: 'Details',
        items: [
          {
            label: 'Address',
            value: truncateMiddle(verification.addressToVerify, 16),
          },
          { label: 'Hash', value: truncateMiddle(verification.hash, 16) },
          { label: 'Timestamp', value: verification.timestamp },
          { label: 'Signature', value: truncateMiddle(verification.sig, 16) },
          {
            label: 'Provider',
            value: (
              <span className="capitalize">{verification.providerId}</span>
            ),
          },
        ],
      },
    ];
  }

  return (
    <Card variant="light" className="flex flex-col gap-y-2 font-normal">
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <Header level={3}>{stampInfo.displayName}</Header>
      </div>
      <div className="flex items-center gap-x-2 text-popover-foreground/80">
        <HiOutlineClock className="h-5 w-5 shrink-0" />
        <p className="font-normal">
          {timeLeft > 0
            ? `Expires in ${Math.floor(timeLeft / 60)} minutes`
            : 'Expired'}
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button label="Finish (disabled)" disabled />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" label="View details" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification details</DialogTitle>
              <DialogDescription asChild>
                <CategoryList categories={getCategories(verification)} />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <div className="flex items-end justify-end">
                <Button variant="subtle" label="Close" className="self-end" />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default PendingVerificationCard;
