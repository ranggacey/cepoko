'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'outline'
  | 'purple';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  default:
    'bg-green-300 text-white hover:bg-green-300 focus-visible:ring-green-300',
  secondary:
    'bg-green-300 text-white hover:bg-green-300 focus-visible:ring-green-300',
  ghost:
    'bg-transparent text-white hover:bg-white/10 focus-visible:ring-green-300',
  link: 'bg-transparent text-white hover:underline',
  destructive:
    'bg-red text-white hover:bg-red focus-visible:ring-red',
  outline:
    'border border-green-300 bg-green-300 text-white hover:bg-green-300 focus-visible:ring-green-300',
  purple:
    'bg-green-300 text-white hover:bg-green-300 focus-visible:ring-green-300',
};

const sizes = {
  sm: 'h-8 px-3',
  md: 'h-9 px-4',
  lg: 'h-10 px-5',
  icon: 'h-9 w-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    if (asChild) {
      const child = props.children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(base, variants[variant], sizes[size], className),
        style: { color: 'white !important', ...(child.props as any)?.style },
        ref,
      });
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ color: 'white !important', ...props.style }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';


