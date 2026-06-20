import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60',
        variant === 'primary' && 'bg-primary text-white shadow-soft hover:bg-blue-700',
        variant === 'secondary' && 'bg-secondary text-white hover:bg-slate-800',
        variant === 'accent' && 'bg-accent text-white hover:bg-orange-600',
        variant === 'outline' && 'border border-border bg-white text-secondary hover:border-primary hover:text-primary',
        variant === 'ghost' && 'bg-transparent text-secondary hover:bg-slate-100',
        className
      )}
      {...props}
    />
  );
}
