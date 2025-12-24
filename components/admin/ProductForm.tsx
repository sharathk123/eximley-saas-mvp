"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory, UnitOfMeasure } from '@/lib/types/product';
import { HSCodeLookup } from './HSCodeLookup';

interface ProductFormProps {
    product?: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        hsCode: product?.hsCode || '',
        category: product?.category || 'Electronics' as ProductCategory,
        unitOfMeasure: product?.unitOfMeasure || 'PCS' as UnitOfMeasure,
        originCountry: product?.originCountry || 'India',
        weight: product?.weight?.toString() || '',
    });

    const [showHSCodeLookup, setShowHSCodeLookup] = useState(false);
    const [hsCodeConfidence, setHsCodeConfidence] = useState(product?.hsCodeConfidence);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            id: product?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            hsCode: formData.hsCode,
            hsCodeConfidence,
            category: formData.category,
            unitOfMeasure: formData.unitOfMeasure,
            originCountry: formData.originCountry,
            weight: formData.weight ? parseFloat(formData.weight) : undefined,
            createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            status: 'ACTIVE'
        };

        onSave(newProduct);
    };

    const handleHSCodeSelect = (code: string, confidence: number) => {
        setFormData(prev => ({ ...prev, hsCode: code }));
        setHsCodeConfidence(confidence);
        setShowHSCodeLookup(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Use AI to automatically classify your product with the correct ITC HS Code
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="h-12 w-12 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="e.g., Cotton T-Shirts, Basmati Rice, Laptop"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                            placeholder="Detailed product description..."
                        />
                    </div>

                    {/* AI HS Code Lookup */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            ITC HS Code *
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                required
                                value={formData.hsCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, hsCode: e.target.value }))}
                                className="flex-1 h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="XXXX.XX.XX"
                            />
                            <Button
                                type="button"
                                onClick={() => setShowHSCodeLookup(true)}
                                disabled={!formData.name}
                                className="h-14 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20"
                            >
                                <Sparkles size={18} className="mr-2" />
                                AI Lookup
                            </Button>
                        </div>
                        {hsCodeConfidence && (
                            <p className="text-xs text-emerald-600 font-bold ml-1">
                                ✓ {hsCodeConfidence}% confidence
                            </p>
                        )}
                    </div>

                    {/* Category and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Textiles">Textiles</option>
                                <option value="Machinery">Machinery</option>
                                <option value="Chemicals">Chemicals</option>
                                <option value="Agricultural">Agricultural</option>
                                <option value="Automotive">Automotive</option>
                                <option value="Pharmaceuticals">Pharmaceuticals</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Unit of Measure *
                            </label>
                            <select
                                required
                                value={formData.unitOfMeasure}
                                onChange={(e) => setFormData(prev => ({ ...prev, unitOfMeasure: e.target.value as UnitOfMeasure }))}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                            >
                                <option value="KGS">Kilograms (KGS)</option>
                                <option value="LTR">Liters (LTR)</option>
                                <option value="MTR">Meters (MTR)</option>
                                <option value="PCS">Pieces (PCS)</option>
                                <option value="SET">Sets (SET)</option>
                                <option value="TON">Metric Tons (TON)</option>
                                <option value="BOX">Boxes (BOX)</option>
                                <option value="CTN">Cartons (CTN)</option>
                            </select>
                        </div>
                    </div>

                    {/* Origin Country and Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Origin Country *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.originCountry}
                                onChange={(e) => setFormData(prev => ({ ...prev, originCountry: e.target.value }))}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="India"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20"
                        >
                            {product ? 'Update Product' : 'Add Product'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="h-16 px-8 border-2 border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {/* HS Code Lookup Modal */}
                {showHSCodeLookup && (
                    <HSCodeLookup
                        productName={formData.name}
                        description={formData.description}
                        onSelect={handleHSCodeSelect}
                        onClose={() => setShowHSCodeLookup(false)}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
