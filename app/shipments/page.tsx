"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, ChevronRight, Filter, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/context/WorkflowContext';
import { CreateEnquiryForm } from '@/components/workflow/CreateEnquiryForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
        'PAYMENT_CONFIRMED',
        'CI_PL_APPROVED',
        'SB_FILED',
        'LEO_GRANTED',
        'CLOSED'
    ];

    return (
        <div className="space-y-8">
            {showCreateForm && (
                <CreateEnquiryForm onClose={() => setShowCreateForm(false)} />
            )}

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Shipments</h1>
                    <p className="text-slate-500 mt-2">Manage and track all your export shipments</p>
                </div>
                <Button
                    onClick={() => setShowCreateForm(true)}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20"
                >
                    <Plus size={18} className="mr-2" />
                    Create Enquiry
                </Button>
            </div>

            {/* Filters */}
            <div className="glass-panel p-6 rounded-[2rem] shadow-xl">
                <div className="flex gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by ID, destination, or buyer..."
                            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-12 pl-12 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status === 'ALL' ? 'All Status' : status.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-600">
                        Showing {filteredShipments.length} of {shipments.length} shipments
                    </p>
                </div>
            </div>

            {/* Shipments List */}
            <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
                <div className="space-y-3">
                    {filteredShipments.map((shipment, idx) => (
                        <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div className="h-14 w-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                                    <Box size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-base font-black text-slate-900">{shipment.id}</p>
                                        <StatusPill status={shipment.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <p className="text-slate-600 font-medium">
                                            <span className="text-slate-400">To:</span> {shipment.destination}
                                        </p>
                                        <span className="text-slate-300">•</span>
                                        <p className="text-slate-600 font-medium">
                                            <span className="text-slate-400">Buyer:</span> {shipment.buyer}
                                        </p>
                                        <span className="text-slate-300">•</span>
                                        <p className="text-slate-600 font-medium">
                                            <span className="text-slate-400">Goods:</span> {shipment.goods}
                                        </p>
                                    </div>
                                    {shipment.value !== 'Pending' && (
                                        <p className="text-sm font-black text-emerald-600 mt-1">{shipment.value}</p>
                                    )}
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                    <ChevronRight size={18} />
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
                                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20"
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
    );
}

function StatusPill({ status }: { status: string }) {
    const formatStatus = (s: string) => s.replace(/_/g, ' ');

    let colorClass = "bg-slate-100 text-slate-600 border-slate-200";

    if (status.includes('APPROVED') || status.includes('FILED') || status.includes('GRANTED')) {
        colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (status.includes('PENDING') || status.includes('DRAFT') || status.includes('RECEIVED')) {
        colorClass = "bg-amber-50 text-amber-700 border-amber-200";
    } else if (status.includes('QUERY')) {
        colorClass = "bg-red-50 text-red-700 border-red-200";
    } else if (status.includes('CLOSED')) {
        colorClass = "bg-slate-100 text-slate-500 border-slate-200";
    } else if (status.includes('SENT') || status.includes('ACCEPTED')) {
        colorClass = "bg-blue-50 text-blue-700 border-blue-200";
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
            {formatStatus(status)}
        </span>
    );
}
