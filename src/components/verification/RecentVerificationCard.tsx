import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import {
  StampInfo,
  VerificationHistory,
  availableStamps,
} from '@/src/pages/Verification';
import { HiCalendar, HiQuestionMarkCircle } from 'react-icons/hi2';

const RecentVerificationCard = ({
  history,
}: {
  history: VerificationHistory;
}) => {
  const fallBackStampInfo = {
    id: 'unknown',
    displayName: 'Unknown',
    url: 'https://www.google.com',
    icon: <HiQuestionMarkCircle />,
  } as StampInfo;

  const stamp = history.stamp;
  const stampInfo: StampInfo = stamp
    ? availableStamps.find((stampInfo) => stampInfo.id === stamp[0]) ??
      fallBackStampInfo
    : fallBackStampInfo;

  return (
    <Card variant="light" className="flex flex-col gap-y-1 font-normal">
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <Header level={3}>{stampInfo.displayName}</Header>
      </div>
      <div className="flex items-center gap-x-2 text-popover-foreground/80">
        <HiCalendar className="h-5 w-5 shrink-0" />
        <p className="font-normal">
          {new Date(history.timestamp * 1000).toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default RecentVerificationCard;
