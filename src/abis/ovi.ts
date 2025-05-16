import { ERC20Abi } from './ERC20';

export const OviTokenAbi = [
  ...ERC20Abi,
  {
    inputs: [],
    name: 'canSplitView',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pair',
    outputs: [
      { internalType: 'contract IUniswapV2Pair', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resetRiseTimestamps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateState',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'split',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  {
    type: 'error',
    name: 'Error',
    inputs: [{ name: 'message', type: 'string' }],
  },
];
