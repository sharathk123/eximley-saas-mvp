"use client";

import React, { useState } from 'react';
import { ImportShipment } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, CreditCard, Upload, CheckCircle, ArrowRight, Lock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartDocumentUpload } from '../../SmartDocumentUpload';

interface ImportPaymentViewProps {
    shipment: ImportShipment;
    onAction: (id: string, state: string, label: string) => void;
}

export function ImportPaymentView({ shipment, onAction }: ImportPaymentViewProps) {
    const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'CONFIRM'>('DETAILS');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const handleInitiatePayment = () => {
        setStep('PROCESSING');
        setTimeout(() => setStep('CONFIRM'), 2000);
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Outward Remittance</h3>
                    <p className="text-sm text-slate-500 font-medium">Initiate payment to {shipment.supplier}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <DollarSign size={24} />
                </div>
            </div>

            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {step === 'DETAILS' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CreditCard size={100} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Payable Amount</p>
                                    <h2 className="text-4xl font-black tracking-tight mb-6">{shipment.value}</h2>

                                    <div className="space-y-4 border-t border-slate-700 pt-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Building2 size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-300">Beneficiary</p>
                                                    <p className="text-sm font-bold">{shipment.supplier}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Lock size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-300">Bank Account</p>
                                                    <p className="text-sm font-mono tracking-wider">**** **** 8829</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200"
                                onClick={handleInitiatePayment}
                            >
                                Initiate SWIFT Transfer <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 'PROCESSING' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="h-24 w-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Processing Payment</h3>
                                <p className="text-slate-500 text-sm">Communicating with Banking Gateway...</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'CONFIRM' && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center py-6">
                                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Payment Initiated</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Bank ref: <span className="font-mono font-bold text-slate-700">SWIFT-99283-XJ</span></p>
                            </div>

                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                                {paymentProof ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="text-sm font-bold text-slate-800">SWIFT Proof Verified</p>
                                            <p className="text-[10px] text-slate-400">AI Extracted Details Matched</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => setPaymentProof(null)}>Remove</Button>
                                    </div>
                                ) : (
                                    <div className="h-[450px]">
                                        <SmartDocumentUpload
                                            title="Upload SWIFT Copy"
                                            documentType="SWIFT"
                                            onExtractionComplete={(data, file) => {
                                                console.log("Extracted SWIFT Data:", data);
                                                setPaymentProof(file);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-200"
                                onClick={() => onAction(shipment.id, 'IMPORT_PAYMENT_SENT', 'Payment Completed')}
                            >
                                Confirm & Notify Supplier
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
