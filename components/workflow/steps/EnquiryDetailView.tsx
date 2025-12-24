"use client";

import React from 'react';
import { Shipment, Message } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Users, ChevronRight, Globe, Sparkles, Zap, AlertCircle } from 'lucide-react';
import { ConversationThread } from '../ConversationThread';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnquiryDetailViewProps {
    shipment: Shipment;
    onReply: () => void;
}

export function EnquiryDetailView({ shipment, onReply }: EnquiryDetailViewProps) {
    const { enquiry, messages, buyer, destination } = shipment;

    if (!enquiry) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Context Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-800">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/30 flex items-center gap-1.5">
                            <Sparkles size={10} /> AI Agent Summary
                        </div>
                        <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-1.5">
                            <Zap size={10} /> High Urgency
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 tracking-tight">Purchase Intent Detected</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Buyer is requesting pricing for <span className="text-white font-bold">{shipment.goods}</span> for delivery to <span className="text-white font-bold">{destination}</span>.
                        AI analysis of previous threads suggests a <span className="text-blue-400 font-bold">90% conversion probability</span> if replied within 4 hours.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sentiment</p>
                            <p className="text-xs font-bold text-emerald-400">Positive / Professional</p>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Key Constraint</p>
                            <p className="text-xs font-bold text-amber-400">Fixed Lead Time Required</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Communication History</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Last message received 2h ago</span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden">
                    <ConversationThread messages={messages} />
                </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-[1.75rem] shadow-xl shadow-blue-200 transition-all active:scale-[0.98] font-black text-base"
                    onClick={onReply}
                >
                    <Send size={20} className="mr-2" />
                    Reply with Intelligence-Backed Quotation
                </Button>
            </div>
        </div>
    );
}
