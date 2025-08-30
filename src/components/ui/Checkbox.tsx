import * as React from 'react';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // por si querés pasar una etiqueta al costado (opcional)
  label?: React.ReactNode;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="inline-flex cursor-pointer select-none items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          className={
            'h-4 w-4 rounded border border-border/60 align-middle ' +
            'focus:outline-none focus:ring-2 focus:ring-primary/50 ' +
            'disabled:cursor-not-allowed disabled:opacity-50 ' +
            className
          }
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
