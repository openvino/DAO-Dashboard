import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useSearchParams } from 'react-router-dom';
import {
  HiArrowSmallRight,
  HiCheckBadge,
  HiOutlineClock,
  HiUserCircle,
} from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa';

import { HeaderCard } from '@/src/components/ui/HeaderCard';
import StampCard from '@/src/components/verification/StampCard';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { Button } from '@/src/components/ui/Button';
import RecentVerificationCard from '@/src/components/verification/RecentVerificationCard';
import History from '@/src/components/icons/History';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PendingVerificationCard from '../components/verification/PendingVerificationCard';

export type Stamp = [id: string, _hash: string, verifiedAt: BigNumber[]];
export type StampInfo = {
  id: string;
  displayName: string;
  url: string;
  icon: JSX.Element;
};

export type VerificationHistory = {
  id: string;
  timestamp: number;
  isExpired: boolean;
  stamp: Stamp;
};

export type VerificationThreshold = [
  timestamp: BigNumber,
  threshold: BigNumber
];

export type PendingVerification = {
  addressToVerify: string;
  hash: string;
  timestamp: string;
  providerId: string;
  sig: string;
};

export const availableStamps: StampInfo[] = [
  {
    id: 'proofofhumanity',
    displayName: 'Proof of Humanity',
    url: 'https://www.proofofhumanity.id/',
    icon: <HiUserCircle className="h-7 w-7 shrink-0" />,
  },
  {
    id: 'github',
    displayName: 'GitHub',
    url: 'https://github.com/',
    icon: <FaGithub className="h-6 w-6 shrink-0" />,
  },
];

const Verification = () => {
  const address = '0x1234567890abcdef1234567890abcdef12345678'; // ✅ mock address
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingVerifications, setPendingVerifications] = useLocalStorage<
    PendingVerification[]
  >('pendingVerifications', []);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationHistory[]
  >([]);
  const [thresholdHistory, setThresholdHistory] = useState<
    VerificationThreshold[]
  >([]);
  const [historyLimit, setHistoryLimit] = useState(5);
  const [reverifyThreshold] = useState<number>(30);

  const amountOfVerifiedStamps = stamps.length;

  // ✅ Simula data dummy para frontend
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const mockStamp: Stamp = [
      'github',
      'hashmock',
      [BigNumber.from(now - 3600)],
    ];

    setStamps([mockStamp]);
    setThresholdHistory([[BigNumber.from(now - 7200), BigNumber.from(2)]]);
    setVerificationHistory([
      {
        id: 'github',
        timestamp: now - 3600,
        isExpired: false,
        stamp: mockStamp,
      },
    ]);
  }, []);

  useEffect(() => {
    const searchParamSize = [...new Set(searchParams.keys())].length;
    if (searchParamSize === 0) return;

    const paramsObj: PendingVerification = {
      addressToVerify: searchParams.get('address') ?? '',
      hash: searchParams.get('hash') ?? '',
      timestamp: searchParams.get('timestamp') ?? '',
      providerId: searchParams.get('providerId') ?? '',
      sig: searchParams.get('sig') ?? '',
    };

    setSearchParams();

    const alreadyExists = pendingVerifications.some(
      (v) => JSON.stringify(v) === JSON.stringify(paramsObj)
    );
    if (!alreadyExists) {
      setPendingVerifications([...pendingVerifications, paramsObj]);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Verification" />
      <div className="grid grid-cols-7 gap-6">
        <MainCard
          className="col-span-full lg:col-span-4"
          icon={HiCheckBadge}
          loading={false}
          header={
            <DefaultMainCardHeader
              value={amountOfVerifiedStamps}
              label="verified accounts"
            />
          }
          aside={<ExplanationButton />}
        >
          <div className="flex flex-wrap gap-6">
            {availableStamps.map((stampInfo) => (
              <StampCard
                key={stampInfo.id}
                stampInfo={stampInfo}
                stamp={stamps.find(([id]) => id === stampInfo.id) || null}
                thresholdHistory={thresholdHistory}
                verify={() => alert('Mock verify')}
                refetch={() => {}}
                isError={false}
              />
            ))}
          </div>
        </MainCard>

        <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
          <MainCard
            icon={HiOutlineClock}
            loading={false}
            header={
              <DefaultMainCardHeader
                value={pendingVerifications.length}
                label="pending verifications"
                truncateMobile
              />
            }
          >
            {pendingVerifications.length > 0 ? (
              pendingVerifications.map((v, i) => (
                <PendingVerificationCard
                  key={i}
                  verification={v}
                  refetch={() => {}}
                  pendingVerifications={pendingVerifications}
                  setPendingVerifications={setPendingVerifications}
                />
              ))
            ) : (
              <p className="italic text-highlight-foreground/80">
                No pending verifications
              </p>
            )}
          </MainCard>

          <MainCard
            loading={false}
            icon={History}
            header={
              <DefaultMainCardHeader
                value={verificationHistory.length}
                label="completed verifications"
                truncateMobile
              />
            }
          >
            {verificationHistory.length > 0 ? (
              <>
                {verificationHistory.slice(0, historyLimit).map((h, i) => (
                  <RecentVerificationCard key={i} history={h} />
                ))}
                {historyLimit < verificationHistory.length && (
                  <Button
                    variant="outline"
                    label="Show more"
                    icon={HiArrowSmallRight}
                    onClick={() =>
                      setHistoryLimit(historyLimit + Math.min(historyLimit, 25))
                    }
                  />
                )}
              </>
            ) : (
              <p className="italic text-highlight-foreground/80">
                No completed verifications
              </p>
            )}
          </MainCard>
        </div>
      </div>
    </div>
  );
};

const ExplanationButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="subtle" label="How does it work?" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>How does verification work?</DialogTitle>
        <DialogDescription asChild>
          <div className="space-y-2">
            <p>
              You can verify your identity on different platforms. Click
              “Verify” on a card to begin.
            </p>
            <ol className="list-decimal pl-5">
              <li>Sign a message with your wallet.</li>
              <li>Redirect to login page.</li>
              <li>Finish verification by signing a transaction.</li>
              <li>You're done!</li>
            </ol>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogClose asChild>
        <div className="flex justify-end">
          <Button variant="subtle" label="Close" />
        </div>
      </DialogClose>
    </DialogContent>
  </Dialog>
);

export default Verification;
