"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowLeft,
    FileText,
    Package,
    Users,
    Settings as SettingsIcon,
    UserPlus,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCompanyEvents } from '@/lib/services/buyerService';
import type { CompanyEvent } from '@/lib/types/buyer';
import type { User } from '@/lib/types/user';
import { useRouter } from 'next/navigation';

export default function CompanyEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<CompanyEvent[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr) as User;
            setCurrentUser(user);

            // Load company events
            const companyEvents = getCompanyEvents(user.companyId);
            setEvents(companyEvents);
        }
    }, []);

    const getEventIcon = (type: CompanyEvent['type']) => {
        switch (type) {
            case 'ENQUIRY_CREATED':
                return FileText;
            case 'SHIPMENT_UPDATED':
                return TrendingUp;
            case 'USER_INVITED':
                return UserPlus;
            case 'BUYER_ADDED':
                return Users;
            case 'PRODUCT_ADDED':
                return Package;
            case 'SETTINGS_UPDATED':
                return SettingsIcon;
            default:
                return Activity;
        }
    };

    const getEventColor = (type: CompanyEvent['type']) => {
        switch (type) {
            case 'ENQUIRY_CREATED':
                return 'blue';
            case 'SHIPMENT_UPDATED':
                return 'emerald';
            case 'USER_INVITED':
                return 'purple';
            case 'BUYER_ADDED':
                return 'amber';
            case 'PRODUCT_ADDED':
                return 'indigo';
            case 'SETTINGS_UPDATED':
                return 'slate';
            default:
                return 'slate';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Company Audit</h1>
                                <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                    Real-time Activity Cluster
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="btn-sleek-secondary h-12 px-6 gap-2 group font-black uppercase tracking-widest text-[10px]"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Core
                        </button>
                    </div>
                </div>

                {/* Events Timeline */}
                <div className="card-sleek shadow-2xl border-slate-100">
                    <div className="space-y-4">
                        {events.map((event, idx) => {
                            const Icon = getEventIcon(event.type);
                            const color = getEventColor(event.type);

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                        color === 'blue' && "bg-indigo-50 text-indigo-600",
                                        color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                        color === 'purple' && "bg-purple-50 text-purple-600",
                                        color === 'amber' && "bg-amber-50 text-amber-600",
                                        color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                        color === 'slate' && "bg-slate-100 text-slate-600"
                                    )}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{event.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {event.actor} • {event.actorRole.replace('_', ' ')}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                {formatTimestamp(event.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {events.length === 0 && (
                            <div className="text-center py-12">
                                <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                    <Activity size={32} />
                                </div>
                                <p className="text-lg font-black text-slate-900 mb-2">No events yet</p>
                                <p className="text-sm text-slate-500 font-medium">Company activity will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
