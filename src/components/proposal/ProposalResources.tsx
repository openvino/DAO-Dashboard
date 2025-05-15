import { HiArrowTopRightOnSquare, HiLink } from 'react-icons/hi2';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';

export interface ProposalResource {
  name: string;
  url: string;
}

export interface ProposalResourcesProps
  extends Omit<MainCardProps, 'icon' | 'header'> {
  resources: ProposalResource[] | undefined;
  loading?: boolean;
}

/**
 * MainCard component for displaying resources
 */
export const ProposalResources = ({
  resources,
  loading = false,
  className,
  ...props
}: ProposalResourcesProps) => {
  const filtered = resources?.filter((resource) => resource.url !== '');

  return (
    <MainCard
      loading={loading ?? resources ? true : false}
      className={cn(className, 'shrink')}
      icon={HiLink}
      header={
        <DefaultMainCardHeader
          value={filtered?.length ?? 0}
          label="resources"
        />
      }
      {...props}
    >
      {!filtered || filtered.length === 0 ? (
        <div className="italic text-highlight-foreground/80">
          No resources added
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((resource) => (
            <li key={resource.url}>
              <Card size="sm" variant="light">
                <a
                  href={resource.url}
                  rel="noreferrer"
                  target="_blank"
                  className="flex flex-row items-center gap-x-2 font-medium text-primary transition-colors duration-200 hover:text-primary/80"
                >
                  {resource.name}
                  <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
                </a>
                <p className="text-xs text-popover-foreground/80">
                  {resource.url}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </MainCard>
  );
};
export default ProposalResources;
