import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline' | 'flat';
    hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-slate-200 shadow-sm',
            glass: 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl',
            outline: 'bg-transparent border border-slate-200',
            flat: 'bg-slate-50 border-none'
        };

        const hoverClasses = hoverable
            ? 'hover:shadow-md hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-0.5'
            : '';

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl p-6',
                    variants[variant],
                    hoverClasses,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
