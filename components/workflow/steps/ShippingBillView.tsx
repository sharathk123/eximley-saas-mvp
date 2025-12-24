"use client";

import React, { useState } from 'react';
import { Shipment } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Stamp, AlertTriangle, ExternalLink, Check, Sparkles, Lock } from 'lucide-react';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { AIGenerationHUD } from '../AIGenerationHUD';
import { cn } from '@/lib/utils';

export function ShippingBillView({ shipment }: { shipment: Shipment }) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isCHA = currentRole === 'CHA';
    const isExporter = currentRole === 'EXPORTER_ADMIN' || currentRole === 'EXPORT_MANAGER';

    // In MANUAL mode, Exporter acts as CHA
    const canFile = isCHA || (shipment.chaMode === 'MANUAL' && isExporter);

    const [showPDF, setShowPDF] = useState(false);
    const [genState, setGenState] = useState<'IDLE' | 'GENERATING' | 'REVIEW'>(
        shipment.status === 'SB_FILED' || shipment.status === 'LEO_GRANTED' ? 'REVIEW' : 'IDLE'
    );
    const [isApproved, setIsApproved] = useState(false);

    const handleGenerate = () => {
        setGenState('GENERATING');
    };

    const handleAction = () => {
        if (shipment.status === 'SB_PENDING_CHA') {
            updateShipmentStatus(shipment.id, 'SB_FILED', 'Approved & Filed Shipping Bill');
            setGenState('REVIEW');
        } else if (shipment.status === 'SB_FILED') {
            updateShipmentStatus(shipment.id, 'LEO_GRANTED', 'Marked LEO Granted');
        }
    };

    if (shipment.status === 'LEO_GRANTED') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 animate-in zoom-in-95 duration-500">
                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                    <ShieldCheck size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">LEO Granted</h3>
                <p className="text-slate-500 mt-2 max-w-xs text-sm">
                    The **Let Export Order** has been officially granted by customs. The shipment is now ready for loading.
                </p>
                <div className="mt-8 pt-8 border-t border-emerald-100 w-full flex flex-col gap-4">
                    <Button
                        size="lg"
                        className="w-full bg-slate-900 hover:bg-slate-800 font-bold"
                        onClick={() => updateShipmentStatus(shipment.id, 'BL_APPROVED', 'Initiated Bill of Lading process')}
                    >
                        Proceed to Bill of Lading
                    </Button>
                </div>
            </div>
        )
    }

    if (genState === 'GENERATING') {
        return (
            <AIGenerationHUD
                title="Drafting Shipping Bill"
                description={`Analyzing Invoice and Packing List for ${shipment.id}. AI is mapping fields to ICEGATE requirements and validating HSN codes...`}
                onComplete={() => setGenState('REVIEW')}
            />
        );
    }

    if (genState === 'IDLE') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-200 shadow-sm">
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Filing Documentation</h3>
                <p className="text-slate-500 mt-2 max-w-xs text-sm">
                    Ready to file the Shipping Bill. Use AI to auto-draft the SB from your approved Commercial Invoice.
                </p>

                <div className="mt-8 w-full flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold h-14 rounded-2xl"
                        onClick={handleGenerate}
                    >
                        <Sparkles size={18} className="mr-2" />
                        AI Generate Shipping Bill
                    </Button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                        Powered by Customs Compliance AI Engine
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <PDFViewer
                isOpen={showPDF}
                onClose={() => setShowPDF(false)}
                title="Draft Shipping Bill #SB-4992"
                url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            />

            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Shipping Bill Review</h3>
                    <p className="text-slate-500 text-sm">Review AI-drafted SB and approve for filing.</p>
                </div>
                {shipment.chaMode === 'EMBEDDED' && (
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1",
                        isCHA ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                        <Stamp size={12} /> {isCHA ? 'CHA AUTHORIZED' : 'CHA EXCLUSIVE'}
                    </span>
                )}
            </div>

            {/* Draft SB Preview */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-6 flex-1 shadow-inner">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="font-serif font-bold text-slate-700 text-lg text-blue-600">SB</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-md">Shipping_Bill_Draft.pdf</p>
                            <p className="text-xs text-slate-400 font-medium">AI Generated • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 font-bold hover:bg-blue-50"
                        onClick={() => setShowPDF(true)}
                    >
                        Preview Draft
                    </Button>
                </div>

                {/* Compliance Checklist */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">AI Compliance Clearance</p>

                    <CheckItem label="HS Code Validation (610910)" status="pass" />
                    <CheckItem label="Customs Value Integrity (Within 1.5% margin)" status="pass" />
                    <CheckItem label="GST Returns Alignment" status="pass" />
                    <CheckItem label="Currency conversion (USD -> INR @ 83.4)" status="warning" text="Market-linked rate applied" />
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
                {!canFile ? (
                    <div className="bg-slate-100 rounded-2xl p-4 text-center border border-slate-200/50">
                        <p className="text-slate-500 text-xs font-medium flex items-center justify-center gap-2">
                            <AlertTriangle size={14} className="text-amber-500" />
                            Waiting for Authorized CHA to Approve & File.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                CHA Verification Signature Required
                            </p>
                        </div>

                        {/* Human-in-the-loop Approval Section */}
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 animate-in slide-in-from-bottom-2 duration-500 transition-all">
                            <label
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 group bg-white",
                                    isApproved ? "border-blue-500 shadow-sm" : "border-slate-100 hover:border-blue-200"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                    checked={isApproved}
                                    onChange={(e) => setIsApproved(e.target.checked)}
                                    disabled={shipment.status === 'SB_FILED'}
                                />
                                <span className={cn("text-[11px] font-bold transition-colors", isApproved ? "text-blue-900" : "text-slate-500 group-hover:text-blue-600")}>
                                    I have reviewed the ICEGATE draft and approve the compliance filing.
                                </span>
                            </label>
                        </div>

                        <Button
                            size="lg"
                            className={cn(
                                "w-full transition-all active:scale-[0.98] h-14 rounded-2xl font-bold border-b-4",
                                isApproved || shipment.status === 'SB_FILED'
                                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 border-slate-700"
                                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            )}
                            onClick={handleAction}
                            disabled={!isApproved && shipment.status !== 'SB_FILED'}
                        >
                            {isApproved || shipment.status === 'SB_FILED' ? <ExternalLink size={18} className="mr-2" /> : <Lock size={16} className="mr-2" />}
                            {shipment.status === 'SB_FILED' ? 'Mark LEO Granted (Simulation)' : 'Approve & File on ICEGATE'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckItem({ label, status, text }: { label: string, status: 'pass' | 'warning', text?: string }) {
    return (
        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-sm animate-in slide-in-from-left-2 duration-500">
            <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${status === 'pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {status === 'pass' ? <Check size={12} strokeWidth={3} /> : <AlertTriangle size={12} />}
            </div>
            <div>
                <p className="text-sm text-slate-900 font-bold">{label}</p>
                {text && <p className="text-[10px] text-slate-500 mt-0.5 tracking-tight">{text}</p>}
            </div>
        </div>
    )
}
