import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  HiCalendar,
  HiChartBar,
  HiLink,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/AlertDialog';
import Header from '@/src/components/ui/Header';

const StampCard = ({
  displayName,
  url,
  verified = false,
  expired = false,
}: {
  displayName: string;
  url: string;
  verified?: boolean;
  expired?: boolean;
}) => {
  const status = verified
    ? { text: 'Verified', variant: 'success', icon: HiOutlineClock }
    : expired
    ? { text: 'Expired', variant: 'destructive', icon: HiOutlineClock }
    : {
        text: 'Unverified',
        variant: 'secondary',
        icon: HiOutlineExclamationCircle,
      };

  return (
    <Card variant="light" className="flex flex-col gap-y-2">
      <StatusBadge {...status} />
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          <HiLink className="h-5 w-5 shrink-0" />
          <Header level={2}>{displayName}</Header>
        </div>
        <StatusBadge {...status} />
      </div>
      <div className="flex flex-col gap-y-1 text-base">
        <div className="flex items-center gap-x-2 text-popover-foreground">
          <HiLink className="h-5 w-5 shrink-0" />
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            {url}
          </a>
        </div>

        <div className="flex items-center gap-x-2 text-popover-foreground">
          <HiCalendar className="h-5 w-5 shrink-0" />
          <p className="font-normal">Last verified: --/--/--</p>
        </div>

        <div className="flex items-center gap-x-2 text-popover-foreground">
          <HiChartBar className="h-5 w-5 shrink-0" />
          <p className="font-normal">Verified 0 times</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-x-4">
        <Button>Verify</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="subtle">Remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove your stamp.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default StampCard;
