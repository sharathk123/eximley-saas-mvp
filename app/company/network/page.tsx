"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Globe,
    Phone,
    Mail,
    ShieldCheck,
    Stamp,
    Package,
    Building2,
    ArrowUpRight,
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PartnerType, Partner } from '@/lib/types/partner';
import { getPartners } from '@/lib/services/partnerService';
import { PartnerOnboardingModal } from '@/components/network/PartnerOnboardingModal';

export default function PartnerNetworkPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [activeTab, setActiveTab] = useState<PartnerType | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    useEffect(() => {
        // Load partners from service
        setPartners(getPartners('company-1'));
    }, []);

    const filteredPartners = partners.filter(p => {
        const matchesTab = activeTab === 'ALL' || p.type === activeTab;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleOnboardSuccess = (newPartner: Partner) => {
        setPartners(prev => [newPartner, ...prev]);
    };

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Partner Network</h1>
                            <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                {partners.length} Verified Entities • Global Cluster
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search partners, emails..."
                                className="input-sleek pl-12 !h-14 w-72 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setIsOnboardingOpen(true)}
                            className="btn-sleek-lg btn-sleek-primary !h-14 shadow-xl shadow-indigo-500/20 gap-2"
                        >
                            <UserPlus size={20} />
                            <span className="uppercase tracking-widest">Onboard Partner</span>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-[2rem] border border-slate-100 w-fit backdrop-blur-sm mb-10 overflow-x-auto scrollbar-hide">
                    <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} label="All Partners" />
                    <TabButton active={activeTab === 'BUYER'} onClick={() => setActiveTab('BUYER')} label="Buyers" icon={Users} />
                    <TabButton active={activeTab === 'SUPPLIER'} onClick={() => setActiveTab('SUPPLIER')} label="Suppliers" icon={Package} />
                    <TabButton active={activeTab === 'CHA_AGENT'} onClick={() => setActiveTab('CHA_AGENT')} label="CHA Agents" icon={Stamp} />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPartners.map((partner) => (
                            <PartnerCard key={partner.id} partner={partner} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPartners.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">No partners found</h3>
                        <p className="text-slate-500 font-bold mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            <PartnerOnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                onSuccess={handleOnboardSuccess}
            />
        </div>
    );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "h-12 px-6 rounded-[1.5rem] flex items-center gap-3 transition-all duration-300 group whitespace-nowrap relative",
                !active && "text-slate-400 hover:text-slate-600 hover:bg-slate-100/30"
            )}
        >
            {active && (
                <motion.div
                    layoutId="active-pill-network"
                    className="absolute inset-0 bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
            )}

            <div className="relative z-10 flex items-center gap-3">
                {Icon ? (
                    <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300",
                        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>
                        <Icon size={14} />
                    </div>
                ) : (
                    <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300",
                        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>
                        <Globe size={14} />
                    </div>
                )}
                <span className={cn(
                    "font-black text-[11px] uppercase tracking-widest transition-colors",
                    active ? "text-indigo-950" : "text-slate-400 group-hover:text-slate-600"
                )}>{label}</span>
            </div>
        </button>
    );
}

function PartnerCard({ partner }: { partner: Partner }) {
    const Icon = partner.type === 'BUYER' ? Users : partner.type === 'SUPPLIER' ? Package : Stamp;
    const typeLabel = partner.type.replace('_', ' ');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-sleek flex flex-col min-h-[320px] bg-white group hover:border-slate-300 transition-all border-slate-100"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "h-14 w-14 rounded-2.5xl flex items-center justify-center transition-all",
                    partner.type === 'BUYER' ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" :
                        partner.type === 'SUPPLIER' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                            "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white"
                )}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                    partner.metadata.complianceStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                )}>
                    {partner.metadata.complianceStatus || 'Active'}
                </div>
            </div>

            <div className="mb-6 flex-1">
                <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{partner.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={12} />
                    {partner.country}
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <Mail size={14} className="text-slate-300" />
                    {partner.email}
                </div>
                {partner.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <Phone size={14} className="text-slate-300" />
                        {partner.phone}
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Entity Type</p>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{typeLabel}</p>
                </div>
                <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-50 text-slate-400 hover:text-slate-900">
                    <ArrowUpRight size={20} />
                </Button>
            </div>
        </motion.div>
    );
}
