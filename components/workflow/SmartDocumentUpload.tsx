"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, CheckCircle, ScanLine, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExtractedData {
    [key: string]: string | number;
}

interface SmartDocumentUploadProps {
    title?: string;
    documentType: 'INVOICE' | 'SWIFT' | 'BOE' | 'QUOTATION' | 'GENERIC';
    onExtractionComplete: (data: ExtractedData, file: File) => void;
    onCancel?: () => void;
    acceptedFileTypes?: string;
}

export function SmartDocumentUpload({
    title = "Upload Document",
    documentType,
    onExtractionComplete,
    onCancel,
    acceptedFileTypes = "image/*,application/pdf"
}: SmartDocumentUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extracted, setExtracted] = useState<ExtractedData | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtracted(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtracted(null);
        }
    };

    const simulateAIAnalysis = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock Data based on document type
        let mockData: ExtractedData = {};

        switch (documentType) {
            case 'SWIFT':
                mockData = {
                    'Amount': 'USD 28,000.00',
                    'Beneficiary': 'Al Fahim Trading',
                    'Value Date': '2025-12-25',
                    'Ref No': 'SWIFT-99283-XJ'
                };
                break;
            case 'BOE':
                mockData = {
                    'BOE No': 'BOE/24-25/009182',
                    'Date': '2025-12-26',
                    'Assessed Duty': '₹ 4,25,000',
                    'Customs Status': 'Payment Pending'
                };
                break;
            case 'QUOTATION':
                mockData = {
                    'Total Value': '34,500 USD',
                    'Valid Until': '2025-06-30',
                    'Incoterms': 'CIF Hamburg',
                    'Lead Time': '4 Weeks'
                };
                break;
            default:
                mockData = {
                    'Status': 'Analyzed',
                    'Confidence': '98%'
                };
        }

        setExtracted(mockData);
        setIsAnalyzing(false);
        onExtractionComplete(mockData, file);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {!file ? (
                <div
                    className="flex-1 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept={acceptedFileTypes}
                        onChange={handleFileSelect}
                    />
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-4">
                        <Upload className="text-blue-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 mt-1 text-sm text-center">Drag & drop or click to browse</p>
                </div>
            ) : (
                <div className="flex-1 flex gap-4 overflow-hidden h-[400px]">
                    {/* Left: Preview */}
                    <div className="flex-1 bg-slate-900 rounded-2xl p-3 flex flex-col relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-white">
                                <FileText size={14} className="text-blue-400" />
                                <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                onClick={() => { setFile(null); setPreviewUrl(null); setExtracted(null); onCancel?.(); }}
                            >
                                <X size={14} />
                            </Button>
                        </div>
                        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                                <img src={previewUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <iframe src={previewUrl!} className="w-full h-full" title="PDF Preview" />
                            )}
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

                    {/* Right: Analysis */}
                    <div className="flex-1 flex flex-col bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <BrainCircuit size={16} className="text-purple-600" />
                                AI Analysis
                            </h3>
                            {extracted && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wide border border-emerald-100">
                                    <CheckCircle size={10} /> Confident
                                </div>
                            )}
                        </div>

                        {!extracted ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                {isAnalyzing ? (
                                    <>
                                        <div className="h-10 w-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                                        <p className="text-xs text-slate-500 animate-pulse">Extracting data...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-200">
                                            <ScanLine size={24} />
                                        </div>
                                        <Button onClick={simulateAIAnalysis} className="bg-purple-600 hover:bg-purple-700 w-full">
                                            <BrainCircuit size={14} className="mr-2" />
                                            Analyze
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {Object.entries(extracted).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</label>
                                        <div className="p-2 bg-slate-50 rounded-lg font-bold text-slate-800 border border-slate-100 text-sm">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 text-[10px] text-slate-400 text-center italic">
                                    Data extracted by generic model v2.1
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
