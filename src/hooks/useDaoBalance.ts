import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { baseSepolia } from 'thirdweb/chains';
import { client } from '@/src/config/thirdwebClient';

export type DaoBalance = {
  type: 'ERC20' | 'NATIVE';
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

const ERC20_ABI = ['function balanceOf(address) view returns (uint256)'];

const TOKENS = [
  {
    address: import.meta.env.VITE_USDC_ADDRESS,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: import.meta.env.VITE_OVI_ADDRESS,
    symbol: 'OVI',
    name: 'Openvino DAO Token',
    decimals: 18,
  },
];

export const useDaoBalance = ({
  useDummyData = false,
}: UseDaoBalanceProps): UseDaoBalanceData => {
  const [daoBalances, setDaoBalances] = useState<DaoBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const now = new Date();

        if (useDummyData) {
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
          setError(null);
          return;
        }

        const provider = ethers5Adapter.provider.toEthers({
          client,
          chain: baseSepolia,
        });
        const timelockAddress = import.meta.env.VITE_TIMELOCK_ADDRESS;

        // ✅ Balance NATIVE (ETH)
        const nativeBalanceRaw = await provider.getBalance(timelockAddress);
        const nativeBalance: DaoBalance = {
          type: 'NATIVE',
          balance: BigInt(nativeBalanceRaw.toString()),
          decimals: 18,
          address: timelockAddress,
          name: 'Ether',
          symbol: 'ETH',
          updateDate: now,
        };

        // ✅ ERC20 balances
        const tokenBalances: DaoBalance[] = await Promise.all(
          TOKENS.map(async (token) => {
            const contract = new ethers.Contract(
              token.address,
              ERC20_ABI,
              provider
            );
            const raw = await contract.balanceOf(timelockAddress);
            return {
              type: 'ERC20',
              balance: BigInt(raw.toString()),
              decimals: token.decimals,
              address: token.address,
              name: token.name,
              symbol: token.symbol,
              updateDate: now,
            };
          })
        );

        setDaoBalances([nativeBalance, ...tokenBalances]);
        setError(null);
      } catch (err: any) {
        setError(err.message ?? 'Unknown error');
        setDaoBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [useDummyData]);

  return {
    daoBalances,
    loading,
    error,
  };
};
