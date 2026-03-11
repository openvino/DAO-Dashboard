import { MouseEvent, useEffect, useState } from 'react';
import {
  HiArrowTopRightOnSquare,
  HiArrowsUpDown,
  HiBeaker,
  HiCalendarDays,
  HiCurrencyDollar,
  HiQrCode,
} from 'react-icons/hi2';

import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';

const getLaunchDate = () => {
  const now = Date.now();
  const currentYear = new Date(now).getFullYear();
  const currentYearLaunch = new Date(
    `${currentYear}-12-10T12:00:00-03:00`
  );

  if (currentYearLaunch.getTime() > now) {
    return currentYearLaunch;
  }

  return new Date(`${currentYear + 1}-12-10T12:00:00-03:00`);
};

const LAUNCH_DATE = getLaunchDate();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  launched: boolean;
};

const launchDateLabel = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
}).format(LAUNCH_DATE);

const getTimeLeft = (): TimeLeft => {
  const difference = LAUNCH_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, launched: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    launched: false,
  };
};

const smoothScrollTo = (event: MouseEvent<HTMLElement>, targetId: string) => {
  event.preventDefault();
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const salePhases = [
  {
    title: 'Phase 1 · Community ignition',
    supply: '0 → 2.5M OVI',
    price: '$1 per OVI',
    description:
      'Genesis wallets, core community and early partner nodes access the first 2.5 million tokens at the nominal $1 value to seed DAO membership.',
  },
  {
    title: 'Phase 2 · Momentum builders',
    supply: '2.5M → 5M OVI',
    price: '$2 per OVI',
    description:
      'Pricing steps to $2 once the first tranche is cleared, rewarding the earliest believers while continuing to finance onboarding and audits.',
  },
  {
    title: 'Phase 3 · Liquidity pool & gOVI',
    supply: '5M → 10M OVI',
    price: 'Market-driven',
    description:
      'All remaining OVI is paired with ETH/USDC in the liquidity pool. Locked OVI mints gOVI for governance, letting LPs vote and farm fees.',
  },
];

const roadmapMilestones = [
  {
    id: 'launch',
    title: 'Token & Crowdsale Launch',
    date: '10 Dec 2024 · 12:00 (ART)',
    summary:
      'Deploy the OVI contracts, open the staged sale, and activate the countdown across all channels.',
    details: [
      '10 million OVI are minted at deployment; 5 million are liquid for the crowdsale, and 5 million are reserved for liquidity, attractor programs, and DAO ops.',
      'The staged crowdsale keeps pricing predictable for wineries that must lock 2,500 OVI each to access Tokenization, Transparency, and Traceability tooling.',
      'Launch communications will reference the Purple Paper so investors can dive deeper into business model proofs.',
    ],
    icon: HiCalendarDays,
  },
  {
    id: 'dao-dry-run',
    title: 'DAO Implementation Dry Run',
    date: 'Post-Launch · Continuous',
    summary:
      'While sales run, contributors test the DAO workflows using gOVI, the wrapped governance token sitting in the liquidity pool.',
    details: [
      'gOVI is minted 1:1 when OVI is bonded into the LP. It carries voting power, delegation, and proposal rights during the shakedown phase.',
      'Liquidity providers effectively stress-test treasury policies, revenue routing, and emergency procedures before the first major votes go live.',
      'Alternative names inspired by other DAO LP wrappers (e.g., OVI-LP) remain on the table if branding research suggests a clearer story.',
    ],
    icon: HiBeaker,
  },
  {
    id: 'traceability',
    title: '“You Drink It, You Own It” Expansion',
    date: 'Immediately After Launch',
    summary:
      'Activate bottle scanning so every validated tasting session mints an NFT plus one OVI as a data bounty.',
    details: [
      'Wine drinkers scan serialized QR codes, share their tasting feedback, and automatically receive an NFT record plus OVI for their contribution.',
      'Wineries redeem the associated customer data by purchasing OVI from the DAO liquidity pool once the attractor allocation is gone.',
      'Growing YDIYOI participation feeds composable data: token pricing + certification metadata + real customer sentiment.',
    ],
    icon: HiQrCode,
  },
  {
    id: 'token-split',
    title: 'Token Split Governance Event',
    date: 'When price pressure demands',
    summary:
      'As OVI appreciates, the DAO can trigger an on-chain split to keep rewards aligned with bottle economics.',
    details: [
      'When OVI’s unit price risks overshooting the wine it represents, a split proposal doubles supply for all holders while keeping their notional value unchanged.',
      'A split is executed only after an on-chain vote of staked gOVI holders confirms that market conditions justify the adjustment.',
      'This mechanism guarantees that YDIYOI rewards stay meaningful and that DAO access does not become prohibitively expensive for wineries.',
    ],
    icon: HiArrowsUpDown,
  },
];

const TokenLaunch = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="launch-plan-top" className="space-y-10">
      <section className="space-y-4">
        <Header>OpenVinoDAO Launch & Crowdsale</Header>
        <p className="text-lg text-muted-foreground">
          A focused excerpt of the Purple Paper covering the OVI token issuance,
          staged sale, and roadmap milestones leading to a fully on-chain,
          community-driven OpenVinoDAO.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-full space-y-4 p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <HiCalendarDays className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Launch locked
              </p>
              <p className="text-2xl font-semibold">{launchDateLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => {
              const values = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ];

              return (
                <div
                  key={label}
                  className="rounded-lg bg-highlight px-4 py-3 text-center"
                >
                  <p className="text-3xl font-bold tabular-nums">
                    {timeLeft.launched ? '00' : values[index].toString().padStart(2, '0')}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
          {timeLeft.launched && (
            <p className="text-sm text-green-500">
              Launch window reached—refer to the DAO updates for the live status.
            </p>
          )}
        </Card>

        <Card className="space-y-3 p-6">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Token economics snapshot
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-semibold">Total Supply:</span> 10,000,000 OVI
            </li>
            <li>
              <span className="font-semibold">Crowdsale:</span> 5M OVI via staged
              pricing
            </li>
            <li>
              <span className="font-semibold">Liquidity & DAO:</span> 5M OVI reserved
              for LPs, YDIYOI rewards, and attractor programs
            </li>
            <li>
              <span className="font-semibold">Governance wrapper:</span> gOVI
              minted 1:1 when OVI enters the LP
            </li>
          </ul>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <Header level={2}>Staged crowdsale</Header>
          <p className="text-muted-foreground">
            Predictable pricing lets wineries and contributors plan capital
            commitments while ensuring the DAO treasury knows when to unlock the
            liquidity pool.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {salePhases.map((phase) => (
            <Card key={phase.title} className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <Header level={3} className="text-xl">
                  {phase.title}
                </Header>
                <HiCurrencyDollar className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {phase.supply}
              </p>
              <p className="text-2xl font-bold">{phase.price}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {phase.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <Header level={2}>Roadmap</Header>
          <p className="text-muted-foreground">
            Click on any milestone to scroll to the detailed plan.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {roadmapMilestones.map((milestone) => {
            const Icon = milestone.icon;

            return (
              <a
                key={milestone.id}
                href={`#${milestone.id}`}
                className="group rounded-xl border border-border bg-background/40 p-5 transition hover:border-primary"
                onClick={(event) => smoothScrollTo(event, milestone.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {milestone.date}
                    </p>
                    <p className="text-lg font-semibold">{milestone.title}</p>
                  </div>
                  <Icon className="h-6 w-6 text-primary transition group-hover:scale-110" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {milestone.summary}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                  View details <HiArrowTopRightOnSquare className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <Header level={2}>Detailed milestones</Header>
        <div className="space-y-4">
          {roadmapMilestones.map((milestone) => {
            const Icon = milestone.icon;

            return (
              <Card
                key={milestone.id}
                id={milestone.id}
                className="scroll-mt-24 space-y-3 p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-7 w-7 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {milestone.date}
                    </p>
                    <p className="text-2xl font-semibold">{milestone.title}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {milestone.summary}
                </p>
                <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
                  {milestone.details?.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <div className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                  <a
                    href="#launch-plan-top"
                    onClick={(event) => smoothScrollTo(event, 'launch-plan-top')}
                  >
                    Back to top
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TokenLaunch;
