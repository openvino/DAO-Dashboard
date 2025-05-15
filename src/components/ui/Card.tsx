import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const cardVariants = cva(
  'w-full rounded-lg h-fit shadow-md text-clip relative',
  {
    variants: {
      variant: {
        default: 'bg-highlight ',
        warning:
          'bg-destructive-background text-destructive-foreground shadow-lg',
        light: 'bg-popover',
        outline: 'bg-transparent border border-border shadow-none',
      },
      size: {
        default: 'px-5 py-4',
        sm: 'px-4 py-2',
        lg: 'px-6 sm:px-10 py-4 sm:py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const loadingVariants = cva('animate-pulse', {
  variants: {
    size: {
      default: 'min-h-[100px]',
      sm: 'min-h-[50px]',
      lg: 'min-h-[150px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CardProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, loading = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, className }),
          loading && loadingVariants({ size })
        )}
        {...props}
      >
        {!loading && props.children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ✅ Estos son los componentes que te faltaban:
export const CardHeader = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pt-4', className)}>{children}</div>
);

export const CardContent = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pb-4', className)}>{children}</div>
);

export { Card, cardVariants };
