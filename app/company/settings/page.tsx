"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    FileText,
    CreditCard,
    Globe,
    Save,
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Company, User } from '@/lib/types/user';
import { getCompanyById } from '@/lib/services/userService';
import { useRouter } from 'next/navigation';
import { LUTManagement } from '@/components/settings/LUTManagement';


interface CompanyDetails extends Company {
    iecNumber?: string;
    rcmcNumber?: string;
    gstNumber?: string;
    panNumber?: string;
    adCode?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    swiftCode?: string;
    phone?: string;
    email?: string;
    website?: string;
}

export default function CompanySettingsPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'compliance' | 'banking'>('general');

    useEffect(() => {
        // Load current user
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr) as User;
            setCurrentUser(user);

            // Load company data
            const company = getCompanyById(user.companyId);
            if (company) {
                setCompanyDetails({
                    ...company,
                    // Mock export license data
                    iecNumber: '0123456789',
                    rcmcNumber: 'RCMC/2024/001234',
                    gstNumber: '27AABCU9603R1ZM',
                    panNumber: 'AABCU9603R',
                    adCode: 'AD1234567',
                    bankName: 'HDFC Bank',
                    accountNumber: '50200012345678',
                    ifscCode: 'HDFC0001234',
                    swiftCode: 'HDFCINBB',
                    phone: '+91 98765 43210',
                    email: 'info@' + company.name.toLowerCase().replace(/\s+/g, '') + '.com',
                    website: 'www.' + company.name.toLowerCase().replace(/\s+/g, '') + '.com'
                });
            }
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    if (!currentUser || !companyDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is Company Admin
    if (currentUser.role !== 'COMPANY_ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="card-sleek max-w-md text-center">
                    <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
                    <p className="text-slate-600 font-medium mb-6">
                        Only Company Admins can access company settings.
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="btn-sleek-primary w-full"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'compliance', label: 'Compliance', icon: FileText },
        { id: 'banking', label: 'Banking', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                {/* Header & Tabs Container */}
                <div className="flex flex-col gap-8 mb-10">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Account Control</h1>
                                <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                    {companyDetails.name} • Master Config
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "btn-sleek-lg min-w-[200px]",
                                saveSuccess
                                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 shadow-inner"
                                    : "btn-sleek-primary shadow-xl shadow-indigo-500/20"
                            )}
                        >
                            {isSaving ? (
                                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                            ) : saveSuccess ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={24} />
                                    <span>Sync Complete</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save size={24} strokeWidth={2.5} />
                                    <span>Sync Changes</span>
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Horizontal Tab List */}
                    <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-[2rem] border border-slate-100 w-fit backdrop-blur-sm self-start">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "h-12 px-6 rounded-[1.5rem] flex items-center gap-3 transition-all duration-300 group relative",
                                        !isActive && "text-slate-400 hover:text-slate-600 hover:bg-slate-100/30"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill-settings"
                                            className="absolute inset-0 bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className={cn(
                                            "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300",
                                            isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        )}>
                                            <Icon size={14} />
                                        </div>
                                        <span className={cn(
                                            "font-black text-[11px] uppercase tracking-widest transition-colors",
                                            isActive ? "text-indigo-950" : "text-slate-400 group-hover:text-slate-600"
                                        )}>{tab.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="card-sleek border-none bg-white/70 backdrop-blur-xl"
                        >
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Building2 size={20} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Company Profile</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2 col-span-2">
                                            <Label text="Entity Name" />
                                            <input
                                                type="text"
                                                value={companyDetails.name}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                                                className="input-sleek w-full !h-14 !text-base"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="Industry Domain" />
                                            <input
                                                type="text"
                                                value={companyDetails.industry || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="e.g., Global Textiles"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="Operating Country" />
                                            <input
                                                type="text"
                                                value={companyDetails.country}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, country: e.target.value })}
                                                className="input-sleek w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="Contact Channel" />
                                            <input
                                                type="tel"
                                                value={companyDetails.phone || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="Official Email" />
                                            <input
                                                type="email"
                                                value={companyDetails.email || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="hq@company.com"
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label text="Registered Address" />
                                            <textarea
                                                value={companyDetails.address || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                                                rows={4}
                                                className="input-sleek w-full !h-auto py-4 resize-none"
                                                placeholder="Full corporate headquarters address..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'compliance' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <FileText size={20} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Export Compliance</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label text="IEC Number" hint="Importer Exporter Code" />
                                            <input
                                                type="text"
                                                value={companyDetails.iecNumber || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, iecNumber: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="10-digit code"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="RCMC Number" hint="Registration Certificate" />
                                            <input
                                                type="text"
                                                value={companyDetails.rcmcNumber || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, rcmcNumber: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="RCMC-YYYY-XXXX"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="GSTIN" hint="Tax Identification" />
                                            <input
                                                type="text"
                                                value={companyDetails.gstNumber || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, gstNumber: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="Standard GSTIN format"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="PAN Number" hint="Corporate PAN" />
                                            <input
                                                type="text"
                                                value={companyDetails.panNumber || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, panNumber: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="10-character PAN"
                                            />
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                            <Label text="Bank AD Code" hint="Authorized Dealer Code" />
                                            <input
                                                type="text"
                                                value={companyDetails.adCode || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, adCode: e.target.value })}
                                                className="input-sleek w-full"
                                                placeholder="7-digit AD Code"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200/60 pt-8 mt-8">
                                        <LUTManagement />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'banking' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                            <CreditCard size={20} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Node & Settlement</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label text="Primary Bank" />
                                            <input
                                                type="text"
                                                value={companyDetails.bankName || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, bankName: e.target.value })}
                                                className="input-sleek w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label text="Settlement Account" />
                                            <input
                                                type="text"
                                                value={companyDetails.accountNumber || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, accountNumber: e.target.value })}
                                                className="input-sleek w-full"
                                            />
                                        </div>

                                        <div className="space-y-2 border-l-2 border-indigo-100 pl-6">
                                            <Label text="IFSC Code" hint="Domestic Protocol" />
                                            <input
                                                type="text"
                                                value={companyDetails.ifscCode || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, ifscCode: e.target.value })}
                                                className="input-sleek w-full !border-indigo-100"
                                            />
                                        </div>

                                        <div className="space-y-2 border-l-2 border-violet-100 pl-6">
                                            <Label text="SWIFT Code" hint="Global Network" />
                                            <input
                                                type="text"
                                                value={companyDetails.swiftCode || ''}
                                                onChange={(e) => setCompanyDetails({ ...companyDetails, swiftCode: e.target.value })}
                                                className="input-sleek w-full !border-violet-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Label({ text, hint }: { text: string, hint?: string }) {
    return (
        <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{text}</span>
            {hint && <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{hint}</span>}
        </div>
    );
}
