import { useEffect, useState } from 'react';

export type DaoTransfer = {
  transactionId: string;
  from: string;
  to: string;
  amount: bigint;
  tokenAddress: string | null;
  tokenSymbol: string;
  decimals: number;
  creationDate: Date;
  type: 'deposit' | 'withdraw';
};

export type UseDaoTransfersData = {
  daoTransfers: DaoTransfer[] | null;
  loading: boolean;
  error: string | null;
};

// Cargar desde .env
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS?.toLowerCase() ?? '';
const OVI_ADDRESS = import.meta.env.VITE_OVI_ADDRESS?.toLowerCase() ?? '';

const HARDCODED_TRANSFERS: DaoTransfer[] = [
  {
    transactionId:
      '0x8852bf0f0939471d2ec91607151810bd4dd0b0d0f1f6e082e9e3cf517b4c6caa',
    from: '0x87495d92Ad7655BF8bcC6447ea715498238517aF',
    to: '0x728D7B72A3bBCd8AF1A01f0484c0FEab6Db4a208',
    amount: 1_000_000_000_000_000n,
    tokenAddress: null,
    tokenSymbol: 'ETH',
    decimals: 18,
    creationDate: new Date('2025-05-15T01:28:08Z'),
    type: 'deposit',
  },
  {
    transactionId:
      '0x5904147f11a3f59e05cd1bc913d814f1341f5d0a3919ead19dca9cccfaaace18',
    from: '0x87495d92Ad7655BF8bcC6447ea715498238517aF',
    to: '0x85e2168e7d650599f583397415a6c612729718a',
    amount: 0n,
    tokenAddress: null,
    tokenSymbol: 'ETH',
    decimals: 18,
    creationDate: new Date('2025-05-15T01:44:54Z'),
    type: 'withdraw',
  },
  {
    transactionId:
      '0x00e722f6599c9c0281ecb21ca009a85217fd6a586858c7f4bb6197b4f9c2c749',
    from: '0x87495d92Ad7655BF8bcC6447ea715498238517aF',
    to: '0x228746DcDf0633299a630484BfE4ccB08711e0De',
    amount: 52_000_000_000_000_000_000n,
    tokenAddress: OVI_ADDRESS,
    tokenSymbol: 'OVI',
    decimals: 18,
    creationDate: new Date('2025-05-15T01:04:32Z'),
    type: 'withdraw',
  },
  {
    transactionId:
      '0xaa3d9502b535b5d3d0f20ae427be7619545c83eb88fdeecb78062f1c86826c03',
    from: '0x87495d92Ad7655BF8bcC6447ea715498238517aF',
    to: '0x4E0BddA7F18F6958f3147E2Bb428757E678fD45B',
    amount: 10_000_000_000_000_000_000_000n,
    tokenAddress: OVI_ADDRESS,
    tokenSymbol: 'OVI',
    decimals: 18,
    creationDate: new Date('2025-05-14T05:23:34Z'),
    type: 'deposit',
  },
];

export function useDaoTransfers(): UseDaoTransfersData {
  const [daoTransfers, setDaoTransfers] = useState<DaoTransfer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula fetch desde base de datos
    setDaoTransfers(HARDCODED_TRANSFERS);
    setLoading(false);
  }, []);

  return {
    daoTransfers,
    loading,
    error,
  };
}
