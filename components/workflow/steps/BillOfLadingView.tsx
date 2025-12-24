"use client";

import React from 'react';
import { Shipment } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Upload, AlertTriangle, Sparkles, ShieldCheck, ExternalLink, ShieldCheck as ShieldIcon, Lock } from 'lucide-react';
import { AIGenerationHUD } from '../AIGenerationHUD';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function BillOfLadingView({ shipment }: { shipment: Shipment }) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isAllowed = currentRole === 'EXPORT_MANAGER' || currentRole === 'EXPORTER_ADMIN';
    const [genState, setGenState] = useState<'IDLE' | 'GENERATING' | 'REVIEW'>(
        shipment.status === 'BL_APPROVED' || shipment.status !== 'ENQUIRY_RECEIVED' ? 'REVIEW' : 'IDLE'
    );
    const [isApproved, setIsApproved] = useState(false);

    const handleGenerate = () => {
        setGenState('GENERATING');
    };

    const handleAction = () => {
        updateShipmentStatus(shipment.id, 'FINANCIAL_RECONCILIATION', 'Approved BL & Sent for Reconciliation');
        setGenState('REVIEW');
    };

    if (genState === 'GENERATING') {
        return (
            <AIGenerationHUD
                title="Processing Bill of Lading"
                description={`Analyzing carrier data and matching with Shipping Bill for ${shipment.id}. AI is verifying container numbers and SEAL integrity...`}
                onComplete={() => setGenState('REVIEW')}
            />
        );
    }

    if (genState === 'IDLE') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200 shadow-sm">
                    <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Cargo Hand-over</h3>
                <p className="text-slate-500 mt-2 max-w-xs text-sm">
                    The carrier has released the draft Bill of Lading. Use AI to auto-verify against your Shipping Bill and Invoice.
                </p>

                <div className="mt-8 w-full flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold h-14 rounded-2xl text-white transition-all active:scale-[0.98]"
                        onClick={handleGenerate}
                    >
                        <Sparkles size={18} className="mr-2" />
                        AI Generate & Match BL
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">BL Finalization</h3>
                    <p className="text-slate-500 text-sm">Review AI-matched BL and approve for closure.</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                    <ShieldCheck size={12} /> AI VERIFIED
                </span>
            </div>

            <div className="flex-1">
                {/* AI Matched BL Preview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                        <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-200">
                            BL
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">MAERSK_BL_5592.pdf</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Matched with SB-4992 via AI Engine</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter flex items-center gap-1">
                                    <CheckCircle size={10} /> 100% Match
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-bold uppercase tracking-widest text-[9px] mb-1">Port of Loading</span>
                            <span className="font-bold text-slate-900">Nhava Sheva (INNSA)</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-bold uppercase tracking-widest text-[9px] mb-1">Port of Discharge</span>
                            <span className="font-bold text-slate-900">Hamburg (DEHAM)</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                            <span className="text-slate-400 block font-bold uppercase tracking-widest text-[9px] mb-1">Container & Seal</span>
                            <span className="font-bold text-slate-900">MSKU992837 / SEAL-0021</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                {/* Human-in-the-loop Approval Section */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 animate-in slide-in-from-bottom-2 duration-500 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                            <ShieldIcon size={16} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-blue-900 tracking-tight">Final Verification</h4>
                            <p className="text-[10px] text-blue-700/70 font-medium">Confirm AI data matches physical BL for closure</p>
                        </div>
                    </div>

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
                            disabled={shipment.status === 'CLOSED'}
                        />
                        <span className={cn("text-[11px] font-bold transition-colors", isApproved ? "text-blue-900" : "text-slate-500 group-hover:text-blue-600")}>
                            I have verified the BL details and container numbers against the official carrier document.
                        </span>
                    </label>
                </div>

                {!isAllowed ? (
                    <div className="bg-slate-100 rounded-2xl p-4 text-center border border-slate-200/50">
                        <p className="text-slate-500 text-xs font-medium flex items-center justify-center gap-2">
                            <AlertTriangle size={14} className="text-amber-500" />
                            Waiting for Export Manager to Approve.
                        </p>
                    </div>
                ) : (
                    <Button
                        size="lg"
                        className={cn(
                            "w-full transition-all active:scale-[0.98] h-14 rounded-2xl font-bold border-b-4",
                            isApproved || shipment.status === 'CLOSED'
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/10 border-blue-800"
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        )}
                        onClick={handleAction}
                        disabled={!isApproved && shipment.status !== 'CLOSED'}
                    >
                        {isApproved || shipment.status === 'CLOSED' ? <ExternalLink size={18} className="mr-2" /> : <Lock size={16} className="mr-2" />}
                        {shipment.status === 'CLOSED' ? "Shipment Successfully Closed" : "Approve BL & Proceed to Reconciliation"}
                    </Button>
                )}
            </div>
        </div>
    );
}
