"use client";

import React, { useState } from 'react';
import { Shipment, EnquiryData } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Save, ArrowLeft, DollarSign, Package, Truck, Sparkles, FileText, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { AIGenerationHUD } from '../AIGenerationHUD';
import { cn } from '@/lib/utils';
import { INCOTERMS, PAYMENT_TERMS, CURRENCIES, UNIT_OF_MEASURE } from '@/lib/constants/masterData';

interface ReplyQuotationViewProps {
    shipment: Shipment;
    isRevision?: boolean;
    onBack: () => void;
    onSend: (data: any) => void;
}

export function ReplyQuotationView({ shipment, isRevision, onBack, onSend }: ReplyQuotationViewProps) {
    const { enquiry } = shipment;
    const [genState, setGenState] = useState<'IDLE' | 'GENERATING' | 'REVIEW'>('IDLE');
    const [isApproved, setIsApproved] = useState(false);
    const [formData, setFormData] = useState({
        message: `Dear ${shipment.buyer.split(' ')[0]},

Thank you for your enquiry for **${shipment.goods}**. We are pleased to offer our best quotation based on your requirements.

**Pricing:** $12.00 per Piece (FOB India)
**Timeline:** 15-20 Days for production
**Valid Until:** 15 May 2025

Please find the detailed quotation attached. We look forward to your positive response.

Best Regards,
Exports Team`,
        price: '12.00',
        currency: 'USD',
        unit: 'PCS',
        validity: '15 Days',
        terms: 'FOB',
        paymentTerms: 'ADVANCE_30_70',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!enquiry) return null;

    if (genState === 'GENERATING') {
        return (
            <AIGenerationHUD
                title="Drafting AI Quotation"
                description={`Analyzing buyer enquiry from ${shipment.buyer} and matching with product catalog for ${shipment.goods}. Optimizing pricing based on market trends...`}
                onComplete={() => setGenState('REVIEW')}
            />
        );
    }

    if (genState === 'IDLE') {
        return (
            <div className="h-full flex flex-col animate-in fade-in duration-500">
                <Button variant="ghost" size="sm" onClick={onBack} className="w-fit text-slate-500 hover:text-slate-900 mb-6">
                    <ArrowLeft size={16} className="mr-2" /> Back to Thread
                </Button>

                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles size={120} className="text-blue-600" />
                    </div>

                    <div className="h-20 w-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 border-4 border-white shadow-xl relative animate-in zoom-in-50 duration-500">
                        <DollarSign size={40} />
                        <div className="absolute -top-2 -right-2 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                            <Sparkles size={18} className="text-blue-600 animate-pulse" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Quotation Engine</h3>
                    <p className="text-slate-500 mt-3 max-w-sm text-base leading-relaxed">
                        Generate a professional, high-conversion quotation optimized for <strong>{shipment.destination}</strong> market standards.
                    </p>

                    <div className="mt-10 w-full max-w-xs flex flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 font-bold h-16 rounded-2xl text-white transition-all active:scale-[0.98] border-b-4 border-blue-800"
                            onClick={() => setGenState('GENERATING')}
                        >
                            <Sparkles size={20} className="mr-2" />
                            Draft with AI Agent
                        </Button>
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                Human Approval Required
                            </p>
                            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 hover:text-slate-900">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                        <Sparkles size={10} /> AI DRAFTED
                    </span>
                    <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block leading-none">
                            {isRevision ? 'Revising' : 'Response to'}
                        </span>
                        <span className="text-sm font-bold text-slate-800">{enquiry.id}</span>
                    </div>
                </div>
            </div>

            {/* AI Insights HUD - Condensed */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl border border-slate-800 animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles size={40} className="text-blue-400" />
                </div>
                <h4 className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={10} />
                    AI Drafting Insights
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-emerald-400 mt-0.5" />
                        <p className="text-[10px] text-slate-300">Priced at **85th percentile** for GCC region.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-emerald-400 mt-0.5" />
                        <p className="text-[10px] text-slate-300">Tone matching buyer's formal style.</p>
                    </div>
                </div>
            </div>

            {/* Response Message Section */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-blue-600" /> Professional Response
                </h3>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                    <Textarea
                        rows={8}
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                        className="relative bg-white border-slate-200 resize-none rounded-2xl shadow-sm focus:ring-blue-500/20"
                        placeholder="Type your professional response here..."
                    />
                </div>
            </div>

            {/* Quotation Form */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-blue-600" /> Commercial Offer
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Unit Price</label>
                        <div className="flex gap-2">
                            <select
                                className="w-20 h-12 rounded-xl border border-slate-200 bg-white px-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                {CURRENCIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                                ))}
                            </select>
                            <Input
                                className="flex-1 h-12 rounded-xl border-slate-200"
                                value={formData.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Per Unit</label>
                        <select
                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        >
                            {UNIT_OF_MEASURE.map(u => (
                                <option key={u.code} value={u.code}>{u.name} ({u.code})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Incoterms</label>
                        <select
                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                            value={formData.terms}
                            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                        >
                            {INCOTERMS.map(i => (
                                <option key={i.code} value={i.code}>{i.code} - {i.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Payment Terms</label>
                        <select
                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                            value={formData.paymentTerms}
                            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                        >
                            {PAYMENT_TERMS.map(p => (
                                <option key={p.code} value={p.code}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Validity</label>
                    <Input
                        className="h-12 rounded-xl border-slate-200"
                        value={formData.validity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, validity: e.target.value })}
                        placeholder="e.g. 15 Days"
                    />
                </div>
            </div>

            {/* Human-in-the-loop Approval Section */}
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4 animate-in slide-in-from-bottom-2 duration-500 transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-900 tracking-tight">Compliance Confirmation</h4>
                        <p className="text-[11px] text-blue-700/70 font-medium">Verify AI accuracy before buyer communication</p>
                    </div>
                </div>

                <label
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 group",
                        isApproved ? "bg-white border-blue-500 shadow-md scale-[1.01]" : "bg-white/50 border-slate-200 hover:border-blue-300"
                    )}
                >
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-2 border-slate-300 text-blue-600 focus:ring-blue-500/20"
                        checked={isApproved}
                        onChange={(e) => setIsApproved(e.target.checked)}
                    />
                    <span className={cn("text-xs font-bold transition-colors", isApproved ? "text-blue-900" : "text-slate-500 group-hover:text-blue-600")}>
                        I have reviewed the AI draft and approve the commercial terms.
                    </span>
                </label>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button
                    size="lg"
                    disabled={!isApproved}
                    className={cn(
                        "flex-1 transition-all active:scale-[0.98] h-16 rounded-[1.25rem] font-black text-base border-b-4",
                        isApproved
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 border-blue-800"
                            : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    )}
                    onClick={() => onSend(formData)}
                >
                    {isApproved ? <Send size={20} className="mr-2" /> : <Lock size={18} className="mr-2" />}
                    {isRevision ? 'Approve & Send Revised Quotation' : 'Approve & Send Quotation'}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" className="border-slate-200 rounded-xl text-xs font-black h-12 hover:bg-slate-50">
                        <Sparkles size={14} className="mr-2 text-blue-500" />
                        AI Rewrite
                    </Button>
                    <Button variant="outline" size="lg" className="border-slate-200 rounded-xl text-xs font-black h-12 hover:bg-slate-50">
                        <Save size={14} className="mr-2" />
                        Save Draft
                    </Button>
                </div>
            </div>
        </div>
    );
}
