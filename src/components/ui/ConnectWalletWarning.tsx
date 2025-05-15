// import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

/**
 * Shows a warning that the user needs to connect their wallet to perform the action specified
 * @param props.action A string that represents the action the user is trying to perform (e.g. "to vote")
 * @returns A div with a warning message and a subtle button to connect the wallet
 */
const ConnectWalletWarning = ({ action }: { action: string }) => {
  // const { open } = useWeb3Modal();

  return (
    <div className="flex flex-row items-center gap-x-1 opacity-80">
      <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
      <p className="leading-4">
        <button
          type="button"
          className="rounded-sm ring-ring ring-offset-2 ring-offset-background hover:underline focus:outline-none focus:ring-1"
          onClick={() => {
            alert('Connect wallet (mock)');
            // open();
          }}
        >
          Connect
        </button>{' '}
        your wallet {action}
      </p>
    </div>
  );
};

export default ConnectWalletWarning;
