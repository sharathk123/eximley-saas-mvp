"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory, UnitOfMeasure } from '@/lib/types/product';
import { HSCodeLookup } from './HSCodeLookup';
import { PRODUCT_CATEGORIES, UNIT_OF_MEASURE, COUNTRIES } from '@/lib/constants/masterData';

interface ProductFormProps {
    product?: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    // Auto-generate SKU for new products
    const generateSKU = (category: ProductCategory) => {
        const categoryPrefix = category.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        return `${categoryPrefix}-${timestamp}`;
    };

    const [formData, setFormData] = useState({
        sku: product?.sku || '',
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

    // Auto-generate SKU for new products when category changes
    useEffect(() => {
        if (!product && formData.category) {
            setFormData(prev => ({ ...prev, sku: generateSKU(formData.category as ProductCategory) }));
        }
    }, [formData.category, product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            id: product?.id || Date.now().toString(),
            sku: formData.sku || generateSKU(formData.category as ProductCategory),
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="card-sleek w-full max-w-3xl overflow-hidden p-0"
            >
                {/* Header */}
                <div className="p-8 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/20">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Use AI to automatically classify your product with the correct ITC HS Code
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="h-10 w-10 rounded-full hover:bg-white hover:shadow-lg transition-all flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* SKU and Product Name */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                SKU (Auto-generated)
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={formData.sku || 'Auto-generated on save'}
                                className="input-sleek w-full bg-slate-50 text-slate-500 cursor-not-allowed"
                                placeholder="Auto-generated"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="input-sleek w-full"
                                placeholder="e.g., Cotton T-Shirts, Basmati Rice, Laptop"
                            />
                        </div>
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
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
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
                                className="input-sleek flex-1 h-12"
                                placeholder="XXXX.XX.XX"
                            />
                            <Button
                                type="button"
                                onClick={() => setShowHSCodeLookup(true)}
                                disabled={!formData.name}
                                className="btn-sleek-primary h-12 px-6 shadow-indigo-500/20 gap-2"
                            >
                                <Sparkles size={16} />
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
                                className="input-sleek w-full"
                            >
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
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
                                className="input-sleek w-full"
                            >
                                {UNIT_OF_MEASURE.map(u => (
                                    <option key={u.code} value={u.code}>{u.name} ({u.code})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Origin Country and Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                Origin Country *
                            </label>
                            <select
                                required
                                value={formData.originCountry}
                                onChange={(e) => setFormData(prev => ({ ...prev, originCountry: e.target.value }))}
                                className="input-sleek w-full"
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
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
                                className="input-sleek w-full"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            className="btn-sleek-lg btn-sleek-primary flex-1 shadow-indigo-500/20"
                        >
                            {product ? 'Update Product' : 'Add Product'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="btn-sleek-secondary h-14 px-8 font-black uppercase tracking-widest text-xs"
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
