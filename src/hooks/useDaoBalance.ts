import { useEffect, useState } from 'react';

export const useDaoBalance = ({
  useDummyData = true,
}: UseDaoBalanceProps): UseDaoBalanceData => {
  const [daoBalances, setDaoBalances] = useState<DaoBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useDummyData) {
      setDummyData();
    } else {
      setLoading(false);
      setError('Live fetch disabled. Enable Aragon SDK client.');
    }
  }, []);

  const setDummyData = () => {
    const now = new Date();
    const dummy: DaoBalance[] = [
      {
        type: 'NATIVE',
        balance: 1234567890000000000n,
        decimals: 18,
        address: '0xDAO000000000000000000000000000000000000',
        name: 'Ether',
        symbol: 'ETH',
        updateDate: now,
      },
      {
        type: 'ERC20',
        balance: 500000000000000000n,
        decimals: 18,
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'MockToken',
        symbol: 'MOCK',
        updateDate: now,
      },
    ];
    setDaoBalances(dummy);
    setLoading(false);
    setError(null);
  };

  return {
    loading,
    error,
    daoBalances,
  };
};

export type DaoBalance = {
  type: string;
  updateDate: Date;
  balance: bigint | null;
  decimals: number | null;
  address: string | null;
  name: string | null;
  symbol: string | null;
};

export type UseDaoBalanceProps = {
  useDummyData?: boolean;
};

export type UseDaoBalanceData = {
  daoBalances: DaoBalance[];
  loading: boolean;
  error: string | null;
};
