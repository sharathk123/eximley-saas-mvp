"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    XCircle,
    Mail,
    Building2,
    Globe,
    Shield,
    TrendingUp,
    Clock,
    Search,
    Filter,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductCatalog } from './ProductCatalog';

interface PendingUser {
    id: string;
    email: string;
    companyName: string;
    country: string;
    submittedAt: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
}

type AdminTab = 'users' | 'products';

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
        {
            id: '1',
            email: 'rajesh@globaltrade.in',
            companyName: 'Global Trade Inc.',
            country: 'India',
            submittedAt: '2 hours ago',
            status: 'PENDING'
        },
        {
            id: '2',
            email: 'priya@exportpro.com',
            companyName: 'ExportPro Solutions',
            country: 'India',
            submittedAt: '5 hours ago',
            status: 'PENDING'
        },
        {
            id: '3',
            email: 'amit@shipcargo.in',
            companyName: 'ShipCargo Logistics',
            country: 'India',
            submittedAt: '1 day ago',
            status: 'PENDING'
        }
    ]);

    const handleApprove = (userId: string) => {
        setPendingUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, status: 'APPROVED' } : user
        ));
    };

    const handleDecline = (userId: string) => {
        setPendingUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, status: 'DECLINED' } : user
        ));
    };

    const stats = [
        { label: 'Total Users', value: '247', icon: Users, color: 'blue' },
        { label: 'Pending Approvals', value: pendingUsers.filter(u => u.status === 'PENDING').length.toString(), icon: Clock, color: 'amber' },
        { label: 'Monthly Growth', value: '+23%', icon: TrendingUp, color: 'emerald' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">Eximley Admin</h1>
                            <p className="text-slate-500 font-medium">Enterprise Management Dashboard</p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn(
                                "h-14 px-8 rounded-2xl font-black text-sm transition-all flex items-center gap-2",
                                activeTab === 'users'
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Users size={18} />
                            User Approvals
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={cn(
                                "h-14 px-8 rounded-2xl font-black text-sm transition-all flex items-center gap-2",
                                activeTab === 'products'
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Package size={18} />
                            Product Catalog
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'users' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-10">
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
                                            stat.color === 'amber' && "bg-amber-50 text-amber-600 border border-amber-100",
                                            stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        )}>
                                            <stat.icon size={24} />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pending Users Table */}
                        <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-1">Pending Approvals</h2>
                                    <p className="text-sm text-slate-500 font-medium">Review and approve new user applications</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="h-12 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                                        <Search size={16} />
                                        Search
                                    </button>
                                    <button className="h-12 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                                        <Filter size={16} />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {pendingUsers.map((user, idx) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "bg-white border rounded-2xl p-6 transition-all",
                                            user.status === 'PENDING' && "border-slate-200",
                                            user.status === 'APPROVED' && "border-emerald-200 bg-emerald-50/50",
                                            user.status === 'DECLINED' && "border-red-200 bg-red-50/50 opacity-50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <Users size={24} />
                                                </div>
                                                <div className="flex-1 grid grid-cols-3 gap-6">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-slate-400" />
                                                            <p className="text-sm font-bold text-slate-900">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Company</p>
                                                        <div className="flex items-center gap-2">
                                                            <Building2 size={14} className="text-slate-400" />
                                                            <p className="text-sm font-bold text-slate-900">{user.companyName}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Country</p>
                                                        <div className="flex items-center gap-2">
                                                            <Globe size={14} className="text-slate-400" />
                                                            <p className="text-sm font-bold text-slate-900">{user.country}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 font-bold">{user.submittedAt}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 ml-6">
                                                {user.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            onClick={() => handleApprove(user.id)}
                                                            className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20"
                                                        >
                                                            <CheckCircle2 size={16} className="mr-2" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDecline(user.id)}
                                                            variant="outline"
                                                            className="h-12 px-6 border-2 border-slate-200 rounded-2xl font-black text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                                                        >
                                                            <XCircle size={16} className="mr-2" />
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                                {user.status === 'APPROVED' && (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-xl">
                                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                                        <span className="text-xs font-black uppercase text-emerald-700">Approved</span>
                                                    </div>
                                                )}
                                                {user.status === 'DECLINED' && (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-xl">
                                                        <XCircle size={16} className="text-red-600" />
                                                        <span className="text-xs font-black uppercase text-red-700">Declined</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <ProductCatalog />
                )}
            </div>
        </div>
    );
}
