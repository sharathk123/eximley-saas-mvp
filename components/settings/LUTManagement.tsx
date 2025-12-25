"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Upload, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function LUTManagement() {
    const [lutStatus, setLutStatus] = useState<'active' | 'expired' | 'none'>('active');
    const [expiryDate, setExpiryDate] = useState('2025-03-31');
    const [arnNumber, setArnNumber] = useState('AD2704240001234');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Letter of Undertaking (LUT)</h2>
                    <p className="text-xs text-slate-500 font-medium">Manage your LUT for zero-rated IGST exports</p>
                </div>
            </div>

            {/* Status Card */}
            <div className={cn(
                "p-6 rounded-2xl border relative overflow-hidden",
                lutStatus === 'active' ? "bg-emerald-50/50 border-emerald-100" :
                    lutStatus === 'expired' ? "bg-amber-50/50 border-amber-100" : "bg-slate-50 border-slate-100"
            )}>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 p-8 opacity-5">
                    <FileText size={120} />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Status</span>
                            {lutStatus === 'active' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                    <CheckCircle2 size={10} /> Active
                                </span>
                            )}
                            {lutStatus === 'expired' && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                    <AlertTriangle size={10} /> Expired
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl font-black text-slate-800 tracking-tight">{arnNumber || 'No ARN Linked'}</div>
                            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                <Calendar size={14} />
                                Valid until: <span className="font-bold text-slate-700">{expiryDate}</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm">
                        View Certificate
                    </Button>
                </div>

                {lutStatus === 'expired' && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-amber-100/50 rounded-xl border border-amber-200/50">
                        <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                            <AlertTriangle size={16} />
                        </div>
                        <div className="text-xs text-amber-800 font-medium">
                            Your LUT has expired. Please renew specifically for FY 2025-26 to continue zero-rated exports.
                        </div>
                        <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700 text-white border-none h-8 text-xs">
                            Renew Now
                        </Button>
                    </div>
                )}
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label text="Financial Year" />
                    <select className="input-sleek w-full bg-white">
                        <option>2024-2025</option>
                        <option>2025-2026</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label text="ARN Number" />
                    <input
                        type="text"
                        className="input-sleek w-full"
                        placeholder="Enter ARN Number"
                        defaultValue={arnNumber}
                    />
                </div>
                <div className="col-span-2">
                    <Label text="Upload Certificate" hint="PDF / Image" />
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">LUT Certificate (Max 5MB)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Label({ text, hint }: { text: string, hint?: string }) {
    return (
        <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{text}</span>
            {hint && <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{hint}</span>}
        </div>
    );
}
