import { ERC20Abi } from '../abis/ERC20';
import { OviTokenAbi } from '../abis/ovi';

const OVI_ADDRESS = import.meta.env.VITE_OVI_ADDRESS?.toLowerCase() ?? '';
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS?.toLowerCase() ?? '';

export const knownContracts: Record<string, { name: string; abi: any[] }> = {
  ...(OVI_ADDRESS && {
    [OVI_ADDRESS]: {
      name: 'OVI',
      abi: OviTokenAbi,
    },
  }),
  ...(USDC_ADDRESS && {
    [USDC_ADDRESS]: {
      name: 'USDC',
      abi: ERC20Abi,
    },
  }),
  '0x0000000000000000000000000000000000000000': {
    name: 'ETH',
    abi: [],
  },
};
