import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { toast } from '@/src/hooks/useToast';
import { copyToClipboard, truncateMiddle } from '@/src/lib/utils';
import React, { useState } from 'react';
import { HiCheck, HiDocumentDuplicate } from 'react-icons/hi2';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

export enum AddressLength {
  Small = 10,
  Medium = 20,
  Large = 40,
  Full = -1, // no truncation
}

const jazziconVariants = {
  none: 0,
  sm: 16,
  md: 24,
  lg: 32,
};

type AddressProps = {
  address: string;
  maxLength: AddressLength;
  hasLink: boolean;
  showCopy: boolean;
  replaceYou?: boolean;
  jazziconSize?: 'sm' | 'md' | 'lg' | 'none';
  currentUser?: string; // nuevo parámetro opcional
};

export const Address: React.FC<AddressProps> = ({
  address,
  maxLength,
  hasLink,
  showCopy,
  replaceYou = true,
  jazziconSize = 'none',
  currentUser,
}) => {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const etherscanURL = `https://etherscan.io/address/${address}`;

  const isCurrentUser =
    replaceYou &&
    currentUser &&
    address.toLowerCase() === currentUser.toLowerCase();

  const linkContent = isCurrentUser
    ? 'you'
    : truncateMiddle(address, maxLength);

  const handleClick = () => {
    if (showCopy) {
      copyToClipboard(address);
      setStatus('copied');
      toast({
        title: 'Copied to clipboard!',
        variant: 'success',
      });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="flex flex-row items-center gap-x-2">
      {jazziconSize !== 'none' && (
        <Jazzicon
          diameter={jazziconVariants[jazziconSize]}
          seed={jsNumberForAddress(address)}
        />
      )}
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="rounded-sm">
              {hasLink ? (
                <a
                  href={etherscanURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-highlight underline transition-colors duration-200 hover:text-primary-highlight/80"
                >
                  {linkContent}
                </a>
              ) : (
                <span>{linkContent}</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Open in block explorer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showCopy && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleClick}
                  className="ml-2 rounded-sm transition-opacity duration-200 hover:opacity-80"
                >
                  {status === 'copied' ? (
                    <HiCheck className="text-[1.15em]" />
                  ) : (
                    <HiDocumentDuplicate className="text-[1.15em]" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
