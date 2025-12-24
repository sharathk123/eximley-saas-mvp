"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
                <div className="glass-panel p-8 rounded-[2rem] shadow-2xl max-w-md text-center">
                    <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
                    <p className="text-slate-600 font-medium mb-6">
                        Only Company Admins can access company settings.
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900">Company Settings</h1>
                                <p className="text-slate-500 font-medium mt-1">{companyDetails.name}</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "h-14 px-8 rounded-2xl font-black text-lg shadow-xl transition-all",
                                saveSuccess
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/30"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : saveSuccess ? (
                                <>
                                    <CheckCircle2 size={20} className="mr-2" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save size={20} className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Company Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-[2rem] shadow-xl mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Building2 size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Company Profile</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={companyDetails.name}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Industry
                            </label>
                            <input
                                type="text"
                                value={companyDetails.industry || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="e.g., Textiles, Electronics"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Country
                            </label>
                            <input
                                type="text"
                                value={companyDetails.country}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, country: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={companyDetails.phone || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={companyDetails.email || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="info@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Website
                            </label>
                            <input
                                type="url"
                                value={companyDetails.website || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="www.company.com"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Address
                            </label>
                            <textarea
                                value={companyDetails.address || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                                placeholder="Full company address..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Export Licenses & Compliance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 rounded-[2rem] shadow-xl mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Export Licenses & Compliance</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                IEC Number
                            </label>
                            <input
                                type="text"
                                value={companyDetails.iecNumber || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, iecNumber: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="10-digit IEC"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">Importer Exporter Code</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                RCMC Number
                            </label>
                            <input
                                type="text"
                                value={companyDetails.rcmcNumber || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, rcmcNumber: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="RCMC/YYYY/XXXXXX"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">Registration cum Membership Certificate</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                GST Number
                            </label>
                            <input
                                type="text"
                                value={companyDetails.gstNumber || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, gstNumber: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="15-digit GSTIN"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">Goods and Services Tax Identification Number</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                PAN Number
                            </label>
                            <input
                                type="text"
                                value={companyDetails.panNumber || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, panNumber: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="10-character PAN"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">Permanent Account Number</p>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                AD Code
                            </label>
                            <input
                                type="text"
                                value={companyDetails.adCode || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, adCode: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="Authorized Dealer Code"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">Issued by your bank for export transactions</p>
                        </div>
                    </div>
                </motion.div>

                {/* Bank Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 rounded-[2rem] shadow-xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <CreditCard size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Bank Details</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                value={companyDetails.bankName || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, bankName: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="e.g., HDFC Bank"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={companyDetails.accountNumber || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, accountNumber: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="Account number"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                value={companyDetails.ifscCode || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, ifscCode: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="11-character IFSC"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">For domestic transactions</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                SWIFT Code
                            </label>
                            <input
                                type="text"
                                value={companyDetails.swiftCode || ''}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, swiftCode: e.target.value })}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="8 or 11 characters"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1">For international transactions</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
