"use client";

import React, { useState } from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, User, Globe, Package, ShoppingBag } from 'lucide-react';
import { Shipment, Message } from '@/lib/workflow';
import { COUNTRIES, PORTS, SHIPPING_MODES } from '@/lib/constants/masterData';

interface CreateEnquiryFormProps {
    onClose: () => void;
}

export function CreateEnquiryForm({ onClose }: CreateEnquiryFormProps) {
    const { addShipment } = useWorkflow();
    const [workflowType, setWorkflowType] = useState<'EXPORT' | 'IMPORT'>('EXPORT');

    // Joint state for both flows
    const [formData, setFormData] = useState({
        partyName: '', // Buyer (Export) or Supplier (Import)
        country: 'DE', // Destination (Export) or Origin (Import)
        port: 'DEHAM', // Destination (Export) or Origin (Import)
        shippingMode: 'SEA',
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

        const prefix = workflowType === 'EXPORT' ? 'ENQ' : 'IMP-ENQ';
        const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
        const timestamp = new Date().toISOString();

        const countryName = COUNTRIES.find(c => c.code === formData.country)?.name || formData.country;
        const portName = [...PORTS.SEA, ...PORTS.AIR].find(p => p.code === formData.port)?.name || formData.port;
        const locationStr = `${portName}, ${countryName}`;

        let newShipment: any = {};

        if (workflowType === 'EXPORT') {
            // Export Logic (Simulate Incoming Enquiry from Buyer)
            const initialMessage: Message = {
                id: `msg-${Date.now()}`,
                sender: 'BUYER',
                content: formData.message || `Dear Team,\n\nWe are looking for **${formData.quantity}** of **${formData.goods}** to be delivered to **${locationStr}** via **${formData.shippingMode}**.\n\nPlease provide your best FOB quotation.\n\nRegards,\n${formData.partyName}`,
                timestamp
            };

            newShipment = {
                id: newId,
                buyer: formData.partyName,
                destination: locationStr,
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
                history: [{ state: 'ENQUIRY_RECEIVED', timestamp, actor: formData.partyName, role: 'BUYER', action: 'Sent New Enquiry' }]
            };
        } else {
            // Import Logic (Send Enquiry TO Supplier)
            // In import, WE are the sender initially
            const initialMessage: Message = {
                id: `msg-${Date.now()}`,
                sender: 'EXPORTER', // Re-using EXPORTER role to represent 'We/Buyer'
                content: formData.message || `Dear Sales Team,\n\nWe are interested in importing **${formData.quantity}** of **${formData.goods}** from **${locationStr}**.\n\nPlease provide your best Ex-Works quotation and availability.\n\nRegards,\nSourching Manager\nEximley India`,
                timestamp
            };

            newShipment = {
                id: newId.replace('ENQ', 'IMP'),
                origin: locationStr, // Import specific
                supplier: formData.partyName, // Import specific
                goods: formData.goods,
                status: 'IMPORT_ENQUIRY_SENT',
                value: 'Pending',
                chaMode: 'EMBEDDED',
                portOfEntry: 'JNPT, Mumbai', // Default for now
                enquiry: {
                    id: newId,
                    message: initialMessage.content,
                    quantity: formData.quantity,
                    expectations: 'Ex-Works, Standard',
                    timestamp
                },
                messages: [initialMessage],
                history: [{ state: 'IMPORT_ENQUIRY_SENT', timestamp, actor: 'You', role: 'COMPANY_ADMIN', action: 'Sent Enquiry to Supplier' }]
            };
        }

        addShipment(newShipment);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Start New Shipment</h2>
                        <p className="text-sm text-slate-500 mt-1">Select workflow type to begin</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Type Toggle */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setWorkflowType('EXPORT')}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${workflowType === 'EXPORT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Export (Sell)
                        </button>
                        <button
                            type="button"
                            onClick={() => setWorkflowType('IMPORT')}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${workflowType === 'IMPORT' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Import (Buy)
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <User size={12} className={workflowType === 'EXPORT' ? "text-blue-500" : "text-purple-500"} />
                                {workflowType === 'EXPORT' ? 'Buyer Name' : 'Supplier Name'}
                            </label>
                            <Input
                                name="partyName"
                                placeholder={workflowType === 'EXPORT' ? "e.g. London Ceramics Ltd" : "e.g. Shanghai Electronics"}
                                value={formData.partyName}
                                onChange={handleChange}
                                required
                                className="input-sleek"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Globe size={12} className={workflowType === 'EXPORT' ? "text-blue-500" : "text-purple-500"} />
                                {workflowType === 'EXPORT' ? 'Destination Country' : 'Origin Country'}
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                required
                                className="input-sleek w-full"
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                Shipping Mode
                            </label>
                            <select
                                name="shippingMode"
                                value={formData.shippingMode}
                                onChange={(e) => setFormData(prev => ({ ...prev, shippingMode: e.target.value }))}
                                required
                                className="input-sleek w-full"
                            >
                                {SHIPPING_MODES.map(m => (
                                    <option key={m.code} value={m.code}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                {workflowType === 'EXPORT' ? 'Target Port' : 'Origin Port'}
                            </label>
                            <select
                                name="port"
                                value={formData.port}
                                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                                required
                                className="input-sleek w-full"
                            >
                                {(formData.shippingMode === 'SEA' ? PORTS.SEA : PORTS.AIR)
                                    .filter(p => p.country === COUNTRIES.find(c => c.code === formData.country)?.name)
                                    .map(p => (
                                        <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
                                    ))
                                }
                                <option value="OTHER">Other / Port not listed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Package size={12} className={workflowType === 'EXPORT' ? "text-blue-500" : "text-purple-500"} />
                                Goods
                            </label>
                            <Input
                                name="goods"
                                placeholder="e.g. Porcelain Plates"
                                value={formData.goods}
                                onChange={handleChange}
                                required
                                className="input-sleek"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <ShoppingBag size={12} className={workflowType === 'EXPORT' ? "text-blue-500" : "text-purple-500"} />
                                Quantity
                            </label>
                            <Input
                                name="quantity"
                                placeholder="e.g. 5,000 Pcs"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className="input-sleek"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Send size={12} className={workflowType === 'EXPORT' ? "text-blue-500" : "text-purple-500"} />
                            {workflowType === 'EXPORT' ? 'Initial Enquiry Message' : 'Message to Supplier'}
                        </label>
                        <Textarea
                            name="message"
                            placeholder="Type a custom message..."
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[120px] rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`flex-1 shadow-lg h-11 rounded-xl font-bold uppercase tracking-widest text-xs ${workflowType === 'EXPORT'
                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                                }`}
                        >
                            {workflowType === 'EXPORT' ? 'Simulate Buyer Enquiry' : 'Send Enquiry to Supplier'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
