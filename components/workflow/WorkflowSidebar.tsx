"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Globe,
    Info,
    ArrowRight,
    Zap,
    Scale
} from 'lucide-react';
import { Shipment } from '@/lib/workflow';
import { cn } from '@/lib/utils';

interface WorkflowSidebarProps {
    shipment: Shipment;
}

export function WorkflowSidebar({ shipment }: WorkflowSidebarProps) {
    // Mock health score calculation based on status
    const getHealthScore = () => {
        const states = [
            'ENQUIRY_RECEIVED', 'QUOTE_SENT', 'QUOTE_ACCEPTED',
            'PI_APPROVED', 'PAYMENT_CONFIRMED', 'CI_PL_APPROVED',
            'SB_FILED', 'LEO_GRANTED', 'BL_APPROVED', 'CLOSED'
        ];
        const index = states.indexOf(shipment.status);
        if (index === -1) return 15;
        return Math.min(Math.floor((index + 1) * 12), 100);
    };

    const health = getHealthScore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Health Score Card */}
            <div className="card-sleek bg-slate-900 border-slate-800 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={80} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Shipment Ready</h3>
                        <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                    </div>

                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-black tracking-tighter">{health}%</span>
                        <div className="pb-2">
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 w-3 rounded-full transition-all duration-500",
                                            health >= i * 20 ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-slate-700"
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">AI Readiness Score</p>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        {health < 50 ? "Early stage analysis complete. Awaiting commercial terms." :
                            health < 80 ? "Operational data verified. Proceed to customs filing." :
                                "Final verification successful. Ready for vessel boarding."}
                    </p>
                </div>
            </div>

            {/* Smart Insights */}
            <div className="card-sleek border-dashed border-2 border-indigo-100 bg-indigo-50/30">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-indigo-600" />
                    AI Insights
                </h3>

                <div className="space-y-4">
                    <InsightItem
                        icon={<TrendingUp size={14} />}
                        title="Market Context"
                        desc={`Demand for ${shipment.goods} in ${shipment.destination.split(',')[1] || 'target region'} is up 12% this quarter.`}
                        color="indigo"
                    />
                    <InsightItem
                        icon={<Globe size={14} />}
                        title="Port Latency"
                        desc="Nhava Sheva reporting 4h faster turnaround for textile containers."
                        color="emerald"
                    />
                    <InsightItem
                        icon={<AlertTriangle size={14} />}
                        title="Regulation Alert"
                        desc="New GST circular (v4.2) applies to this HSN. AI has auto-applied the mapping."
                        color="amber"
                    />
                </div>
            </div>

            {/* Risk Assessment */}
            <div className="card-sleek">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Scale size={14} />
                    Risk Assessment
                </h3>

                <div className="space-y-5">
                    <RiskMetric label="Compliance" value={98} color="emerald" />
                    <RiskMetric label="Financial" value={85} color="indigo" />
                    <RiskMetric label="Logistics" value={72} color="indigo" />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-900 uppercase leading-none mb-1">Certified Shipment</p>
                            <p className="text-[10px] text-slate-500 font-medium">Verified by Eximley AI Core</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InsightItem({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className="flex gap-3 group cursor-default">
            <div className={cn(
                "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
                    color === 'emerald' ? "bg-emerald-100 text-emerald-600" :
                        "bg-amber-100 text-amber-600"
            )}>
                {icon}
            </div>
            <div>
                <h4 className="text-[11px] font-black text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">{title}</h4>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">{desc}</p>
            </div>
        </div>
    );
}

function RiskMetric({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                <span className="text-slate-500">{label}</span>
                <span className={cn(
                    color === 'emerald' ? "text-emerald-600" :
                        color === 'blue' ? "text-indigo-600" : "text-indigo-600"
                )}>{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full",
                        color === 'emerald' ? "bg-emerald-500" :
                            color === 'blue' ? "bg-indigo-500" : "bg-indigo-500"
                    )}
                />
            </div>
        </div>
    );
}
