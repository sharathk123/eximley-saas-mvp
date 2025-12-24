"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Download,
    Upload,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';
import { ProductForm } from './ProductForm';

export function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: 'Cotton T-Shirts',
            description: 'Premium quality cotton t-shirts for export',
            hsCode: '6109.10.00',
            hsCodeConfidence: 94,
            category: 'Textiles',
            unitOfMeasure: 'PCS',
            originCountry: 'India',
            createdAt: '2024-12-20',
            updatedAt: '2024-12-20',
            status: 'ACTIVE'
        },
        {
            id: '2',
            name: 'Basmati Rice',
            description: 'Premium aged basmati rice, 1121 variety',
            hsCode: '1006.30.10',
            hsCodeConfidence: 96,
            category: 'Agricultural',
            unitOfMeasure: 'KGS',
            originCountry: 'India',
            weight: 25,
            createdAt: '2024-12-19',
            updatedAt: '2024-12-19',
            status: 'ACTIVE'
        },
        {
            id: '3',
            name: 'Centrifugal Water Pump',
            description: 'Industrial centrifugal pump, 5HP',
            hsCode: '8413.70.10',
            hsCodeConfidence: 93,
            category: 'Machinery',
            unitOfMeasure: 'PCS',
            originCountry: 'India',
            weight: 45,
            createdAt: '2024-12-18',
            updatedAt: '2024-12-18',
            status: 'ACTIVE'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
        setShowProductForm(false);
    };

    const handleEditProduct = (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.hsCode.includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Product Catalog</h2>
                    <p className="text-slate-500 font-medium">Manage your EXIM product database with AI-powered HS Code classification</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(true);
                    }}
                    className="btn-sleek-primary h-10 px-5 shadow-blue-500/20"
                >
                    <Plus size={18} className="mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Search and Actions Bar */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by product name, HS code, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-sleek w-full pl-10"
                    />
                </div>
                <button className="btn-sleek-secondary h-10 px-4">
                    <Filter size={16} />
                    Filter
                </button>
                <button className="btn-sleek-secondary h-10 px-4">
                    <Upload size={16} />
                    Import CSV
                </button>
                <button className="btn-sleek-secondary h-10 px-4">
                    <Download size={16} />
                    Export
                </button>
            </div>

            {/* Products Table */}
            <div className="card-sleek p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ITC HS Code</th>
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit</th>
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Origin</th>
                                <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="text-right p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, idx) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="icon-box-sleek h-12 w-12 bg-blue-50 text-blue-600 border border-blue-100">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-400 font-medium line-clamp-1">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                                {product.hsCode}
                                            </code>
                                            {product.hsCodeConfidence && product.hsCodeConfidence >= 90 && (
                                                <div className="h-2 w-2 bg-emerald-500 rounded-full" title={`${product.hsCodeConfidence}% confidence`} />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-bold text-slate-700">{product.category}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-bold text-slate-700">{product.unitOfMeasure}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-bold text-slate-700">{product.originCountry}</span>
                                    </td>
                                    <td className="p-6">
                                        {product.status === 'ACTIVE' ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                <CheckCircle2 size={14} className="text-emerald-600" />
                                                <span className="text-xs font-black uppercase text-emerald-700">Active</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                                                <XCircle size={14} className="text-slate-600" />
                                                <span className="text-xs font-black uppercase text-slate-700">Archived</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowProductForm(true);
                                                }}
                                                className="btn-sleek-secondary h-10 w-10 px-0 border hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="btn-sleek-secondary h-10 w-10 px-0 border hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                            <Package size={32} />
                        </div>
                        <p className="text-lg font-black text-slate-900 mb-2">No products found</p>
                        <p className="text-sm text-slate-500 font-medium">Try adjusting your search or add a new product</p>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            <AnimatePresence>
                {showProductForm && (
                    <ProductForm
                        product={editingProduct}
                        onSave={editingProduct ? handleEditProduct : handleAddProduct}
                        onCancel={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
