"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Building2, Mail, Globe, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanyBuyers, addBuyer } from '@/lib/services/buyerService';
import type { Buyer } from '@/lib/types/buyer';

interface BuyerSelectorProps {
    companyId: string;
    onSelect: (buyer: Buyer) => void;
    selectedBuyer?: Buyer | null;
}

export function BuyerSelector({ companyId, onSelect, selectedBuyer }: BuyerSelectorProps) {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBuyer, setNewBuyer] = useState({
        name: '',
        email: '',
        company: '',
        country: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadBuyers();
    }, [companyId]);

    const loadBuyers = () => {
        const companyBuyers = getCompanyBuyers(companyId);
        setBuyers(companyBuyers);
    };

    const handleAddBuyer = () => {
        const buyer = addBuyer({
            ...newBuyer,
            companyId
        });

        setBuyers([...buyers, buyer]);
        onSelect(buyer);
        setShowAddForm(false);
        setNewBuyer({ name: '', email: '', company: '', country: '', phone: '', address: '' });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Select Buyer
                </label>
                <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <Plus size={14} />
                    Add New Buyer
                </button>
            </div>

            {/* Buyer List */}
            <div className="grid grid-cols-1 gap-3">
                {buyers.map((buyer) => (
                    <button
                        key={buyer.id}
                        type="button"
                        onClick={() => onSelect(buyer)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${selectedBuyer?.id === buyer.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-200'
                            }`}
                    >
                        <p className="text-sm font-black text-slate-900">{buyer.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">{buyer.country} • {buyer.email}</p>
                    </button>
                ))}
            </div>

            {/* Add Buyer Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-4">
                            <h3 className="text-lg font-black text-slate-900">Add New Buyer</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Buyer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newBuyer.name}
                                        onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        placeholder="Company Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={newBuyer.email}
                                        onChange={(e) => setNewBuyer({ ...newBuyer, email: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        placeholder="email@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        value={newBuyer.country}
                                        onChange={(e) => setNewBuyer({ ...newBuyer, country: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Germany"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={newBuyer.phone}
                                        onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        placeholder="+49 30 12345678"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleAddBuyer}
                                    disabled={!newBuyer.name || !newBuyer.email || !newBuyer.country}
                                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black"
                                >
                                    Add Buyer
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                    className="h-12 px-6 border-2 border-slate-200 rounded-xl font-black hover:bg-white"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
