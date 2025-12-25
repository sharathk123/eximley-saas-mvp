"use client";

import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './button';

interface PDFViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfDataUrl: string;
    title?: string;
}

export function PDFViewerModal({ isOpen, onClose, pdfDataUrl, title = "PDF Preview" }: PDFViewerModalProps) {
    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = `${title.replace(/\s+/g, '_')}.pdf`;
        link.click();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-between px-6 z-10 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                        >
                            <Download size={16} className="mr-2" />
                            Download
                        </Button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="w-full h-full pt-14">
                    <iframe
                        src={pdfDataUrl}
                        className="w-full h-full border-0"
                        title={title}
                    />
                </div>
            </div>
        </div>
    );
}
