"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerationHUDProps {
    title: string;
    description: string;
    onComplete: () => void;
    duration?: number;
}

export function AIGenerationHUD({ title, description, onComplete, duration = 3000 }: AIGenerationHUDProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = duration / 100;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [duration, onComplete]);

    return (
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-slate-800 animate-in fade-in zoom-in-95 duration-500">
            {/* Background Sparkle Effect */}
            <div className="absolute top-0 right-0 p-8 opacity-20 animate-pulse">
                <Sparkles size={120} className="text-indigo-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <Sparkles size={20} className="text-indigo-400 animate-bounce" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">AI Engine Processing</p>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">
                    {description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Analysis & Drafting</span>
                        <span className="text-lg font-mono font-bold text-indigo-400">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-750">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-slate-500">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] font-medium tracking-wide">Syncing with ICEGATE & Customs Database...</span>
                </div>
            </div>
        </div>
    );
}
