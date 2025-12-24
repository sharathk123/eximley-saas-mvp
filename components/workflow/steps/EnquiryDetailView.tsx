"use client";

import React from 'react';
import { Shipment, Message } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Users, ChevronRight, Globe } from 'lucide-react';
import { ConversationThread } from '../ConversationThread';
import { cn } from '@/lib/utils';

interface EnquiryDetailViewProps {
    shipment: Shipment;
    onReply: () => void;
}

export function EnquiryDetailView({ shipment, onReply }: EnquiryDetailViewProps) {
    const { enquiry, messages, buyer, destination } = shipment;

    if (!enquiry) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Conversation: {buyer}</h2>
                    <p className="text-sm text-slate-500">{enquiry.id} • {destination}</p>
                </div>
            </div>

            {/* Conversation Thread */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden">
                <ConversationThread messages={messages} />
            </div>

            {/* Actions Panel */}
            <div className="bg-slate-50/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Actions</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-tight">Step: {shipment.status.replace('_', ' ')}</span>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                        onClick={onReply}
                    >
                        <Send size={18} className="mr-2" />
                        Reply with Quotation
                    </Button>
                </div>
            </div>
        </div>
    );
}
