"use client";

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
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
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    Bell,
    Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductCatalog } from './ProductCatalog';
import { KanbanBoard } from './KanbanBoard';

interface PendingUser {
    id: string;
    email: string;
    companyName: string;
    country: string;
    submittedAt: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
}

type AdminTab = 'users' | 'products' | 'roadmap';

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [isCollapsed, setIsCollapsed] = useState(false);
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
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 glass border-r border-slate-200/60 hidden md:flex flex-col transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="h-20 flex items-center px-4 border-b border-indigo-50/50 bg-indigo-50/5 justify-between">
                    <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
                        <div className="h-10 w-10 min-w-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Shield size={20} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-black text-slate-800 tracking-tighter text-lg leading-none truncate">Eximley Admin</span>
                                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1 truncate">
                                    Enterprise Cluster
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 p-2 space-y-1.5 mt-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={cn(
                            "w-full flex items-center py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative",
                            activeTab === 'users'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:translate-x-1",
                            isCollapsed ? "justify-center px-0" : "px-4"
                        )}
                        title={isCollapsed ? "User Approvals" : undefined}
                    >
                        <span className={cn("transition-colors flex items-center justify-center", activeTab === 'users' ? "text-white" : "text-slate-300 group-hover:text-indigo-600", !isCollapsed && "mr-4")}>
                            <Users size={isCollapsed ? 20 : 18} />
                        </span>
                        {!isCollapsed && <span className="truncate">User Approvals</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('products')}
                        className={cn(
                            "w-full flex items-center py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative",
                            activeTab === 'products'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:translate-x-1",
                            isCollapsed ? "justify-center px-0" : "px-4"
                        )}
                        title={isCollapsed ? "Product Catalog" : undefined}
                    >
                        <span className={cn("transition-colors flex items-center justify-center", activeTab === 'products' ? "text-white" : "text-slate-300 group-hover:text-indigo-600", !isCollapsed && "mr-4")}>
                            <Package size={isCollapsed ? 20 : 18} />
                        </span>
                        {!isCollapsed && <span className="truncate">Product Catalog</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('roadmap')}
                        className={cn(
                            "w-full flex items-center py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative",
                            activeTab === 'roadmap'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:translate-x-1",
                            isCollapsed ? "justify-center px-0" : "px-4"
                        )}
                        title={isCollapsed ? "Product Roadmap" : undefined}
                    >
                        <span className={cn("transition-colors flex items-center justify-center", activeTab === 'roadmap' ? "text-white" : "text-slate-300 group-hover:text-indigo-600", !isCollapsed && "mr-4")}>
                            <Map size={isCollapsed ? 20 : 18} />
                        </span>
                        {!isCollapsed && <span className="truncate">Product Roadmap</span>}
                    </button>
                </nav>

                <div className="p-4 border-t border-indigo-50/50">
                    <Button variant="ghost" className={cn("w-full text-slate-400 hover:text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[9px] rounded-xl", isCollapsed ? "justify-center px-0" : "justify-start")}>
                        <LogOut size={16} className={cn(!isCollapsed && "mr-3")} />
                        {!isCollapsed && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1 relative min-h-screen flex flex-col transition-all duration-300", isCollapsed ? "md:ml-20" : "md:ml-64")}>
                {/* Header */}
                <header className={cn("h-20 fixed top-0 right-0 z-40 glass border-b border-slate-200/60 flex items-center justify-between px-8 transition-all duration-300", isCollapsed ? "left-0 md:left-20" : "left-0 md:left-64")}>
                    <div className="flex items-center gap-4">


                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                        </Button>

                        <div className="hidden md:block">
                            <Breadcrumbs />
                        </div>

                        <h1 className="text-xl font-black text-slate-800 tracking-tight hidden md:block pl-4 border-l border-slate-200 ml-4">
                            {activeTab === 'users' ? 'User Management' : activeTab === 'products' ? 'Product Catalog' : 'Product Roadmap'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)] border-2 border-white"></span>
                        </Button>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20 shadow-lg shadow-slate-500/10 flex items-center justify-center text-xs font-black text-white uppercase tracking-tighter">
                            AD
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="pt-28 px-8 pb-16 flex-1 overflow-auto">
                    {activeTab === 'users' && (
                        <div className="max-w-7xl mx-auto w-full">
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
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="max-w-7xl mx-auto w-full">
                            <ProductCatalog />
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className="max-w-[1600px] mx-auto w-full h-full">
                            <KanbanBoard />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
