import {
  BaseError,
  decodeErrorResult,
  type Abi,
  type DecodeErrorResultReturnType,
} from 'viem';

// ABIs "universales" para errores estándar
const GENERIC_ERROR_ABI: Abi = [
  {
    type: 'error',
    name: 'Error',
    inputs: [{ name: 'message', type: 'string' }],
  },
] as const;

const PANIC_ERROR_ABI: Abi = [
  { type: 'error', name: 'Panic', inputs: [{ name: 'code', type: 'uint256' }] },
] as const;

// Une ABIs y elimina duplicados por (type,name) para evitar choques
export function mergeAbis(...abis: Abi[]): Abi {
  const key = (e: any) =>
    `${e.type}:${e.name || ''}:${JSON.stringify(e.inputs || [])}`;
  const map = new Map<string, any>();
  for (const abi of abis) {
    for (const item of abi as any[]) map.set(key(item), item);
  }
  return Array.from(map.values());
}

export function friendlyPanic(code: bigint) {
  // https://docs.soliditylang.org/en/latest/control-structures.html#panic-via-assert-and-error-via-require
  const known: Record<string, string> = {
    '0x01': 'Assertion violated.',
    '0x11': 'Arithmetic overflow/underflow.',
    '0x12': 'Division or modulo by zero.',
    '0x21': 'Invalid enum value.',
    '0x22': 'Access to incorrect storage byte array.',
    '0x31': 'Pop on empty array.',
    '0x32': 'Array out-of-bounds.',
    '0x41': 'Memory overflow.',
    '0x51': 'Uninitialized function (invalid internal function).',
  };
  const hex = '0x' + code.toString(16).padStart(2, '0');
  return known[hex] || `Panic(${code})`;
}

/**
 * Intenta decodificar un error de viem usando múltiples ABIs.
 * Si no puede, devuelve un mensaje legible con el selector crudo.
 */
export function decodeTxError(
  err: unknown,
  abis: Abi[] // p.ej. [GovernorAbi, TargetAbi1, TargetAbi2, ...]
): { title: string; details?: string } {
  // Viem envuelve en BaseError y deja el revert data en cause/data
  const base = err as BaseError;
  const data = (base as any)?.cause?.data ?? (base as any)?.data;

  if (!data || typeof data !== 'string') {
    return { title: base?.shortMessage || base?.message || 'Unknown error' };
  }

  const merged = mergeAbis(...abis, GENERIC_ERROR_ABI, PANIC_ERROR_ABI);

  // 1) Intento general con todos los ABIs
  try {
    const dec = decodeErrorResult({
      abi: merged,
      data,
    }) as DecodeErrorResultReturnType;
    if (dec?.errorName === 'Error' && dec?.args?.[0]) {
      return { title: String(dec.args[0]) };
    }
    if (dec?.errorName === 'Panic' && dec?.args?.[0] != null) {
      return { title: friendlyPanic(dec.args[0] as bigint) };
    }
    // Custom error conocido por alguno de los ABIs
    const prettyArgs = Array.isArray(dec.args)
      ? dec.args
          .map((a) => (typeof a === 'bigint' ? a.toString() : String(a)))
          .join(', ')
      : JSON.stringify(dec.args);
    return { title: dec.errorName || 'Reverted', details: prettyArgs };
  } catch {
    // 2) Si falla el decode, al menos informar selector + link
    const selector = (data as string).slice(0, 10); // 0x + 8 hex
    return {
      title: `Reverted with unknown error ${selector}`,
      details: `Buscá la firma: https://openchain.xyz/signatures?query=${selector}`,
    };
  }
}
