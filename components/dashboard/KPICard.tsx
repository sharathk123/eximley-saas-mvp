import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
}

export function KPICard({ label, value, change, trend, icon }: KPICardProps) {
    return (
        <div className="float-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' :
                            trend === 'down' ? 'text-emerald-700 bg-emerald-50' : /* Keep positive color for shipments usually */
                                'text-slate-600 bg-slate-50'
                        }`}>
                        {trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
                        {change}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            </div>

            {/* Decorative background blob */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform duration-700" />
        </div>
    );
}
