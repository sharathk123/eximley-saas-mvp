"use client";

import React, { useState } from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, User, Globe, Package, ShoppingBag } from 'lucide-react';
import { Shipment, Message } from '@/lib/workflow';

interface CreateEnquiryFormProps {
    onClose: () => void;
}

export function CreateEnquiryForm({ onClose }: CreateEnquiryFormProps) {
    const { addShipment } = useWorkflow();
    const [formData, setFormData] = useState({
        buyer: '',
        destination: '',
        goods: '',
        quantity: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newId = `ENQ-${Math.floor(100 + Math.random() * 900)}`;
        const timestamp = new Date().toISOString();

        const initialMessage: Message = {
            id: `msg-${Date.now()}`,
            sender: 'BUYER',
            content: formData.message || `Dear Team,\n\nWe are looking for **${formData.quantity}** of **${formData.goods}** to be delivered to **${formData.destination}**.\n\nPlease provide your best FOB quotation.\n\nRegards,\n${formData.buyer}`,
            timestamp
        };

        const newShipment: Shipment = {
            id: newId,
            buyer: formData.buyer,
            destination: formData.destination,
            goods: formData.goods,
            status: 'ENQUIRY_RECEIVED',
            value: 'Pending',
            chaMode: 'EMBEDDED',
            enquiry: {
                id: newId,
                message: initialMessage.content,
                quantity: formData.quantity,
                expectations: 'FOB, Premium Quality',
                timestamp
            },
            messages: [initialMessage],
            history: [
                {
                    state: 'ENQUIRY_RECEIVED',
                    timestamp,
                    actor: formData.buyer,
                    role: 'BUYER' as any,
                    action: 'Sent New Enquiry'
                }
            ]
        };

        addShipment(newShipment);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Create New Enquiry</h2>
                        <p className="text-sm text-slate-500 mt-1">Simulate a new buyer request</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <User size={12} className="text-blue-500" />
                                Buyer Name
                            </label>
                            <Input
                                name="buyer"
                                placeholder="e.g. London Ceramics Ltd"
                                value={formData.buyer}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Globe size={12} className="text-blue-500" />
                                Destination
                            </label>
                            <Input
                                name="destination"
                                placeholder="e.g. London, UK"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Package size={12} className="text-blue-500" />
                                Goods
                            </label>
                            <Input
                                name="goods"
                                placeholder="e.g. Porcelain Plates"
                                value={formData.goods}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <ShoppingBag size={12} className="text-blue-500" />
                                Quantity
                            </label>
                            <Input
                                name="quantity"
                                placeholder="e.g. 5,000 Pcs"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Send size={12} className="text-blue-500" />
                            Initial Message (Optional)
                        </label>
                        <Textarea
                            name="message"
                            placeholder="Type a custom message or let the system generate one..."
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[120px] rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 h-12 rounded-xl font-bold text-slate-500"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                        >
                            Create Enquiry
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
