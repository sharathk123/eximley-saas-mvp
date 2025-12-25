"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
    Package,
    FileText,
    ShieldCheck,
    Bell,
    Send,
    Plus,
    Search,
    Info
} from 'lucide-react';

export default function DesignSystemPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const testLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">Sleek Enterprise Design System</h1>
                <p className="text-slate-500 text-lg">Standardized UI components for Eximley SaaS</p>
            </div>

            {/* Buttons Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Send className="text-indigo-600" size={24} />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Buttons</h2>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="default">Primary Button</Button>
                    <Button variant="premium">Premium Gradient</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive</Button>
                </div>

                <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading States</p>
                        <div className="flex gap-4">
                            <Button isLoading={isLoading} onClick={testLoading}>
                                {isLoading ? 'Processing...' : 'Click to Load'}
                            </Button>
                            <Button variant="outline" isLoading={true}>Loading Outline</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Package className="text-indigo-600" size={24} />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cards</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card hoverable>
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                            <FileText className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Default Card</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            A standardized card with hover effects, consistent padding, and enterprise-grade shadows.
                        </p>
                    </Card>

                    <Card variant="glass" hoverable>
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                            <ShieldCheck className="text-emerald-500" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Glass Card</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Frosted glass effect using backdrop blurs. Perfect for overlays and premium dashboard widgets.
                        </p>
                    </Card>

                    <Card variant="outline">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                            <Bell className="text-slate-400" size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Outline Card</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Zero shadow, subtle border. Best used for secondary information or nested lists.
                        </p>
                    </Card>
                </div>
            </section>

            {/* Modal Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Bell className="text-indigo-600" size={24} />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Modals</h2>
                </div>

                <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center space-y-4">
                    <div className="text-center">
                        <h3 className="text-xl font-black text-indigo-900 mb-1">Interactive Modal Demo</h3>
                        <p className="text-indigo-700/70 text-sm max-w-md">
                            Test the Framer Motion entrance animations and frosted glass backdrop.
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} size="lg" className="btn-sleek-primary">
                        <Plus className="mr-2" size={20} />
                        Open High-Fidelity Modal
                    </Button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Enterprise Workflow Configuration"
                    maxWidth="2xl"
                >
                    <div className="p-8 space-y-6">
                        <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-amber-800 text-sm">
                            <Info className="flex-shrink-0" size={20} />
                            <p>This modal follows the standard architecture for headers, scrollable body, and entrance motion.</p>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                                        <Search className="text-slate-400" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Workflow Step #{i}</p>
                                        <p className="text-xs text-slate-500">Last modified 2 days ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-slate-100">
                            <Button className="flex-1" onClick={() => setIsModalOpen(false)}>Save Changes</Button>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal>
            </section>

            {/* Typography Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Typography</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Headings</p>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900">Heading 1</h1>
                        <h2 className="text-3xl font-black tracking-tight text-slate-800">Heading 2</h2>
                        <h3 className="text-xl font-black tracking-tight text-slate-800">Heading 3</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Body & Labels</p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Large descriptive body text for intros and feature summaries.
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Standard body text for information grids and document details. Ensuring readability with correct line-height.
                        </p>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Uppercase UI Label
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
