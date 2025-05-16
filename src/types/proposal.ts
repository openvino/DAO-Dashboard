export type ProposalStatus =
  | 'ALL'
  | 'Pending'
  | 'Active'
  | 'Canceled'
  | 'Defeated'
  | 'Succeeded'
  | 'Queued'
  | 'Expired'
  | 'Executed';

export type Proposal = {
  id: string;
  title: string;
  description: string;
  proposer: string;
  startBlock: number;
  endBlock: number;
  status: ProposalStatus;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  totalVotingWeight: bigint;
  rawDescription: string;
  targets: string[];
  values: string[];
  calldatas: string[];
};
