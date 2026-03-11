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

export interface ProposalResource {
  name: string;
  url: string;
}

export interface IProposalAction {
  interface: string;
  method: string;
  params: { [name: string]: unknown };
}

/** Proposal as returned by useAllProposals (list view) */
export interface Proposal {
  id: string;
  status: ProposalStatus;
  creatorAddress: string;
  startDate: Date;
  endDate: Date;
  result: {
    yes: bigint;
    no: bigint;
  };
  totalVotingWeight: bigint;
  metadata: {
    title: string;
    summary: string;
  };
  actions: IProposalAction[];
}

export interface VoteCast {
  address: string;
  support: string;
  weight: bigint;
}

/** Full proposal as returned by useProposalById (detail view) */
export interface DetailedProposal extends Proposal {
  creationDate: Date;
  creationBlock: number;
  executionDate?: Date;
  rawDescription: string;
  result: {
    yes: bigint;
    no: bigint;
    abstain?: bigint;
  };
  usedVotingWeight: bigint;
  votes: VoteCast[];
  targets: string[];
  values: string[];
  calldatas: string[];
}
