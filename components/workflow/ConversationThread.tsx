"use client";

import React from 'react';
import { Message } from '@/lib/workflow';
import { cn } from '@/lib/utils';
import { User, ShieldCheck, FileText, Download } from 'lucide-react';

interface ConversationThreadProps {
    messages: Message[];
}

export function ConversationThread({ messages }: ConversationThreadProps) {
    return (
        <div className="space-y-6">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500",
                        msg.sender === 'BUYER' ? "self-start" : "self-end items-end ml-auto"
                    )}
                >
                    {/* Sender Info */}
                    <div className={cn(
                        "flex items-center gap-2 mb-1.5 px-1",
                        msg.sender === 'EXPORTER' && "flex-row-reverse"
                    )}>
                        <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center",
                            msg.sender === 'BUYER' ? "bg-slate-200 text-slate-600" : "bg-blue-100 text-blue-600"
                        )}>
                            {msg.sender === 'BUYER' ? <User size={12} /> : <ShieldCheck size={12} />}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {msg.sender === 'BUYER' ? 'Buyer' : 'Exporter'}
                            </span>
                            <span
                                className="text-[10px] text-slate-300 font-medium"
                                suppressHydrationWarning
                            >
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    {/* Message Bubble */}
                    <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                        msg.sender === 'BUYER'
                            ? "bg-white border border-slate-100 text-slate-700 shadow-sm"
                            : "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    )}>
                        {/* Simple Markdown-like formatting for bold */}
                        {msg.content.split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className={cn(msg.sender === 'EXPORTER' ? "text-blue-300" : "text-blue-600")}>{part}</strong> : part
                        )}
                    </div>

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => file.url && window.open(file.url, '_blank')}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors",
                                        msg.sender === 'EXPORTER'
                                            ? "bg-slate-50 border-slate-100 hover:bg-slate-100"
                                            : "bg-white border-slate-100 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 mb-0.5">{file.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{file.type}</p>
                                    </div>
                                    <Download size={14} className="ml-2 text-slate-300" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
