"use client";

import React, { useState } from 'react';
import { ImportShipment } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Box, FileText, CheckCircle, Ship, ArrowRight, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SmartDocumentUpload } from '../../SmartDocumentUpload';

interface BillOfEntryViewProps {
    shipment: ImportShipment;
    onAction: (id: string, state: string, label: string) => void;
}

export function BillOfEntryView({ shipment, onAction }: BillOfEntryViewProps) {
    const isFiled = shipment.status === 'IMPORT_BOE_FILED';
    const [filing, setFiling] = useState(false);

    const handleFileBOE = async () => {
        setFiling(true);
        setTimeout(() => {
            setFiling(false);
            onAction(shipment.id, 'IMPORT_BOE_FILED', 'Filed Bill of Entry');
        }, 2000);
    };

    if (isFiled) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-20" />
                    <CheckCircle size={48} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">BOE Filed Successfully</h3>
                    <p className="text-slate-500 mt-2 font-medium">ICEGATE Ref: <span className="font-mono text-slate-700">BOE/24-25/009182</span></p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-xs border border-slate-100 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Est. Duty</span>
                        <span className="font-bold text-slate-900">₹ 4,25,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Status</span>
                        <span className="font-bold text-amber-600">Pending Assessment</span>
                    </div>
                </div>

                <Button
                    className="w-full max-w-xs h-12 rounded-xl bg-slate-900 text-white font-bold"
                    onClick={() => onAction(shipment.id, 'IMPORT_customs_ASSESSMENT', 'Check Status')}
                >
                    Check Assessment Status
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Port Arrival & BOE</h3>
                    <p className="text-sm text-slate-500 font-medium">Shipment arrived at {shipment.portOfEntry}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                    <Ship size={24} />
                </div>
            </div>

            {/* Checklist Card */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-6 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Info size={14} className="text-blue-500" />
                    Pre-Filing Checklist
                </h4>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle size={12} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">IGM Filed by Carrier</p>
                            <p className="text-xs text-slate-500">IGM No: 2293810</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle size={12} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Commercial Invoice & PL</p>
                            <p className="text-xs text-slate-500">Verified and available</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle size={12} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Country of Origin Certificate</p>
                            <p className="text-xs text-slate-500">Attached</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-indigo-900 uppercase">Estimated Duty Liability</span>
                        <span className="text-2xl font-black text-indigo-700">₹ 4,25,000</span>
                    </div>
                    <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[70%] bg-indigo-600 h-full rounded-full" />
                    </div>
                    <p className="text-[10px] text-indigo-500 mt-2 font-medium">Based on HSN 85423100 (18% GST + 10% BCD)</p>
                </div>
            </div>

            <div className="mt-auto pt-4">
                <div className="mt-auto pt-4 space-y-4">
                    {!filing && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Filing Method</span>
                            </div>
                            <div className="h-[300px]">
                                <SmartDocumentUpload
                                    title="Upload BOE Copy (Manual)"
                                    documentType="BOE"
                                    onExtractionComplete={(data, file) => {
                                        console.log("Extracted BOE Data:", data);
                                        handleFileBOE(); // Auto-file on upload for now
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">Or use automated filing</span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-200"
                        onClick={handleFileBOE}
                        disabled={filing}
                    >
                        {filing ? (
                            <>
                                <Loader2 size={20} className="mr-2 animate-spin" /> Filing with ICEGATE...
                            </>
                        ) : (
                            <>
                                Pay & File via ICEGATE <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
