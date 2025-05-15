import CheckList from '@/src/components/icons/CheckList';
import { Accordion } from '@/src/components/ui/Accordion';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';

export interface IProposalAction {
  interface: string;
  method: string;
  params: { [name: string]: any };
}

export interface ProposalActionsProps
  extends Omit<MainCardProps, 'icon' | 'header'> {
  actions: IProposalAction[] | undefined;
  loading?: boolean;
}

/**
 * Display a list of actions in an Accordion
 */
const ProposalActions = ({
  actions,
  children,
  loading,
  ...props
}: ProposalActionsProps) => {
  return (
    <MainCard
      loading={loading}
      icon={CheckList}
      header={
        <DefaultMainCardHeader value={actions?.length ?? 0} label="actions" />
      }
      {...props}
    >
      {!actions || actions.length === 0 ? (
        <div className="italic text-popover-foreground/80">
          No actions attached
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {actions.map((action, i) => {
            const namedParams = Object.entries(action.params).filter(([key]) =>
              isNaN(Number(key))
            );

            return (
              <details
                key={i}
                className="rounded-md border border-border p-3"
                open={false}
              >
                <summary className="cursor-pointer font-medium">
                  {action.interface} → <code>{action.method}</code>
                </summary>

                <div className="mt-2 text-sm text-foreground/80">
                  {namedParams.map(([key, val], j) => (
                    <div key={j} className="flex justify-between py-0.5">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="ml-2 break-all font-mono">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </Accordion>
      )}

      {children}
    </MainCard>
  );
};

export default ProposalActions;
