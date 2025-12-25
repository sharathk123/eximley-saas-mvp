"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
    const pathname = usePathname();

    // Split pathname into segments and remove empty strings
    const segments = pathname.split('/').filter(segment => segment !== '');

    // Generate crumbs
    const crumbs = segments.map((segment, index) => {
        // Create the path for this segment
        const href = `/${segments.slice(0, index + 1).join('/')}`;

        // Format the label
        // 1. decodeURI for spaces/special chars
        // 2. Replace hyphens/underscores with spaces
        // 3. Capitalize first letter of each word
        const label = decodeURIComponent(segment)
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            href,
            label,
            isLast: index === segments.length - 1
        };
    });

    return (
        <nav aria-label="Breadcrumb" className="flex items-center">
            <ol className="flex items-center gap-2">
                {/* Home Link */}
                <li>
                    <Link
                        href="/dashboard"
                        className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Dashboard"
                    >
                        <Home size={16} />
                    </Link>
                </li>

                {crumbs.length > 0 && <ChevronRight size={14} className="text-slate-300" />}

                {/* Segments */}
                {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-2">
                        {crumb.isLast ? (
                            <span
                                className="font-bold text-xs uppercase tracking-widest text-indigo-900 px-2 py-1 bg-indigo-50/50 rounded-lg border border-indigo-100/50"
                                aria-current="page"
                            >
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors hover:underline decoration-indigo-200 underline-offset-4"
                            >
                                {crumb.label}
                            </Link>
                        )}

                        {!crumb.isLast && (
                            <ChevronRight size={14} className="text-slate-300" />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
