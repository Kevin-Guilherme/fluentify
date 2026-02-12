import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/30 hover:scale-105':
              variant === 'primary',
            'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-200':
              variant === 'secondary',
            'hover:bg-slate-800 text-gray-300': variant === 'ghost',
            'px-4 py-3 text-base': size === 'default',
            'px-3 py-2 text-sm': size === 'sm',
            'px-6 py-4 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
