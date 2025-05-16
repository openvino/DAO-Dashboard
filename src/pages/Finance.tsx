import {
  HiArrowSmallRight,
  HiArrowsRightLeft,
  HiCircleStack,
  HiHome,
} from 'react-icons/hi2';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { DaoBalance, useDaoBalance } from '@/src/hooks/useDaoBalance';
import { format } from 'date-fns';
import { DaoTransfer, useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { useState } from 'react';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { Skeleton } from '@/src/components/ui/Skeleton';

type DaoTokenListProps = {
  loading: boolean;
  error: string | null;
  daoBalances: DaoBalance[];
  limit: number;
};

const DaoTokensList = ({
  loading,
  error,
  daoBalances,
  limit = daoBalances.length,
}: DaoTokenListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  if (error)
    return <p className="text-center font-normal">An error was encountered</p>;

  const balances = daoBalances
    .slice()
    .sort((a, b) => (a.updateDate < b.updateDate ? 1 : -1))
    .slice(0, limit);

  return (
    <div className="space-y-4">
      {balances.map((balance, i) => (
        <Card key={i} size="sm" variant="light">
          <p className="font-bold capitalize">
            {balance.name || 'Unknown Token'}
          </p>
          <div className="flex flex-row items-center">
            <TokenAmount
              amount={balance.balance}
              tokenDecimals={balance.decimals}
              symbol={balance.symbol}
            />
            <span className="px-2">•</span>
            <span className="text-popover-foreground/80">
              <Address
                address={balance.address ?? '-'}
                maxLength={AddressLength.Small}
                hasLink
                showCopy
                link={`https://sepolia.basescan.org/address/${balance.address}`}
              />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

type DaoTransfersListProps = {
  loading: boolean;
  error: string | null;
  daoTransfers: DaoTransfer[] | null;
  limit?: number;
};

const getSign = (type: string) => {
  return type.toLowerCase() === 'withdraw' ? '-' : '+';
};

const daoTransferAddress = (transfer: DaoTransfer): string => {
  if (!transfer) return '-';
  if (transfer.type.toLowerCase() === 'deposit') return transfer.from;
  if (transfer.type.toLowerCase() === 'withdraw') return transfer.to;
  return '-';
};

export const DaoTransfersList = ({
  loading,
  error,
  daoTransfers,
  limit = daoTransfers?.length ?? 3,
}: DaoTransfersListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  if (error)
    return <p className="text-center font-normal">An error was encountered</p>;

  if (!daoTransfers)
    return (
      <p className="text-center font-normal italic text-highlight-foreground/80">
        No transfers found
      </p>
    );

  const transfers = daoTransfers.slice(0, limit);

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => {
        const addr = daoTransferAddress(transfer);
        return (
          <Card key={transfer.transactionId} size="sm" variant="light">
            <div className="flex flex-row justify-between">
              <div className="text-left">
                <p className="font-bold capitalize">{transfer.type}</p>
                <p className="text-sm">{format(transfer.creationDate, 'Pp')}</p>
              </div>
              <div className="flex flex-col items-end text-right">
                <TokenAmount
                  className="font-bold"
                  amount={transfer.amount}
                  tokenDecimals={transfer.decimals}
                  symbol={transfer.tokenSymbol}
                  sign={getSign(transfer.type)}
                />
                <div className="text-popover-foreground/80">
                  <Address
                    address={addr}
                    maxLength={AddressLength.Small}
                    hasLink
                    showCopy
                    link={`https://sepolia.basescan.org/address/${addr}`}
                  />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const Finance = () => {
  const {
    daoBalances,
    loading: tokensLoading,
    error: tokensError,
  } = useDaoBalance({});
  const [tokenLimit, setTokenLimit] = useState(3);

  const {
    daoTransfers,
    loading: transfersLoading,
    error: transfersError,
  } = useDaoTransfers();
  const [transferLimit, setTransferLimit] = useState(3);

  const treasuryAddress = import.meta.env.VITE_TIMELOCK_ADDRESS;

  return (
    <div className="space-y-6">
      <HeaderCard
        title="Treasury"
        icon={HiHome}
        description="Treasury address (timelock contract)"
        aside={<Link to="/governance/new-proposal" label="New proposal" />}
      >
        <Address
          address={treasuryAddress}
          maxLength={AddressLength.Medium}
          hasLink
          showCopy
          link={`https://sepolia.basescan.org/address/${treasuryAddress}`}
        />
      </HeaderCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MainCard
          header={
            <DefaultMainCardHeader value={daoBalances.length} label="tokens" />
          }
          loading={false}
          icon={HiCircleStack}
        >
          <div className="space-y-4">
            <DaoTokensList
              daoBalances={daoBalances}
              limit={tokenLimit}
              loading={tokensLoading}
              error={tokensError}
            />
            {tokenLimit < daoBalances.length && (
              <Button
                variant="outline"
                label="Show more tokens"
                icon={HiArrowSmallRight}
                onClick={() =>
                  setTokenLimit(tokenLimit + Math.min(tokenLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
        <MainCard
          header={
            <DefaultMainCardHeader
              value={daoTransfers?.length ?? 0}
              label="transfers completed"
            />
          }
          loading={transfersLoading}
          icon={HiArrowsRightLeft}
        >
          <div className="space-y-4">
            <DaoTransfersList
              daoTransfers={daoTransfers}
              limit={transferLimit}
              loading={transfersLoading}
              error={transfersError}
            />
            {daoTransfers && transferLimit < daoTransfers.length && (
              <Button
                variant="outline"
                label="Show more tokens"
                icon={HiArrowSmallRight}
                onClick={() =>
                  setTransferLimit(transferLimit + Math.min(transferLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
      </div>
    </div>
  );
};

export default Finance;
