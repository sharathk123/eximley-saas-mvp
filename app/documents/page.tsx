"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentsPage() {
    const documents = [
        { id: '1', name: 'Commercial Invoice - ENQ-001', type: 'Invoice', date: '2024-12-24', size: '245 KB' },
        { id: '2', name: 'Packing List - ENQ-001', type: 'Packing List', date: '2024-12-24', size: '128 KB' },
        { id: '3', name: 'Shipping Bill - EXP-001', type: 'Shipping Bill', date: '2024-12-23', size: '512 KB' },
        { id: '4', name: 'Bill of Lading - EXP-002', type: 'BL', date: '2024-12-22', size: '389 KB' },
    ];

    const getDocTypeColor = (type: string) => {
        switch (type) {
            case 'Invoice': return 'indigo';
            case 'Packing List': return 'emerald';
            case 'Shipping Bill': return 'purple';
            case 'BL': return 'amber';
            default: return 'slate';
        }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Documents</h1>
                            <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                Universal Digital Archive
                            </p>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="card-sleek shadow-2xl border-slate-100">
                    <div className="space-y-3">
                        {documents.map((doc, idx) => {
                            const color = getDocTypeColor(doc.type);
                            return (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                        color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                        color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                        color === 'purple' && "bg-purple-50 text-purple-600",
                                        color === 'amber' && "bg-amber-50 text-amber-600",
                                        color === 'slate' && "bg-slate-100 text-slate-600"
                                    )}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                                color === 'indigo' && "bg-indigo-50 text-indigo-700 border-indigo-100",
                                                color === 'emerald' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                color === 'purple' && "bg-purple-50 text-purple-700 border-purple-100",
                                                color === 'amber' && "bg-amber-50 text-amber-700 border-amber-100"
                                            )}>
                                                {doc.type}
                                            </span>
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    {doc.date}
                                                </span>
                                                <span>{doc.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                            <Eye size={18} />
                                        </button>
                                        <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {documents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                <FileText size={32} />
                            </div>
                            <p className="text-lg font-black text-slate-900 mb-2">No documents yet</p>
                            <p className="text-sm text-slate-500 font-medium">Documents will appear here as you process shipments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
