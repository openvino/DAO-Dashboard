import { Proposal } from './proposal';

export type DetailedProposal = Proposal & {
  result: {
    yes: bigint;
    no: bigint;
    abstain?: bigint;
  };
  totalVotingWeight: bigint;
};
