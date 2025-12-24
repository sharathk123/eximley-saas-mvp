"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Loader2,
    CheckCircle2,
    XCircle,
    FileText,
    DollarSign,
    Scale,
    AlertTriangle,
    Sparkles,
    ScanLine,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shipment } from '@/lib/workflow';

interface AIAuditModalProps {
    shipment: Shipment;
    onClose: () => void;
}

type AuditStep = 'scanning' | 'analyzing' | 'complete';

interface AuditCheck {
    id: string;
    label: string;
    description: string;
    status: 'pass' | 'fail' | 'warning';
    score: number;
    icon: any;
}

export function AIAuditModal({ shipment, onClose }: AIAuditModalProps) {
    const [step, setStep] = useState<AuditStep>('scanning');
    const [checks, setChecks] = useState<AuditCheck[]>([]);
    const [overallScore, setOverallScore] = useState(0);

    useEffect(() => {
        // Simulate AI Audit Process
        const runAudit = async () => {
            // Phase 1: Scanning
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep('analyzing');

            // Phase 2: Analyzing (Simulated calculations)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate Mock Results
            const mockChecks: AuditCheck[] = [
                {
                    id: 'hscode',
                    label: 'HS Code Classification',
                    description: `HS Code matches product description "${shipment.goods}" with 98% confidence.`,
                    status: 'pass',
                    score: 98,
                    icon: Scale
                },
                {
                    id: 'valuation',
                    label: 'Valuation Consistency',
                    description: `Declared value ${shipment.value} is within 5% of market average for this region.`,
                    status: 'pass',
                    score: 95,
                    icon: DollarSign
                },
                {
                    id: 'docs',
                    label: 'Document Completeness',
                    description: 'Commercial Invoice found. Packing List missing signature.',
                    status: 'warning',
                    score: 75,
                    icon: FileText
                },
                {
                    id: 'sanctions',
                    label: 'Restricted Party Screening',
                    description: 'Buyer entity check clear. No sanctions lists matches found.',
                    status: 'pass',
                    score: 100,
                    icon: ShieldCheck
                }
            ];

            setChecks(mockChecks);
            setOverallScore(Math.round(mockChecks.reduce((acc, curr) => acc + curr.score, 0) / mockChecks.length));
            setStep('complete');
        };

        runAudit();
    }, [shipment]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-sleek w-full max-w-2xl overflow-hidden p-0 relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors z-10"
                >
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="p-8">
                    {step !== 'complete' ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="h-24 w-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-indigo-500/30">
                                    {step === 'scanning' ? (
                                        <ScanLine size={40} className="text-white animate-pulse" />
                                    ) : (
                                        <Sparkles size={40} className="text-white animate-spin-slow" />
                                    )}
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">
                                {step === 'scanning' ? 'Scanning Shipment Data...' : 'AI Analyzing Compliance...'}
                            </h2>
                            <p className="text-slate-500 font-medium max-w-sm">
                                {step === 'scanning'
                                    ? 'Extracting data points from documents and entry fields.'
                                    : 'Cross-referencing against global trade compliance databases.'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* Result Header */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            className="text-slate-100"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="40"
                                            cx="48"
                                            cy="48"
                                        />
                                        <motion.circle
                                            className={cn(
                                                overallScore >= 90 ? "text-emerald-500" : overallScore >= 70 ? "text-amber-500" : "text-red-500"
                                            )}
                                            strokeWidth="8"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="40"
                                            cx="48"
                                            cy="48"
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 - (251.2 * overallScore) / 100 }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-2xl font-black text-slate-900">{overallScore}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Audit Complete</h2>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Found <span className="font-bold text-slate-900">{checks.filter(c => c.status !== 'pass').length} issues</span> requiring attention.
                                    </p>
                                </div>
                            </div>

                            {/* Checks Grid */}
                            <div className="grid gap-4 mb-8">
                                {checks.map((check, idx) => (
                                    <motion.div
                                        key={check.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "p-4 rounded-xl border flex items-start gap-4",
                                            check.status === 'pass' && "bg-emerald-50/50 border-emerald-100",
                                            check.status === 'warning' && "bg-amber-50/50 border-amber-100",
                                            check.status === 'fail' && "bg-red-50/50 border-red-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                                            check.status === 'pass' && "bg-emerald-100 text-emerald-600",
                                            check.status === 'warning' && "bg-amber-100 text-amber-600",
                                            check.status === 'fail' && "bg-red-100 text-red-600"
                                        )}>
                                            <check.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-slate-900 text-sm">{check.label}</h4>
                                                {check.status === 'pass' && <CheckCircle2 size={16} className="text-emerald-500" />}
                                                {check.status === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                                                {check.status === 'fail' && <XCircle size={16} className="text-red-500" />}
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{check.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button className="btn-sleek-primary flex-1 shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700" onClick={onClose}>
                                    Acknowledge Report
                                </Button>
                                <Button variant="outline" className="btn-sleek-secondary flex-1" onClick={onClose}>
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
