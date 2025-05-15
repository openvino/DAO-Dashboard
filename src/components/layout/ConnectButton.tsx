import {
  HiExclamationCircle,
  HiOutlineArrowLeftOnRectangle,
} from 'react-icons/hi2';
import Jazzicon from 'react-jazzicon';
import { FaWallet } from 'react-icons/fa';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';

import { client } from '@/src/config/thirdwebClient';

import { defineChain } from 'thirdweb/chains';
import {
  ConnectButton as ThirdwebConnectButton,
  useActiveAccount,
} from 'thirdweb/react';
import { baseSepolia } from 'thirdweb/chains';

const ConnectButton = ({ connected = false }: { connected?: boolean }) => {
  const account = useActiveAccount();
  const address = account?.address ?? '';
  const jazznumber = address
    ? parseInt(address.slice(2, 10), 16)
    : Math.floor(Math.random() * 1_000_000);

  return connected ? (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex rounded-full text-sm focus:outline-none">
          <span className="sr-only">Open wallet menu</span>
          <Jazzicon diameter={40} seed={jazznumber} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="absolute -right-2 -top-2">
                <div>
                  <HiExclamationCircle className="text-xl text-primary drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Incorrect Network</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>
            <div className="flex items-center justify-center gap-x-2">
              <Jazzicon diameter={24} seed={jazznumber} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-medium text-popover-foreground">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{address}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group">
            <button className="flex w-full items-center gap-x-2 text-sm text-popover-foreground">
              <HiOutlineArrowLeftOnRectangle className="text-xl" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <ThirdwebConnectButton client={client} chain={defineChain(baseSepolia)} />
  );
};

export default ConnectButton;
