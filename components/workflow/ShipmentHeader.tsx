import React from 'react';
import { Shipment } from '@/lib/workflow';
import { Box, MapPin, DollarSign, Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import { AIStatusPill } from './AIStatusPill';
import { cn } from '@/lib/utils';
import { WORKFLOW_STEPS } from '@/lib/workflow';

export function ShipmentHeader({ shipment }: { shipment: Shipment }) {
    const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.id === shipment.status);

    return (
        <div className="md:col-span-12 float-panel rounded-[2.5rem] p-8 mb-8 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-2xl shadow-slate-900/40 relative z-10">
                            {shipment.id.split('-')[1]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-indigo-600 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg z-20">
                            <Zap size={14} fill="currentColor" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{shipment.id}</h1>
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500">Export</span>
                                <span className="px-2 py-0.5 bg-white rounded-md shadow-sm text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-slate-200/50">Air</span>
                            </div>
                            <AIStatusPill shipment={shipment} />
                        </div>

                        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-500 font-bold">
                            <span className="flex items-center gap-2 group cursor-default">
                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <MapPin size={12} />
                                </div>
                                {shipment.destination}
                            </span>
                            <span className="flex items-center gap-2 group cursor-default">
                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                    <Briefcase size={12} />
                                </div>
                                {shipment.buyer}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Invoice Value</p>
                        <p className="text-2xl font-mono font-black text-slate-900 tracking-tighter">{shipment.value}</p>
                    </div>
                    <div className="h-12 w-[1px] bg-slate-200 hidden md:block"></div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Health Score</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-black text-indigo-600">92%</span>
                            <div className="h-2 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifecycle Progress Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100/60 flex items-center justify-between gap-4">
                <div className="flex-1 flex gap-1.5 h-1.5">
                    {WORKFLOW_STEPS.map((step, i) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-700",
                                i <= currentStepIndex ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.2)]" : "bg-slate-100"
                            )}
                            title={step.label}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage {currentStepIndex + 1}/{WORKFLOW_STEPS.length}</span>
                    <CheckCircle2 size={12} className="text-indigo-600" />
                </div>
            </div>
        </div>
    );
}
