import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';

const headerCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

export interface HeaderCardProps
  extends CardProps,
    VariantProps<typeof headerCardVariants> {
  title: string;
  description?: string;
  icon?: React.ElementType;
  aside?: ReactNode;
}

const HeaderCard = React.forwardRef<HTMLDivElement, HeaderCardProps>(
  (
    { className, title, description, icon: Icon, aside = '', ...props },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        size="lg"
        className={cn(
          headerCardVariants({}),
          className,
          'flex h-full flex-col justify-between gap-y-6 sm:flex-row'
        )}
        {...props}
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
              <Header>{title}</Header>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {props.children}
        </div>
        <>{aside}</>
      </Card>
    );
  }
);
HeaderCard.displayName = 'HeaderCard';

export { HeaderCard, headerCardVariants };
