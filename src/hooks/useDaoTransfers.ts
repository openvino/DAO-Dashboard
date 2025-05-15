import { useEffect, useState } from 'react';

export type DaoTransfer = {
  transactionId: string;
  type: 'deposit' | 'withdraw';
  amount: bigint;
  decimals: number;
  tokenSymbol: string;
  from: string;
  to: string;
  creationDate: Date;
};

export type UseDaoTransfersData = {
  daoTransfers: DaoTransfer[] | null;
  loading: boolean;
  error: string | null;
};

export const useDaoTransfers = (): UseDaoTransfersData => {
  const [daoTransfers, setDaoTransfers] = useState<DaoTransfer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular una carga de datos mockeados
    const now = new Date();
    const dummyTransfers: DaoTransfer[] = [
      {
        transactionId: 'tx1',
        type: 'deposit',
        amount: 1000000000000000000n,
        decimals: 18,
        tokenSymbol: 'ETH',
        from: '0xabc0000000000000000000000000000000000000',
        to: '0xDAO000000000000000000000000000000000000',
        creationDate: now,
      },
      {
        transactionId: 'tx2',
        type: 'withdraw',
        amount: 250000000000000000n,
        decimals: 18,
        tokenSymbol: 'MOCK',
        from: '0xDAO000000000000000000000000000000000000',
        to: '0xdef0000000000000000000000000000000000000',
        creationDate: now,
      },
    ];

    setTimeout(() => {
      setDaoTransfers(dummyTransfers);
      setLoading(false);
    }, 300); // Simulamos retardo de red
  }, []);

  return { daoTransfers, loading, error };
};
