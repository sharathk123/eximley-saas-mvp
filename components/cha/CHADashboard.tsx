"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    Stamp,
    Building,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/context/WorkflowContext';
import Link from 'next/link';
import { StatusPill } from '@/components/ui/StatusPill';

export function CHADashboard() {
    const { shipments } = useWorkflow();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter shipments relevant to CHA
    const chaShipments = shipments.filter(s =>
        ['SB_PENDING_CHA', 'SB_FILED', 'CUSTOMS_QUERY', 'LEO_GRANTED'].includes(s.status)
    );

    const stats = [
        { label: 'Pending Filing', value: shipments.filter(s => s.status === 'SB_PENDING_CHA').length.toString(), icon: Clock, color: 'blue' },
        { label: 'Open Queries', value: shipments.filter(s => s.status === 'CUSTOMS_QUERY').length.toString(), icon: AlertCircle, color: 'amber' },
        { label: 'Files Submitted', value: shipments.filter(s => s.status === 'SB_FILED').length.toString(), icon: Activity, color: 'indigo' },
        { label: 'LEO Granted', value: shipments.filter(s => s.status === 'LEO_GRANTED').length.toString(), icon: ShieldCheck, color: 'emerald' },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                            <Stamp size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">CHA Operations</h1>
                            <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                Customs Filing & Compliance Hub
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button className="btn-sleek-secondary h-12 px-6 gap-2 font-black uppercase tracking-widest text-[10px]">
                            <Filter size={16} />
                            Filter by Port
                        </Button>
                        <Button className="btn-sleek-primary h-12 px-6 gap-2 shadow-indigo-500/20">
                            <ArrowUpRight size={16} />
                            Batch File (ICEGATE)
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card-sleek border-t-2 border-t-indigo-500 hover:border-indigo-200 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                    stat.color === 'blue' ? "bg-indigo-50 text-indigo-600" :
                                        stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                            stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                                                "bg-emerald-50 text-emerald-600"
                                )}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800 mb-1">{stat.value}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipment Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-sleek">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    Active Customs Pipeline
                                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold ml-2">
                                        {chaShipments.length} Total
                                    </span>
                                </h2>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search Ref..."
                                            className="input-sleek h-9 pl-9 text-xs w-48"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {chaShipments.map((shipment) => (
                                    <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                                        <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md",
                                                    shipment.status === 'CUSTOMS_QUERY' ? "bg-amber-500 shadow-amber-200" :
                                                        shipment.status === 'SB_FILED' ? "bg-indigo-500 shadow-indigo-200" :
                                                            shipment.status === 'LEO_GRANTED' ? "bg-emerald-500 shadow-emerald-200" :
                                                                "bg-indigo-600 shadow-indigo-200"
                                                )}>
                                                    {shipment.id.split('-')[1]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{shipment.id}</h3>
                                                        <StatusPill status={shipment.status} />
                                                    </div>
                                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                                        <span className="flex items-center gap-1.5"><Building size={12} /> {shipment.buyer}</span>
                                                        <span className="flex items-center gap-1.5 line-clamp-1">{shipment.goods}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900">{shipment.value}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Nhava Sheva Port</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Panel */}
                    <div className="space-y-6">
                        {/* ICEGATE Status */}
                        <div className="card-sleek bg-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4">
                                <Activity className="text-indigo-100 animate-pulse" size={64} strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <ExternalLink size={18} className="text-indigo-500" />
                                ICEGATE Real-time
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <StatusItem
                                    label="Port Connection"
                                    status="ACTIVE"
                                    time="Nhava Sheva Hub"
                                />
                                <StatusItem
                                    label="Server Latency"
                                    status="OPTIMAL"
                                    time="240ms"
                                />
                                <StatusItem
                                    label="Pending Manifests"
                                    status="8"
                                    time="Next batch at 15:00"
                                    color="blue"
                                />
                            </div>

                            <Button className="w-full mt-8 btn-sleek-secondary text-xs h-10">
                                Launch ICEGATE Portal
                            </Button>
                        </div>

                        {/* Urgent Tasks */}
                        <div className="card-sleek">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <AlertCircle size={18} className="text-amber-500" />
                                Urgent Action Required
                            </h3>
                            <div className="space-y-4">
                                <UrgentItem
                                    title="EXP-003: Valuation Query"
                                    desc="Customs requested revised invoice for Handcrafted Silk Scarves."
                                />
                                <UrgentItem
                                    title="EXP-002: HSN Validation"
                                    desc="Mismatch detected in HSN classification for Basmati Rice."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusItem({ label, status, time, color }: { label: string, status: string, time: string, color?: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xs text-slate-500 font-medium">{time}</p>
            </div>
            <div className={cn(
                "px-2 py-1 rounded-md text-[10px] font-black border",
                color === 'blue' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
            )}>
                {status}
            </div>
        </div>
    );
}

function UrgentItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 group hover:bg-amber-50 transition-colors">
            <h4 className="text-xs font-black text-amber-800 flex items-center gap-2 mb-1">
                {title}
            </h4>
            <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed italic">
                {desc}
            </p>
        </div>
    );
}
