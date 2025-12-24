"use client";

import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { AIAuditModal } from './AIAuditModal';
import { Shipment } from '@/lib/workflow';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AIStatusPillProps {
    shipment: Shipment;
}

export function AIStatusPill({ shipment }: AIStatusPillProps) {
    const [showModal, setShowModal] = useState(false);
    // Mock state: logic could be expanded to persist audit status
    const [isAudited, setIsAudited] = useState(false);

    const handleAuditComplete = () => {
        setIsAudited(true);
        setShowModal(false);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className={cn(
                    "relative group px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 overflow-hidden transition-all",
                    isAudited
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                )}
            >
                {/* Animated Gradient Border for "Needs Audit" state */}
                {!isAudited && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                )}

                {isAudited ? (
                    <>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        AI Verified
                    </>
                ) : (
                    <>
                        <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                        AI Audit Ready
                    </>
                )}
            </motion.button>

            {showModal && (
                <AIAuditModal
                    shipment={shipment}
                    onClose={handleAuditComplete}
                />
            )}
        </>
    );
}
