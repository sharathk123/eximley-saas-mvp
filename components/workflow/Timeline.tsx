"use client";

import React from 'react';
import { WORKFLOW_STEPS, IMPORT_WORKFLOW_STEPS, ShipmentState, ImportState, Role, getStepColor } from '@/lib/workflow';
import { Check, Lock, Clock, Info, ShieldCheck, FileText, Truck, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/context/WorkflowContext';

interface TimelineProps {
    currentStatus: ShipmentState | ImportState;
    className?: string;
}

export function Timeline({ currentStatus, className }: TimelineProps) {
    const isImport = currentStatus.startsWith('IMPORT_');
    const steps = isImport ? IMPORT_WORKFLOW_STEPS : WORKFLOW_STEPS;

    // Find index in the appropriate array
    // We cast currentStatus because we know which array we are searching based on isImport
    const currentStepIndex = steps.findIndex(s => s.id === currentStatus);
    const currentColor = getStepColor(currentStatus);

    const colorClasses: Record<string, { bg: string, border: string, text: string, ring: string, glow: string }> = {
        blue: { bg: 'bg-indigo-600', border: 'border-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500/20', glow: 'shadow-[0_0_20px_rgba(79,70,229,0.3)]' },
        purple: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-violet-600', ring: 'ring-violet-500/20', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' },
        amber: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500', ring: 'ring-amber-500/20', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
        emerald: { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500/20', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
        slate: { bg: 'bg-slate-600', border: 'border-slate-600', text: 'text-slate-600', ring: 'ring-slate-500/20', glow: 'shadow-[0_0_20px_rgba(71,85,105,0.3)]' }
    };

    const currentColors = colorClasses[currentColor] || colorClasses.blue;

    return (
        <div className={cn("relative pl-4", className)}>
            {/* Connector Line */}
            <div className="absolute left-[32px] top-6 bottom-6 w-0.5 bg-slate-200" />
            <div
                className={cn("absolute left-[32px] top-6 w-0.5 transition-all duration-1000 ease-in-out", currentColors.bg)}
                style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            <div className="space-y-6 relative">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isLocked = index > currentStepIndex;
                    const stepColor = getStepColor(step.id);
                    const sc = colorClasses[stepColor];

                    return (
                        <div key={step.id} className={cn("relative flex items-start group", isLocked && "opacity-50 blur-[0.5px]")}>
                            {/* Icon Bubble */}
                            <div
                                className={cn(
                                    "flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500",
                                    isCompleted ? `${sc.bg} ${sc.border} text-white shadow-lg shadow-slate-900/5` :
                                        isCurrent ? `bg-white ${sc.border} ${sc.text} ${sc.glow} scale-110` :
                                            "bg-slate-50 border-slate-300 text-slate-300"
                                )}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> :
                                    isCurrent ? <Clock size={16} className="animate-pulse" /> :
                                        <Lock size={14} />}
                            </div>

                            {/* Text Content */}
                            <div className={cn("ml-4 pt-1 transition-all duration-300", isCurrent && "translate-x-1")}>
                                <h4 className={cn(
                                    "text-sm font-semibold leading-none mb-1",
                                    isCompleted ? "text-slate-800" :
                                        isCurrent ? `${sc.text} font-bold` :
                                            "text-slate-400"
                                )}>
                                    {step.label}
                                </h4>
                                <p className="text-xs text-slate-500 max-w-[150px] leading-snug">
                                    {isCurrent ? step.description : (isCompleted ? 'Completed' : 'Pending')}
                                </p>

                                {/* Role Badge (Only for current) */}
                                {isCurrent && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {step.allowedRoles.map(role => (
                                            <span key={role} className={cn("text-[9px] uppercase font-black px-1.5 py-0.5 rounded border transition-colors",
                                                stepColor === 'blue' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                    stepColor === 'purple' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                        stepColor === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {role.replace('EXPORTER_', '').replace('COMPANY_', '').replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
