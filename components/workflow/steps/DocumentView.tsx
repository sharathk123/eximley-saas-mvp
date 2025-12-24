"use client";

import React from 'react';
import { Shipment } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { FileText, Check, AlertTriangle, Eye, Download, Sparkles, CheckCircle, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { DocumentTemplate } from '../templates/DocumentTemplate';
import { AIGenerationHUD } from '../AIGenerationHUD';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DocumentView({ shipment }: { shipment: Shipment }) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isAllowed = currentRole === 'EXPORT_MANAGER' || currentRole === 'EXPORTER_ADMIN';
    const [viewDoc, setViewDoc] = useState<{ isOpen: boolean, title: string, type: 'CI' | 'PL' | null }>({ isOpen: false, title: '', type: null });
    const [genState, setGenState] = useState<'IDLE' | 'GENERATING' | 'REVIEW'>(
        shipment.status === 'CI_PL_APPROVED' || shipment.status === 'SB_PENDING_CHA' ? 'REVIEW' : 'IDLE'
    );
    const [isApproved, setIsApproved] = useState(false);

    const openDoc = (title: string, type: 'CI' | 'PL') => {
        setViewDoc({ isOpen: true, title, type });
    };

    const handleGenerate = () => {
        setGenState('GENERATING');
    };

    const handleAction = () => {
        updateShipmentStatus(shipment.id, 'SB_PENDING_CHA', 'Approved CI/PL');
        setGenState('REVIEW');
    };

    if (genState === 'GENERATING') {
        return (
            <AIGenerationHUD
                title="Drafting Commercial Documents"
                description={`AI is extracting data from PI and Proforma for ${shipment.id}. Calculating net/gross weights and generating Commercial Invoice & Packing List...`}
                onComplete={() => setGenState('REVIEW')}
            />
        );
    }

    if (genState === 'IDLE') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 shadow-sm">
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Commercial Doc Preparation</h3>
                <p className="text-slate-500 mt-2 max-w-xs text-sm">
                    Payment confirmed. Now, let AI auto-draft your Commercial Invoice & Packing List based on the approved PI.
                </p>

                <div className="mt-8 w-full flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100 font-bold h-14 rounded-2xl transition-all active:scale-[0.98]"
                        onClick={handleGenerate}
                    >
                        <Sparkles size={18} className="mr-2" />
                        AI Generate CI & PL
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <PDFViewer
                isOpen={viewDoc.isOpen}
                onClose={() => setViewDoc({ ...viewDoc, isOpen: false })}
                title={viewDoc.title}
            >
                {viewDoc.type && <DocumentTemplate shipment={shipment} type={viewDoc.type} />}
            </PDFViewer>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Commercial Docs Review</h3>
                    <p className="text-slate-500 text-sm">Review AI-drafted documents and approve for CHA filing.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle size={12} /> AI DRAFTED
                </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide mb-6">
                {/* Document Card 1: Commercial Invoice */}
                <div className="group border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all bg-white shadow-sm hover:shadow-md animate-in slide-in-from-left-2 duration-500">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Commercial Invoice</h4>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">CI-2024-001 • AI Generated</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 bg-slate-50 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => openDoc('Commercial Invoice - CI-2024-001', 'CI')}
                            >
                                <Eye size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-slate-50"><Download size={18} /></Button>
                        </div>
                    </div>

                    {/* AI Validation Strip */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3">
                        <div className="mt-0.5 text-emerald-600"><CheckCircle size={14} /></div>
                        <div className="text-[11px] text-emerald-800 leading-relaxed">
                            <span className="font-bold block mb-0.5 uppercase tracking-tighter">AI Compliance Pass</span>
                            Matches PO #PO-9982 exactly. Total value ${shipment.value} verified.
                        </div>
                    </div>
                </div>

                {/* Document Card 2: Packing List */}
                <div className="group border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition-all bg-white shadow-sm hover:shadow-md animate-in slide-in-from-left-2 duration-500 delay-150">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Packing List</h4>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">PL-2024-001 • AI Generated</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 bg-slate-50 hover:bg-purple-50 hover:text-purple-600"
                                onClick={() => openDoc('Packing List - PL-2024-001', 'PL')}
                            >
                                <Eye size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-slate-50"><Download size={18} /></Button>
                        </div>
                    </div>

                    {/* AI Insight Strip */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3">
                        <div className="mt-0.5 text-blue-600"><Sparkles size={14} /></div>
                        <div className="text-[11px] text-blue-800 leading-relaxed">
                            <span className="font-bold block mb-0.5 uppercase tracking-tighter">AI Logistical Insight</span>
                            Optimized for 2 Euro-pallets. Total Net Weight 450kg, Gross 480kg.
                        </div>
                    </div>
                </div>
            </div>

            {/* Human-in-the-loop Approval Section */}
            <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100 space-y-4 animate-in slide-in-from-bottom-2 duration-500 transition-all mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-purple-900 tracking-tight">Compliance Confirmation</h4>
                        <p className="text-[11px] text-purple-700/70 font-medium">Verify AI accuracy for Commercial Invoice & Packing List</p>
                    </div>
                </div>

                <label
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 group",
                        isApproved ? "bg-white border-purple-500 shadow-md scale-[1.01]" : "bg-white/50 border-slate-200 hover:border-purple-300"
                    )}
                >
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-2 border-slate-300 text-purple-600 focus:ring-purple-500/20"
                        checked={isApproved}
                        onChange={(e) => setIsApproved(e.target.checked)}
                        disabled={shipment.status === 'SB_PENDING_CHA'}
                    />
                    <span className={cn("text-xs font-bold transition-colors", isApproved ? "text-purple-900" : "text-slate-500 group-hover:text-purple-600")}>
                        I have reviewed the AI-generated CI & PL and approve them for CHA filing.
                    </span>
                </label>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
                {!isAllowed ? (
                    <div className="bg-slate-100 rounded-2xl p-4 text-center border border-slate-200/50">
                        <p className="text-slate-500 text-xs font-medium flex items-center justify-center gap-2">
                            <AlertTriangle size={14} className="text-amber-500" />
                            Waiting for Export Manager to Approve Docs.
                        </p>
                    </div>
                ) : (
                    <Button
                        size="lg"
                        className={cn(
                            "w-full transition-all active:scale-[0.98] h-14 rounded-2xl font-bold border-b-4",
                            isApproved || shipment.status === 'SB_PENDING_CHA'
                                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 border-slate-700"
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        )}
                        onClick={handleAction}
                        disabled={!isApproved && shipment.status !== 'SB_PENDING_CHA'}
                    >
                        {isApproved || shipment.status === 'SB_PENDING_CHA' ? <ExternalLink size={18} className="mr-2" /> : <Lock size={16} className="mr-2" />}
                        {shipment.status === 'SB_PENDING_CHA' ? "Docs Approved & Sent to CHA" : "Approve & Send to CHA"}
                    </Button>
                )}
            </div>
        </div>
    );
}
