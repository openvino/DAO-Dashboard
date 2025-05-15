// src/components/governance/ProposalStatusBadge.tsx
import { HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi2';

export function ProposalStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Active':
      return <HiClock className="h-5 w-5 text-yellow-500" />;
    case 'Succeeded':
    case 'Executed':
      return <HiCheckCircle className="h-5 w-5 text-green-500" />;
    case 'Defeated':
      return <HiXCircle className="h-5 w-5 text-red-500" />;
    default:
      return <HiClock className="h-5 w-5 text-muted-foreground" />;
  }
}
