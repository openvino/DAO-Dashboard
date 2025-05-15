import { anyNullOrUndefined } from '@/src/lib/utils';
import React from 'react';

interface TokenAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount?: bigint | null;
  tokenDecimals?: number | null;
  symbol?: string | null;
  sign?: string;
  displayDecimals?: number;
}

export const bigIntToFloat = (value: bigint, decimals: number): number =>
  parseFloat(`${value}E-${decimals}`);

// Formatea un número grande con sufijos (k, M, G, etc.)
export function abbreviateTokenAmount(amount: string): string {
  if (!amount) return 'N/A';

  const TOKEN_AMOUNT_REGEX =
    /(?<integers>[\d*]*)[.]*(?<decimals>[\d]*)\s*(?<symbol>[A-Za-z]*)/;
  const match = amount.match(TOKEN_AMOUNT_REGEX);

  if (!match || match.length !== 4 || match[0].length !== amount.length)
    return 'N/A';

  const integers = match[1];
  const decimals = match[2];
  const symbol = match[3];

  if (integers?.length > 4) {
    const integerNumber = Number.parseInt(integers);
    const magnitude = Math.floor((integers.length - 1) / 3);
    const lead = Math.floor(integerNumber / Math.pow(10, magnitude * 3));
    const magnitudeLetter = ['k', 'M', 'G'];

    return `${lead}${
      magnitude < 4
        ? magnitudeLetter[magnitude - 1]
        : '*10^' + Math.floor(magnitude) * 3
    }${symbol ? ' ' + symbol : ''}`;
  }

  if (decimals) {
    const totalNumber = Number.parseInt(integers) + parseFloat('0.' + decimals);

    if (totalNumber < 0.01) {
      return `< 0.01${symbol ? ' ' + symbol : ''}`;
    }

    return `${totalNumber.toFixed(2)}${symbol ? ' ' + symbol : ''}`;
  }

  return `${Number.parseInt(integers)}${symbol ? ' ' + symbol : ''}`;
}

export function toAbbreviatedTokenAmount(
  value: bigint | null | undefined,
  decimals: number | null | undefined,
  round = false
): string {
  if (anyNullOrUndefined(value, decimals)) return 'N/A';
  const asFloat = bigIntToFloat(value!, decimals!);
  if (isNaN(asFloat)) return 'N/A';
  return abbreviateTokenAmount(asFloat.toFixed(round ? 0 : 2));
}

const TokenAmount = ({
  className = '',
  amount,
  tokenDecimals,
  symbol,
  sign = '',
  ...props
}: TokenAmountProps) => {
  return (
    <span className={className} {...props}>
      {sign}
      {toAbbreviatedTokenAmount(amount, tokenDecimals)}
      &nbsp;
      {symbol ?? ''}
    </span>
  );
};

export default TokenAmount;
