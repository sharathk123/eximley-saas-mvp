"use client";

import React from 'react';
import { ImportShipment, Message } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Zap, MessageCircle, FileText, Globe } from 'lucide-react';
import { ConversationThread } from '../../ConversationThread';
import { cn } from '@/lib/utils';

interface ImportEnquiryViewProps {
    shipment: ImportShipment;
    onReply?: () => void;
}

export function ImportEnquiryView({ shipment, onReply }: ImportEnquiryViewProps) {
    const { enquiry, messages, supplier, origin } = shipment;

    if (!enquiry) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <MessageCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Enquiry Sent</h3>
                <p className="text-sm text-slate-500 max-w-xs">Waiting for supplier quotation details to be synced.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Context Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Globe size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/30 flex items-center gap-1.5">
                            <FileText size={10} /> Import Enquiry
                        </div>
                        <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5">
                            <Zap size={10} /> Active
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 tracking-tight">Sourcing Request</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        You have requested a quotation for <span className="text-white font-bold">{shipment.goods}</span> from <span className="text-white font-bold">{supplier}</span> ({origin}).
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Quantity</p>
                            <p className="text-xs font-bold text-white">{enquiry.quantity}</p>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expectations</p>
                            <p className="text-xs font-bold text-white">{enquiry.expectations}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Communication History</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Waiting for supplier response...</span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden text-sm">
                    {/* Display the initial enquiry message if no conversation thread yet, or the full thread */}
                    <ConversationThread messages={messages} />
                </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <Button
                    variant="ghost"
                    size="lg"
                    className="w-full h-14 rounded-[1.75rem] text-slate-500 font-bold hover:bg-slate-50"
                    disabled
                >
                    Waiting for Supplier Quotation
                </Button>
            </div>
        </div>
    );
}
