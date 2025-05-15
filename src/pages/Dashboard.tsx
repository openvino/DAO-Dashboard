import Logo from '@/src/components/Logo';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { format } from 'date-fns';
import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiCalendar,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';
import ProposalCard from '@/src/components/governance/ProposalCard';

const Dashboard = () => {
  const dao = {
    name: 'Example DAO',
    ensDomain: 'example.eth',
    description: 'A sample DAO dashboard',
    creationDate: new Date(),
    address: '0x1234...abcd',
    links: [{ name: 'Website', url: 'https://example.org' }],
  };

  const proposals = [
    {
      id: '1',
      status: 'Active',
      creatorAddress: '0x123',
      startDate: new Date(),
      endDate: new Date(),
      result: { yes: 100n, no: 10n },
      totalVotingWeight: 200n,
      metadata: { title: 'Mock Proposal', summary: 'Lorem ipsum...' },
    },
  ];

  const transfers = [];

  const members = [
    { address: '0xabc', weight: 100n },
    { address: '0xdef', weight: 200n },
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
        header={<DefaultMainCardHeader value={1} label="proposals created" />}
        aside={<Link label="New proposal" to="/governance/new-proposal" />}
      >
        {proposals.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
        <Link to="/governance" className="flex gap-1 text-sm text-primary">
          View all proposals <HiArrowRight />
        </Link>
      </MainCard>

      {/* Side column */}
      <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
        {/* Transfers */}
        <MainCard
          icon={HiCircleStack}
          header={<DefaultMainCardHeader value={0} label="transfers" />}
        >
          <p>No transfers found</p>
        </MainCard>

        {/* Members */}
        <MainCard
          icon={HiUserGroup}
          header={<DefaultMainCardHeader value={2} label="members" />}
        >
          <ul className="text-sm">
            {members.map((m, i) => (
              <li key={i}>{m.address}</li>
            ))}
          </ul>
        </MainCard>
      </div>
    </div>
  );
};

export default Dashboard;
