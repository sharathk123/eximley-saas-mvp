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
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">Company Events</h1>
                            <p className="text-slate-500 font-medium mt-1">Activity log for your company</p>
                        </div>
                    </div>
                </div>

                {/* Events Timeline */}
                <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
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
                                    className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                        color === 'blue' && "bg-blue-50 text-blue-600",
                                        color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                        color === 'purple' && "bg-purple-50 text-purple-600",
                                        color === 'amber' && "bg-amber-50 text-amber-600",
                                        color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                        color === 'slate' && "bg-slate-100 text-slate-600"
                                    )}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900">{event.title}</p>
                                        <p className="text-xs text-slate-600 font-medium mt-1">{event.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-xs text-slate-400 font-bold">
                                                {event.actor} • {event.actorRole}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
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
