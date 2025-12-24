"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    UserPlus,
    Building2,
    Users,
    Ship,
    Globe,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    CheckCircle2,
    Stamp,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PartnerType, Partner } from '@/lib/types/partner';
import { addPartner } from '@/lib/services/partnerService';

interface PartnerOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (partner: Partner) => void;
}

export function PartnerOnboardingModal({ isOpen, onClose, onSuccess }: PartnerOnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState<PartnerType>('BUYER');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        // Metadata fields
        industry: '',
        taxId: '',
        products: '', // Comma separated string for input
        licenseNumber: '',
        experienceYears: '',
        authorizedPorts: '' // Comma separated string
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const userStr = localStorage.getItem('currentUser');
        const currentUser = userStr ? JSON.parse(userStr) : null;

        const partnerData: any = {
            name: formData.name,
            type,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            address: formData.address,
            companyId: currentUser?.companyId || 'company-1',
            metadata: {}
        };

        if (type === 'BUYER') {
            partnerData.metadata = { industry: formData.industry, taxId: formData.taxId };
        } else if (type === 'SUPPLIER') {
            partnerData.metadata = {
                products: formData.products.split(',').map(p => p.trim()),
                complianceStatus: 'PENDING'
            };
        } else if (type === 'CHA_AGENT') {
            partnerData.metadata = {
                licenseNumber: formData.licenseNumber,
                experienceYears: parseInt(formData.experienceYears) || 0,
                authorizedPorts: formData.authorizedPorts.split(',').map(p => p.trim())
            };
        }

        const newPartner = addPartner(partnerData);
        setIsSubmitting(false);
        setStep(3); // Success step

        setTimeout(() => {
            if (onSuccess) onSuccess(newPartner);
            handleClose();
        }, 2000);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            setFormData({
                name: '', email: '', phone: '', country: '', address: '',
                industry: '', taxId: '', products: '', licenseNumber: '',
                experienceYears: '', authorizedPorts: ''
            });
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/20">
                    <div>
                        <h2 className="text-2xl font-black text-indigo-950 tracking-tight">Onboard Partner</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Expand your global trade network</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="h-10 w-10 rounded-full hover:bg-white hover:shadow-lg transition-all flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <TypeCard
                                        type="BUYER"
                                        current={type}
                                        onClick={() => setType('BUYER')}
                                        icon={Users}
                                        label="Buyer"
                                        desc="Importers & Clients"
                                    />
                                    <TypeCard
                                        type="SUPPLIER"
                                        current={type}
                                        onClick={() => setType('SUPPLIER')}
                                        icon={Package}
                                        label="Supplier"
                                        desc="Manufacturers & Vendors"
                                    />
                                    <TypeCard
                                        type="CHA_AGENT"
                                        current={type}
                                        onClick={() => setType('CHA_AGENT')}
                                        icon={Stamp}
                                        label="CHA Agent"
                                        desc="Custom House Agents"
                                    />
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="Contact Name"
                                            value={formData.name}
                                            onChange={(v) => setFormData({ ...formData, name: v })}
                                            placeholder="e.g. John Export"
                                        />
                                        <InputField
                                            label="Official Email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(v) => setFormData({ ...formData, email: v })}
                                            placeholder="john@partner.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="Operating Country"
                                            value={formData.country}
                                            onChange={(v) => setFormData({ ...formData, country: v })}
                                            placeholder="e.g. United States"
                                        />
                                        <InputField
                                            label="Phone (Optional)"
                                            value={formData.phone}
                                            onChange={(v) => setFormData({ ...formData, phone: v })}
                                            placeholder="+1 (xxx) xxx-xxxx"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        onClick={() => setStep(2)}
                                        className="btn-sleek-lg btn-sleek-primary gap-2"
                                        disabled={!formData.name || !formData.email || !formData.country}
                                    >
                                        Next Step
                                        <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-slate-50 p-6 rounded-3xl">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                                        Professional Details ({type.replace('_', ' ')})
                                    </p>

                                    <div className="grid grid-cols-2 gap-6">
                                        {type === 'BUYER' && (
                                            <>
                                                <InputField
                                                    label="Industry Verticial"
                                                    value={formData.industry}
                                                    onChange={(v) => setFormData({ ...formData, industry: v })}
                                                    placeholder="e.g. Textiles, Aerospace"
                                                />
                                                <InputField
                                                    label="Tax ID / Registration"
                                                    value={formData.taxId}
                                                    onChange={(v) => setFormData({ ...formData, taxId: v })}
                                                    placeholder="EIN or VAT Number"
                                                />
                                            </>
                                        )}
                                        {type === 'SUPPLIER' && (
                                            <div className="col-span-2">
                                                <InputField
                                                    label="Product Portfolio"
                                                    value={formData.products}
                                                    onChange={(v) => setFormData({ ...formData, products: v })}
                                                    placeholder="e.g. Cotton Yarn, Silk, Tools (Comma separated)"
                                                />
                                            </div>
                                        )}
                                        {type === 'CHA_AGENT' && (
                                            <>
                                                <InputField
                                                    label="License Number"
                                                    value={formData.licenseNumber}
                                                    onChange={(v) => setFormData({ ...formData, licenseNumber: v })}
                                                    placeholder="CHA/2024/..."
                                                />
                                                <InputField
                                                    label="Experience (Years)"
                                                    type="number"
                                                    value={formData.experienceYears}
                                                    onChange={(v) => setFormData({ ...formData, experienceYears: v })}
                                                    placeholder="10"
                                                />
                                                <div className="col-span-2">
                                                    <InputField
                                                        label="Authorized Ports"
                                                        value={formData.authorizedPorts}
                                                        onChange={(v) => setFormData({ ...formData, authorizedPorts: v })}
                                                        placeholder="Nhava Sheva, Mundra, etc."
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6">
                                    <Button
                                        onClick={() => setStep(1)}
                                        className="btn-sleek-secondary h-14 px-8"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="btn-sleek-lg btn-sleek-primary gap-2 min-w-[200px]"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Sync Partner
                                                <CheckCircle2 size={18} />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-center"
                            >
                                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-indigo-950 tracking-tight mb-2 uppercase">Partner Onboarded!</h3>
                                <p className="text-slate-500 font-bold max-w-xs uppercase text-xs tracking-widest">
                                    {formData.name} has been successfully integrated into your trade network.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function TypeCard({ type, current, onClick, icon: Icon, label, desc }: {
    type: PartnerType;
    current: PartnerType;
    onClick: () => void;
    icon: any;
    label: string;
    desc: string;
}) {
    const isActive = type === current;
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-5 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
                isActive
                    ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-500/20 text-white"
                    : "bg-white border-slate-100 hover:border-indigo-200 text-slate-800"
            )}
        >
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                isActive ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400 group-hover:text-slate-600"
            )}>
                <Icon size={20} />
            </div>
            <p className="font-black text-sm uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className={cn(
                "text-[10px] font-bold",
                isActive ? "text-slate-400" : "text-slate-400"
            )}>{desc}</p>
        </button>
    );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-sleek w-full"
                placeholder={placeholder}
            />
        </div>
    );
}
