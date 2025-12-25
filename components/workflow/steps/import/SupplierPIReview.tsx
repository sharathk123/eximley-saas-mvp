"use client";

import React, { useState } from 'react';
import { ImportShipment } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, CheckCircle, AlertTriangle, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupplierPIReviewProps {
    shipment: ImportShipment;
    onAction: (id: string, state: string, label: string) => void;
}

export function SupplierPIReview({ shipment, onAction }: SupplierPIReviewProps) {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [reviewed, setReviewed] = useState(false);

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Supplier PI Review</h3>
                    <p className="text-sm text-slate-500 font-medium">Upload and verify the Proforma Invoice from {shipment.supplier}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                    <FileText size={24} />
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center transition-all hover:border-blue-300 hover:bg-blue-50/30 group">
                {!fileUploaded ? (
                    <div className="space-y-4 cursor-pointer" onClick={() => setFileUploaded(true)}>
                        <div className="h-16 w-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Upload size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">Click to upload Supplier PI</p>
                            <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">PI-{shipment.id.split('-')[1]}.pdf</p>
                                <p className="text-[10px] text-slate-400">2.4 MB • Just now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setFileUploaded(false); }}>
                                <AlertTriangle size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Verification Checklist */}
            <div className={cn(
                "space-y-4 transition-all duration-500 delay-100",
                fileUploaded ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4 pointer-events-none blur-[1px]"
            )}>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Verification Checklist</h4>

                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-xs font-bold text-slate-700">Invoice Value Matches Quote</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{shipment.value}</span>
                            <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-xs font-bold text-slate-700">Supplier Bank Details</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Verified IBAN</span>
                            <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-xs font-bold text-slate-700">HS Code Compliance</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Auto-Mapped</span>
                            <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                    </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                    <input
                        type="checkbox"
                        checked={reviewed}
                        onChange={(e) => setReviewed(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <span className="text-xs font-medium text-slate-600">I confirm the PI details are correct and approved for payment.</span>
                </label>
            </div>

            <div className="pt-4 mt-auto">
                <Button
                    size="lg"
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
                    disabled={!fileUploaded || !reviewed}
                    onClick={() => onAction(shipment.id, 'IMPORT_PI_APPROVED', 'Approved Supplier PI')}
                >
                    <CheckCircle size={18} className="mr-2" />
                    Approve PI
                </Button>
            </div>
        </div>
    );
}
