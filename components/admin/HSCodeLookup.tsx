"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { suggestITCHSCode } from '@/lib/services/itcHSCodeService';
import { ITCHSCodeSuggestion } from '@/lib/types/product';

interface HSCodeLookupProps {
    productName: string;
    description: string;
    onSelect: (code: string, confidence: number) => void;
    onClose: () => void;
}

export function HSCodeLookup({ productName, description, onSelect, onClose }: HSCodeLookupProps) {
    const [suggestions, setSuggestions] = useState<ITCHSCodeSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setIsLoading(true);
        try {
            const results = await suggestITCHSCode(productName, description);
            setSuggestions(results);
        } catch (error) {
            console.error('Failed to load HS code suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="card-sleek w-full max-w-2xl overflow-hidden p-0"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-indigo-50">
                    <div className="flex items-center gap-4">
                        <div className="icon-box-sleek bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">AI HS Code Suggestions</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                For: <span className="font-black text-slate-700">{productName}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="icon-box-sleek bg-white hover:bg-slate-100 text-slate-600 shadow-sm"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                            <p className="text-lg font-black text-slate-900 mb-2">Analyzing Product...</p>
                            <p className="text-sm text-slate-500 font-medium">AI is finding the best ITC HS Code matches</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <Info size={16} className="text-indigo-600" />
                                <p className="text-xs font-bold text-indigo-700">
                                    Select the most accurate HS code for your product. Higher confidence = better match.
                                </p>
                            </div>

                            {suggestions.map((suggestion, idx) => (
                                <motion.div
                                    key={suggestion.code}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => onSelect(suggestion.code, suggestion.confidence)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <code className="text-xl font-black text-slate-900 bg-slate-100 px-4 py-2 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                                    {suggestion.code}
                                                </code>
                                                {suggestion.confidence >= 90 && (
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                        <CheckCircle2 size={14} className="text-emerald-600" />
                                                        <span className="text-xs font-black uppercase text-emerald-700">High Match</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                                {suggestion.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chapter</p>
                                            <p className="text-sm font-bold text-slate-700">{suggestion.chapter}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heading</p>
                                            <p className="text-sm font-bold text-slate-700">{suggestion.heading}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">GST Rate</p>
                                            <p className="text-sm font-bold text-indigo-700">{suggestion.gstRate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">BCD</p>
                                            <p className="text-sm font-bold text-slate-700">{suggestion.dutyRates.bcd}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={16} className="text-indigo-600" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                                Confidence
                                            </span>
                                            <span className="text-sm font-black text-indigo-700">{suggestion.confidence}%</span>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="btn-sleek-primary h-10 px-6 text-xs shadow-blue-500/20"
                                        >
                                            Use This Code
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}

                            {suggestions.length === 0 && !isLoading && (
                                <div className="text-center py-12">
                                    <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                        <Sparkles size={32} />
                                    </div>
                                    <p className="text-lg font-black text-slate-900 mb-2">No suggestions found</p>
                                    <p className="text-sm text-slate-500 font-medium">Try providing more details about your product</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <p className="text-xs text-slate-500 font-medium text-center">
                        Can't find the right code? You can manually enter the 8-digit ITC HS Code or{' '}
                        <a href="https://cleartax.in/s/gst-hsn-lookup" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">
                            search the official database
                        </a>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
