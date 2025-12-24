"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Printer, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface PDFViewerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url?: string;
    children?: React.ReactNode;
}

export function PDFViewer({ isOpen, onClose, title, url, children }: PDFViewerProps) {

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const content = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 ring-1 ring-white/10 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700 text-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 font-bold text-xs">PDF</div>
                        <div>
                            <h3 className="font-semibold text-sm leading-tight">{title}</h3>
                            <p className="text-xs text-slate-400">Read-only preview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                            <Printer size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                            <Download size={16} />
                        </Button>
                        {url && (
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => window.open(url, '_blank')}>
                                <ExternalLink size={16} />
                            </Button>
                        )}
                        <div className="w-px h-6 bg-slate-800 mx-1" />
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-red-900/20 hover:text-red-400 rounded-full" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-800 relative overflow-auto flex justify-center p-8">
                    {url ? (
                        <iframe
                            src={url}
                            className="w-full h-full border-none bg-white rounded-lg shadow-lg"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] text-slate-900 origin-top">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Use Portal to render at root level (avoid z-index issues)
    return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
