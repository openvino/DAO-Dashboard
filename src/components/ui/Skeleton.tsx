/**
 * @fileoverview This file contains the Skeleton component, which is a placeholder to show while content is loading.
 * Inspired by https://ui.shadcn.com/docs/components/skeleton
 */

import { cn } from '@/src/lib/utils';

/**
 * Skeleton component to be used as a placeholder while content is loading.
 * As this uses `bg-popover`, it is recommended to use this inside of a Card component (or MainCard) that uses the default variant, and therefore has `bg-highlight`.
 * @warning This should not be used in place of rendering a Card component, as you can pass a loading state to the Card component itself.
 * @returns A div that pulses slowly to indicate a loading state.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-popover', className)}
      {...props}
    />
  );
}

export { Skeleton };
