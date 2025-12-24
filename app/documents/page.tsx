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
            case 'Invoice': return 'blue';
            case 'Packing List': return 'emerald';
            case 'Shipping Bill': return 'purple';
            case 'BL': return 'amber';
            default: return 'slate';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Documents</h1>
                <p className="text-slate-500 mt-2">All your export documentation in one place</p>
            </div>

            {/* Documents Grid */}
            <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
                <div className="space-y-3">
                    {documents.map((doc, idx) => {
                        const color = getDocTypeColor(doc.type);
                        return (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all"
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                    color === 'blue' && "bg-blue-50 text-blue-600",
                                    color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                    color === 'purple' && "bg-purple-50 text-purple-600",
                                    color === 'amber' && "bg-amber-50 text-amber-600",
                                    color === 'slate' && "bg-slate-100 text-slate-600"
                                )}>
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">{doc.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-md",
                                            color === 'blue' && "bg-blue-50 text-blue-700",
                                            color === 'emerald' && "bg-emerald-50 text-emerald-700",
                                            color === 'purple' && "bg-purple-50 text-purple-700",
                                            color === 'amber' && "bg-amber-50 text-amber-700"
                                        )}>
                                            {doc.type}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                            <Calendar size={12} />
                                            {doc.date}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">{doc.size}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <Eye size={16} />
                                    </button>
                                    <button className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                        <Download size={16} />
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
    );
}
