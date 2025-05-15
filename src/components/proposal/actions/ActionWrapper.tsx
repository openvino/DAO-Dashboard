import { IconType } from 'react-icons';
import { createElement, ReactNode } from 'react';

interface ActionWrapperProps {
  icon: IconType;
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Simple native details-based wrapper for a proposal action.
 */
const ActionWrapper = ({
  icon,
  title,
  description,
  children,
}: ActionWrapperProps) => {
  const Icon = createElement(icon, {
    className: 'h-5 w-5 shrink-0 text-popover-foreground/80',
  });

  return (
    <details className="rounded-md border border-border p-4">
      <summary className="flex cursor-pointer items-center gap-x-2 text-lg font-medium">
        {Icon}
        <span>{title}</span>
      </summary>
      <div className="mt-2 space-y-4 pl-7">
        <p className="text-popover-foreground/80">{description}</p>
        {children && (
          <>
            <ActionContentSeparator />
            {children}
          </>
        )}
      </div>
    </details>
  );
};

export const ActionContentSeparator = () => (
  <hr className="border-t border-accent" />
);

export default ActionWrapper;
