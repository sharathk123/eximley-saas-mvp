"use client";

import React, { useState, useRef } from 'react';
import { ImportShipment, QuoteData } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, CheckCircle, AlertTriangle, ScanLine, BrainCircuit, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '@/context/WorkflowContext';

interface ImportQuoteReceivedViewProps {
    shipment: ImportShipment;
    onAction: (shipmentId: string, newState: any, action: string) => void;
}

export function ImportQuoteReceivedView({ shipment, onAction }: ImportQuoteReceivedViewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<QuoteData['extractedData'] | null>(null);
    const [aiConfidence, setAiConfidence] = useState<number>(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtractedData(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtractedData(null);
        }
    };

    const simulateAIAnalysis = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        // Simulate network delay for AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock Extracted Data
        const mockData = {
            price: '34,500',
            currency: 'USD',
            deliveryTerms: 'CIF Hamburg',
            validUntil: '2025-06-30',
            leadTime: '4 Weeks'
        };

        setExtractedData(mockData);
        setAiConfidence(0.94);
        setIsAnalyzing(false);
    };

    const handleAcceptQuote = () => {
        onAction(shipment.id, 'IMPORT_QUOTE_ACCEPTED', `Accepted Quote: ${extractedData?.currency} ${extractedData?.price}`);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {!file ? (
                // Upload Area
                <div
                    className="flex-1 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-10 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                    />
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-6">
                        <Upload className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Upload Supplier Quotation</h3>
                    <p className="text-slate-500 mt-2 text-center max-w-sm">
                        Drag & drop your file here, or click to browse.
                        <br />
                        <span className="text-xs text-slate-400 mt-1 block">Supports PDF, JPEG, PNG</span>
                    </p>
                </div>
            ) : (
                // Preview & Analysis Area
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Left: Preview */}
                    <div className="flex-1 bg-slate-900 rounded-3xl p-4 flex flex-col relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-white">
                                <FileText size={16} className="text-blue-400" />
                                <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                onClick={() => { setFile(null); setPreviewUrl(null); setExtractedData(null); }}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                                <img src={previewUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <iframe src={previewUrl!} className="w-full h-full" title="PDF Preview" />
                            )}

                            {/* AI Scan Effect Overlay */}
                            <AnimatePresence>
                                {isAnalyzing && (
                                    <motion.div
                                        initial={{ top: 0 }}
                                        animate={{ top: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: AI Analysis / Data */}
                    <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                        <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <BrainCircuit size={18} className="text-purple-600" />
                                    AI Extraction
                                </h3>
                                {extractedData && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100">
                                        <CheckCircle size={12} /> Confidence: {Math.floor(aiConfidence * 100)}%
                                    </div>
                                )}
                            </div>

                            {!extractedData ? (
                                <div className="text-center py-12 space-y-6">
                                    {isAnalyzing ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-12 w-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                                            <p className="text-sm text-slate-500 animate-pulse">Analyzing document structure...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-200">
                                                <ScanLine size={32} />
                                            </div>
                                            <p className="text-sm text-slate-400 max-w-[200px]">Run AI analysis to automatically extract pricing and terms.</p>
                                            <Button onClick={simulateAIAnalysis} className="bg-purple-600 hover:bg-purple-700 w-full mb-10">
                                                <BrainCircuit size={16} className="mr-2" />
                                                Analyze Document
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    {/* Extracted Fields Form */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value</label>
                                            <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100 flex items-center justify-between">
                                                {extractedData.price}
                                                <span className="text-xs text-slate-400">{extractedData.currency}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valid Until</label>
                                            <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                                                {extractedData.validUntil}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incoterms</label>
                                            <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                                                {extractedData.deliveryTerms}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Time</label>
                                            <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                                                {extractedData.leadTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button
                                            onClick={handleAcceptQuote}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-bold"
                                        >
                                            Accept Quote
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-slate-200 text-slate-600 h-12 rounded-xl font-bold hover:bg-slate-50"
                                            onClick={() => { setExtractedData(null); }}
                                        >
                                            Re-Scan
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
