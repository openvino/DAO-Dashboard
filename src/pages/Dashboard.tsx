import React from 'react';
import { format } from 'date-fns';
import {
  HiArrowRight,
  HiCalendar,
  HiCircleStack,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';

import Logo from '@/src/components/Logo';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import ProposalCard from '@/src/components/governance/ProposalCard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useAllProposals } from '../hooks/useAllProposals';
import { useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { useProposalCountFromApi } from '@/src/hooks/useProposalCountFromApi';

const Dashboard = () => {
  const dao = {
    name: 'OpenVinoDAO',
    ensDomain: 'openvino.eth',
    description: 'Tokenization - Traceability - Transparency.',
    creationDate: new Date(),
    address: import.meta.env.VITE_TIMELOCK_ADDRESS,
    links: [
      { name: 'OpenVino', url: 'https://openvino.org/' },
      { name: 'OpenVino Exchange', url: 'https://openvino.exchange.org/' },
    ],
  };

  const {
    proposals,
    loading: loadingProposals,
    error: errorProposals,
  } = useAllProposals();

  const {
    daoTransfers,
    loading: loadingTransfers,
    error: errorTransfers,
  } = useDaoTransfers();

  const {
    count: proposalCount,
    loading: loadingCount,
    error: errorCount,
  } = useProposalCountFromApi();

  const members = [
    { address: '0x87495d92Ad7655BF8bcC6447ea715498238517aF', weight: 100n },
    { address: '0xcbAD825A1F37139D78CdbC1198b8291F65762DED', weight: 150n },
  ];

  return (
    <div className="grid grid-cols-7 gap-6">
      {/* DAO Info */}
      <Card className="col-span-full flex flex-row justify-between">
        <div className="flex flex-col gap-y-4">
          <Header>{dao.name}</Header>
          <p>{dao.description}</p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-x-1">
              <HiCalendar className="text-primary" />
              <p>{format(dao.creationDate, 'MMMM yyyy')}</p>
            </div>
            <div className="flex items-center gap-x-1">
              <HiHome className="text-primary" />
              <p>{dao.address}</p>
            </div>
          </div>
        </div>
        <Logo className="h-24 w-24" />
      </Card>

      {/* Proposals */}
      <MainCard
        className="col-span-full lg:col-span-4"
        icon={HiInboxStack}
        header={
          <DefaultMainCardHeader
            value={loadingCount ? '...' : errorCount ? '!' : proposalCount ?? 0}
            label="proposals created"
          />
        }
        aside={<Link label="New proposal" to="/governance/new-proposal" />}
      >
        {loadingProposals ? (
          <Skeleton className="h-24 w-full" />
        ) : errorProposals ? (
          <p className="text-red-500">{errorProposals}</p>
        ) : proposals.length > 0 ? (
          <>
            {proposals.slice(0, 2).map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
            <Link to="/governance" className="flex gap-1 text-sm text-white">
              View all proposals <HiArrowRight />
            </Link>
          </>
        ) : (
          <p>No proposals found</p>
        )}
      </MainCard>

      {/* Side column */}
      <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
        {/* Transfers */}
        <MainCard
          icon={HiCircleStack}
          header={
            <DefaultMainCardHeader
              value={daoTransfers?.length ?? 0}
              label="transfers"
            />
          }
        >
          {loadingTransfers ? (
            <Skeleton className="h-16 w-full" />
          ) : errorTransfers ? (
            <p className="text-red-500">{errorTransfers}</p>
          ) : daoTransfers && daoTransfers.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {daoTransfers.slice(0, 2).map((t) => (
                <li key={t.transactionId}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold capitalize">{t.type}</p>
                      <p className="text-xs">
                        {t.creationDate.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <TokenAmount
                        amount={t.amount}
                        tokenDecimals={t.decimals}
                        symbol={t.tokenSymbol}
                        sign={t.type === 'withdraw' ? '-' : '+'}
                      />
                      <Address
                        address={t.transactionId}
                        maxLength={AddressLength.Small}
                        hasLink
                        showCopy={false}
                        link={`https://sepolia.basescan.org/tx/${t.transactionId}`}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transfers found</p>
          )}
        </MainCard>

        {/* Members */}
        <MainCard
          icon={HiUserGroup}
          header={
            <DefaultMainCardHeader value={members.length} label="members" />
          }
        >
          <ul className="space-y-1 text-sm">
            {members.map((m, i) => (
              <li key={i}>
                <Address
                  address={m.address}
                  maxLength={AddressLength.Medium}
                  hasLink
                  link={`https://sepolia.basescan.org/address/${m.address}`}
                />
              </li>
            ))}
          </ul>
        </MainCard>
      </div>
    </div>
  );
};

export default Dashboard;
