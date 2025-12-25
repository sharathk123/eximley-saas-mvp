"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Package,
    FileText,
    Plus,
    UserPlus,
    ShoppingCart,
    Settings,
    Box,
    ChevronRight,
    ArrowDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User, Company } from '@/lib/types/user';
import { getCompanyById, getCompanyUsers } from '@/lib/services/userService';
import { useWorkflow } from '@/context/WorkflowContext';
import { CreateEnquiryForm } from '@/components/workflow/CreateEnquiryForm';
import Link from 'next/link';
import { StatusPill } from '@/components/ui/StatusPill';
import { isImportShipment, Shipment, ImportShipment } from '@/lib/workflow';

export function CompanyDashboard() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [companyUsers, setCompanyUsers] = useState<User[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { shipments } = useWorkflow();

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr) as User;
            setCurrentUser(user);

            const companyData = getCompanyById(user.companyId);
            if (companyData) {
                setCompany(companyData);
            }

            const users = getCompanyUsers(user.companyId);
            setCompanyUsers(users);
        }
    }, []);

    if (!currentUser || !company) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Company Users', value: companyUsers.length.toString(), icon: Users, color: 'blue' },
        { label: 'Active Shipments', value: shipments.length.toString(), icon: Box, color: 'emerald' },
        { label: 'Total Orders', value: '48', icon: ShoppingCart, color: 'purple' },
        { label: 'Documents', value: '156', icon: FileText, color: 'amber' },
    ];

    const quickActions = [
        { label: 'Create Enquiry', icon: Plus, color: 'blue', action: () => setShowCreateForm(true) },
        { label: 'Company Events', icon: FileText, color: 'emerald', action: () => window.location.href = '/company/events' },
        { label: 'Add Product', icon: Package, color: 'purple', action: () => window.location.href = '/admin' },
        { label: 'Settings', icon: Settings, color: 'slate', action: () => window.location.href = '/company/settings' },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            {showCreateForm && (
                <CreateEnquiryForm onClose={() => setShowCreateForm(false)} />
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">{company.name}</h1>
                                <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                    {currentUser.role.replace(/_/g, ' ')} • {company.country}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authenticated Entity</p>
                            <p className="text-xl font-black text-indigo-900 uppercase tracking-tight">{currentUser.name}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card-sleek border-slate-100 hover:border-indigo-200 transition-all group relative overflow-hidden"
                        >
                            {/* Inner Bloom Effect */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                        stat.color === 'blue' && "bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30",
                                        stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30",
                                        stat.color === 'purple' && "bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/30",
                                        stat.color === 'amber' && "bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30"
                                    )}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-slate-800 mb-1">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="card-sleek shadow-2xl mb-10 border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">System Controls</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, idx) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={action.action}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:scale-105 active:scale-95 group shadow-sm",
                                    action.color === 'blue' && "bg-indigo-50/50 border-indigo-100 hover:border-indigo-300",
                                    action.color === 'emerald' && "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300",
                                    action.color === 'purple' && "bg-purple-50/50 border-purple-100 hover:border-purple-300",
                                    action.color === 'slate' && "bg-slate-50/50 border-slate-200 hover:border-slate-400"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                                    action.color === 'blue' && "bg-indigo-600 text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30",
                                    action.color === 'emerald' && "bg-emerald-600 text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30",
                                    action.color === 'purple' && "bg-purple-600 text-white group-hover:shadow-lg group-hover:shadow-purple-500/30",
                                    action.color === 'slate' && "bg-slate-600 text-white group-hover:shadow-lg group-hover:shadow-slate-500/30"
                                )}>
                                    <action.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">{action.label}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Recent Shipments */}
                <div className="card-sleek shadow-2xl border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Shipments</h2>
                        <Link href="/shipments" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                            View Network Directory →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {shipments.slice(0, 5).map((shipment, idx) => {
                            const isImport = isImportShipment(shipment);
                            const imp = shipment as ImportShipment;
                            const exp = shipment as Shipment;

                            return (
                                <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                                    >
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                            isImport
                                                ? "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                                                : "bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
                                        )}>
                                            {isImport ? <ArrowDownLeft size={20} /> : <Box size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{shipment.id}</p>
                                                {isImport && <span className="text-[8px] uppercase font-bold tracking-widest bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Import</span>}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <span>{isImport ? imp.origin : exp.destination}</span>
                                                <span>•</span>
                                                <span className="line-clamp-1">{shipment.goods}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <StatusPill status={shipment.status} />
                                        </div>
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                        {shipments.length === 0 && (
                            <div className="text-center py-12">
                                <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                    <Box size={32} />
                                </div>
                                <p className="text-lg font-black text-slate-900 mb-2">No shipments yet</p>
                                <p className="text-sm text-slate-500 font-medium mb-6">Create your first enquiry to get started</p>
                                <Button
                                    onClick={() => setShowCreateForm(true)}
                                    className="btn-sleek-primary shadow-indigo-500/20"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Create Enquiry
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

