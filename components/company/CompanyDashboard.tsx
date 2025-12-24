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
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User, Company } from '@/lib/types/user';
import { getCompanyById, getCompanyUsers } from '@/lib/services/userService';
import { useWorkflow } from '@/context/WorkflowContext';
import { CreateEnquiryForm } from '@/components/workflow/CreateEnquiryForm';
import Link from 'next/link';

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
        <div className="min-h-screen bg-slate-50 p-8">
            {showCreateForm && (
                <CreateEnquiryForm onClose={() => setShowCreateForm(false)} />
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-indigo-900">{company.name}</h1>
                                <p className="text-slate-500 font-medium mt-1">
                                    {currentUser.role.replace(/_/g, ' ')} • {company.country}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black uppercase tracking-widest text-slate-400">Welcome back,</p>
                            <p className="text-lg font-black text-indigo-900">{currentUser.name}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 rounded-[2rem] shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                                    stat.color === 'blue' && "bg-blue-50 text-blue-600 border border-blue-100",
                                    stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 border border-emerald-100",
                                    stat.color === 'purple' && "bg-purple-50 text-purple-600 border border-purple-100",
                                    stat.color === 'amber' && "bg-amber-50 text-amber-600 border border-amber-100"
                                )}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-8 rounded-[2rem] shadow-2xl mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {quickActions.map((action, idx) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={action.action}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-105",
                                    action.color === 'blue' && "bg-blue-50 border-blue-200 hover:bg-blue-100",
                                    action.color === 'emerald' && "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
                                    action.color === 'purple' && "bg-purple-50 border-purple-200 hover:bg-purple-100",
                                    action.color === 'slate' && "bg-slate-100 border-slate-200 hover:bg-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center",
                                    action.color === 'blue' && "bg-blue-600 text-white",
                                    action.color === 'emerald' && "bg-emerald-600 text-white",
                                    action.color === 'purple' && "bg-purple-600 text-white",
                                    action.color === 'slate' && "bg-slate-600 text-white"
                                )}>
                                    <action.icon size={24} />
                                </div>
                                <p className="text-sm font-black text-slate-900">{action.label}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Recent Shipments */}
                <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-slate-900">Recent Shipments</h2>
                        <Link href="/shipments" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {shipments.slice(0, 5).map((shipment, idx) => (
                            <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Box size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900">{shipment.id}</p>
                                        <p className="text-xs text-slate-500 font-medium">{shipment.destination} • {shipment.goods}</p>
                                    </div>
                                    <div className="text-right">
                                        <StatusPill status={shipment.status} />
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                        {shipments.length === 0 && (
                            <div className="text-center py-12">
                                <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                    <Box size={32} />
                                </div>
                                <p className="text-lg font-black text-slate-900 mb-2">No shipments yet</p>
                                <p className="text-sm text-slate-500 font-medium mb-6">Create your first enquiry to get started</p>
                                <Button
                                    onClick={() => setShowCreateForm(true)}
                                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20"
                                >
                                    <Plus size={18} className="mr-2" />
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

function StatusPill({ status }: { status: string }) {
    const formatStatus = (s: string) => s.replace(/_/g, ' ');

    let colorClass = "bg-slate-100 text-slate-600 border-slate-200";

    if (status.includes('APPROVED') || status.includes('FILED') || status.includes('GRANTED')) {
        colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (status.includes('PENDING') || status.includes('DRAFT')) {
        colorClass = "bg-amber-50 text-amber-700 border-amber-200";
    } else if (status.includes('QUERY')) {
        colorClass = "bg-red-50 text-red-700 border-red-200";
    } else if (status.includes('CLOSED')) {
        colorClass = "bg-slate-100 text-slate-500 border-slate-200";
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
            {formatStatus(status)}
        </span>
    );
}
