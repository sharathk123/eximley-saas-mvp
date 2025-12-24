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
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Eximley Admin</h1>
                        <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                            Enterprise Management Cluster
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-[2rem] border border-slate-100 w-fit backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={cn(
                            "h-12 px-6 rounded-[1.5rem] flex items-center gap-3 transition-all duration-300 group whitespace-nowrap relative",
                            activeTab !== 'users' && "text-slate-400 hover:text-slate-600 hover:bg-slate-100/30"
                        )}
                    >
                        {activeTab === 'users' && (
                            <motion.div
                                layoutId="active-pill-admin"
                                className="absolute inset-0 bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            <div className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300",
                                activeTab === 'users' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            )}>
                                <Users size={14} />
                            </div>
                            <span className={cn(
                                "font-black text-[10px] uppercase tracking-widest transition-colors",
                                activeTab === 'users' ? "text-indigo-900" : "text-slate-400 group-hover:text-slate-600"
                            )}>User Approvals</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={cn(
                            "h-12 px-6 rounded-[1.5rem] flex items-center gap-3 transition-all duration-300 group whitespace-nowrap relative",
                            activeTab !== 'products' && "text-slate-400 hover:text-slate-600 hover:bg-slate-100/30"
                        )}
                    >
                        {activeTab === 'products' && (
                            <motion.div
                                layoutId="active-pill-admin"
                                className="absolute inset-0 bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            <div className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300",
                                activeTab === 'products' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            )}>
                                <Package size={14} />
                            </div>
                            <span className={cn(
                                "font-black text-[10px] uppercase tracking-widest transition-colors",
                                activeTab === 'products' ? "text-indigo-900" : "text-slate-400 group-hover:text-slate-600"
                            )}>Product Catalog</span>
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'users' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
                                                stat.color === 'amber' && "bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30",
                                                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30"
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

                        {/* Pending Users Table */}
                        <div className="card-sleek">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 mb-1">Pending Approvals</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review and verify new node requests</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn-sleek-secondary h-10 px-4">
                                        <Search size={14} />
                                        Search
                                    </button>
                                    <button className="btn-sleek-secondary h-10 px-4">
                                        <Filter size={14} />
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
                                            "bg-white border rounded-xl p-5 transition-all hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5",
                                            user.status === 'PENDING' && "border-slate-100",
                                            user.status === 'APPROVED' && "border-emerald-100 bg-emerald-50/10",
                                            user.status === 'DECLINED' && "border-red-100 bg-red-50/10 opacity-60"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="icon-box-sleek h-12 w-12 bg-slate-100 text-slate-400">
                                                    <Users size={20} />
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
                                                            className="btn-sleek-primary h-10 px-5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                                                        >
                                                            <CheckCircle2 size={16} className="mr-2" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDecline(user.id)}
                                                            variant="outline"
                                                            className="btn-sleek-secondary h-10 px-5 border hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                                                        >
                                                            <XCircle size={16} className="mr-2" />
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                                {user.status === 'APPROVED' && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-lg">
                                                        <CheckCircle2 size={14} className="text-emerald-600" />
                                                        <span className="text-[10px] font-black uppercase text-emerald-700">Approved</span>
                                                    </div>
                                                )}
                                                {user.status === 'DECLINED' && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-200 rounded-lg">
                                                        <XCircle size={14} className="text-red-600" />
                                                        <span className="text-[10px] font-black uppercase text-red-700">Declined</span>
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
