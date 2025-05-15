import { ethers } from 'ethers';

// Map de errores conocidos por selector
const knownErrorDecoders: Record<
  string,
  {
    name: string;
    inputs: string[];
  }
> = {
  '0x08c379a0': {
    name: 'Error',
    inputs: ['string'],
  },
  '0x6ad06075': {
    name: 'TimelockUnexpectedOperationState',
    inputs: ['bytes32', 'bytes32'],
  },
};

export function decodeRevertReason(revertData: string): string | null {
  if (!revertData || !revertData.startsWith('0x') || revertData.length < 10)
    return null;

  const selector = revertData.slice(0, 10);
  const decoder = knownErrorDecoders[selector];

  if (!decoder) return `Unknown error selector: ${selector}`;

  try {
    const data = '0x' + revertData.slice(10);
    const decoded = ethers.utils.defaultAbiCoder.decode(decoder.inputs, data);
    return `${decoder.name}(${decoded.map((d) => d.toString()).join(', ')})`;
  } catch (err) {
    return `⚠️ Failed to decode error ${decoder.name}: ${
      (err as Error).message
    }`;
  }
}
