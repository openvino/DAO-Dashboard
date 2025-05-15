import { useEffect, useState } from 'react';

export enum VotingMode {
  STANDARD = 'STANDARD',
  EARLY_EXECUTION = 'EARLY_EXECUTION',
  VOTE_REPLACEMENT = 'VOTE_REPLACEMENT',
}

export type VotingSettings = {
  minDuration: number; // in seconds
  minParticipation: number; // 0 to 1
  minProposerVotingPower: bigint;
  supportThreshold: number; // 0 to 1
  votingMode: VotingMode;
};

export type UseVotingSettingsData = {
  loading: boolean;
  error: string | null;
  settings: VotingSettings | null;
};

export type UseVotingSettingsProps = {
  useDummyData?: boolean;
};

const dummyVotingSettings: VotingSettings = {
  minDuration: 86400,
  minParticipation: 0.15,
  minProposerVotingPower: 1000000000000000000n,
  supportThreshold: 0.5,
  votingMode: VotingMode.EARLY_EXECUTION,
};

export const useVotingSettings = ({
  useDummyData = true,
}: UseVotingSettingsProps): UseVotingSettingsData => {
  const [settings, setSettings] = useState<VotingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useDummyData) {
      setSettings(dummyVotingSettings);
      setLoading(false);
    } else {
      setLoading(false);
      setError('Voting client not available (SDK removed)');
    }
  }, []);

  return {
    settings,
    loading,
    error,
  };
};
