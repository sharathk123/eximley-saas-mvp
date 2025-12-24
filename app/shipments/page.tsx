"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, ChevronRight, Filter, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/context/WorkflowContext';
import { CreateEnquiryForm } from '@/components/workflow/CreateEnquiryForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/StatusPill';

export default function ShipmentsPage() {
    const { shipments } = useWorkflow();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.buyer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusOptions = [
        'ALL',
        'ENQUIRY_RECEIVED',
        'QUOTE_SENT',
        'NEGOTIATION',
        'QUOTE_ACCEPTED',
        'PI_APPROVED',
        'INSURANCE_FILED',
        'ECGC_COVER_OBTAINED',
        'PAYMENT_CONFIRMED',
        'CI_PL_APPROVED',
        'SB_FILED',
        'LEO_GRANTED',
        'FINANCIAL_RECONCILIATION',
        'ESCALATED',
        'CLOSED'
    ];

    return (
        <div className="min-h-screen bg-transparent">
            {showCreateForm && (
                <CreateEnquiryForm onClose={() => setShowCreateForm(false)} />
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                                <Box size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Shipments</h1>
                                <p className="text-slate-500 font-bold mt-1 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                    Active Global Logistics Hub
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="btn-sleek-lg btn-sleek-primary shadow-xl shadow-indigo-500/20 gap-2"
                        >
                            <Plus size={20} />
                            <span className="uppercase tracking-widest">New Shipment</span>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-sleek mb-10 border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, destination, or buyer..."
                                className="input-sleek w-full !h-14 pl-12"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-sleek h-14 pl-12 pr-10 appearance-none cursor-pointer bg-white"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'ALL' ? 'All Status' : status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Showing {filteredShipments.length} of {shipments.length} nodes in grid
                        </p>
                    </div>
                </div>

                {/* Shipments List */}
                <div className="card-sleek shadow-2xl border-slate-100">
                    <div className="space-y-3">
                        {filteredShipments.map((shipment, idx) => (
                            <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group flex items-center gap-6 p-5 bg-white rounded-2xl border border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                                >
                                    <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <Box size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{shipment.id}</p>
                                                <StatusPill status={shipment.status} />
                                            </div>
                                            {shipment.value !== 'Pending' && (
                                                <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">{shipment.value}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em]">
                                            <p className="flex items-center gap-2">
                                                <span className="text-slate-400">Destination:</span>
                                                <span className="text-slate-600">{shipment.destination}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-slate-400">Nodes:</span>
                                                <span className="text-slate-600">{shipment.buyer}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-slate-400">Cargo:</span>
                                                <span className="text-slate-600 line-clamp-1">{shipment.goods}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight size={20} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}

                        {filteredShipments.length === 0 && (
                            <div className="text-center py-16">
                                <div className="h-24 w-24 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                                    <Box size={40} />
                                </div>
                                <p className="text-lg font-black text-slate-900 mb-2">
                                    {searchTerm || statusFilter !== 'ALL' ? 'No shipments found' : 'No shipments yet'}
                                </p>
                                <p className="text-sm text-slate-500 font-medium mb-6">
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first enquiry to get started'}
                                </p>
                                {!searchTerm && statusFilter === 'ALL' && (
                                    <Button
                                        onClick={() => setShowCreateForm(true)}
                                        className="h-14 px-8 bg-indigo-600 hover:bg-violet-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Create Enquiry
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

