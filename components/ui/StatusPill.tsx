"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusPillProps {
    status: string;
    className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
    const formatStatus = (s: string) => s.replace(/_/g, ' ');

    let colorClass = "bg-slate-100 text-slate-600 border-slate-200";

    const normalizedStatus = status.toUpperCase();

    if (normalizedStatus.includes('APPROVED') ||
        normalizedStatus.includes('FILED') ||
        normalizedStatus.includes('GRANTED') ||
        normalizedStatus.includes('SUCCESS') ||
        normalizedStatus.includes('COMPLETED')) {
        colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/5";
    } else if (normalizedStatus.includes('PENDING') ||
        normalizedStatus.includes('DRAFT') ||
        normalizedStatus.includes('IN_PROGRESS') ||
        normalizedStatus.includes('RECEIVED')) {
        colorClass = "bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/5";
    } else if (normalizedStatus.includes('QUERY') ||
        normalizedStatus.includes('REJECTED') ||
        normalizedStatus.includes('DECLINED') ||
        normalizedStatus.includes('ERROR')) {
        colorClass = "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/5";
    } else if (normalizedStatus.includes('CLOSED')) {
        colorClass = "bg-slate-100 text-slate-500 border-slate-200";
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
            colorClass,
            className
        )}>
            {formatStatus(status)}
        </span>
    );
}
