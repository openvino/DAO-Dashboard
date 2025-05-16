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
import { VerificationThreshold, Stamp } from '@/src/pages/Verification';
import { useMemo } from 'react';

type StampCardProps = {
  displayName: string;
  url: string;
  icon: JSX.Element;
  stamp: Stamp | null;
  thresholdHistory: VerificationThreshold[];
  verify: () => void;
  refetch: () => void;
  isError: boolean;
};

const StampCard: React.FC<StampCardProps> = ({
  displayName,
  url,
  icon,
  stamp,
  thresholdHistory,
  verify,
  refetch,
  isError,
}) => {
  const verifiedAt = stamp?.[2]?.[0]?.toNumber() ?? null;
  const now = Math.floor(Date.now() / 1000);

  const isExpired = useMemo(() => {
    if (!verifiedAt) return false;
    const latestThreshold = thresholdHistory[thresholdHistory.length - 1];
    if (!latestThreshold) return false;

    const [thresholdTimestamp] = latestThreshold;
    return verifiedAt < thresholdTimestamp.toNumber();
  }, [verifiedAt, thresholdHistory]);

  const status = stamp
    ? isExpired
      ? { text: 'Expired', variant: 'destructive', icon: HiOutlineClock }
      : { text: 'Verified', variant: 'success', icon: HiOutlineClock }
    : {
        text: 'Unverified',
        variant: 'secondary',
        icon: HiOutlineExclamationCircle,
      };

  return (
    <Card variant="light" className="flex flex-col gap-y-2">
      {/* @ts-ignore */}
      <StatusBadge {...status} />
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          {icon}
          <Header level={2}>{displayName}</Header>
        </div>
        {/* @ts-ignore */}
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
          <p className="font-normal">
            Last verified:{' '}
            {verifiedAt
              ? new Date(verifiedAt * 1000).toLocaleDateString()
              : '--/--/--'}
          </p>
        </div>

        <div className="flex items-center gap-x-2 text-popover-foreground">
          <HiChartBar className="h-5 w-5 shrink-0" />
          <p className="font-normal">
            Verified {stamp ? stamp[2].length : 0} time
            {stamp && stamp[2].length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      {isError && (
        <p className="text-sm text-red-600">Error verifying this account.</p>
      )}
      <div className="flex flex-row items-center gap-x-4">
        {!stamp && <Button onClick={verify}>Verify</Button>}
        {stamp && (
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
                <AlertDialogAction onClick={refetch}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Card>
  );
};

export default StampCard;
