export const NumberPattern = /^\d+\.?\d*$/;

export const AddressPattern = /^0x[a-fA-F0-9]{20,60}$/;

export const UrlPattern = /^(https?:\/\/)?[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/;

export function patternToString(pattern: RegExp): string {
  return pattern.toString().slice(1, -1);
}
