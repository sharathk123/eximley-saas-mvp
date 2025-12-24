"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    ArrowRight,
    Shield,
    Globe,
    Zap,
    CheckCircle2,
    Sparkles,
    BarChart3,
    FileCheck,
    Truck,
    Lock,
    MessageSquare,
    DollarSign,
    FileText,
    LayoutDashboard,
    Box,
    Settings,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WebGLHero } from './WebGLHero';

export function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="relative bg-white text-slate-900 scroll-smooth">
            <Navbar />
            <Hero />
            <TrustSection />
            <FeatureShowcase />
            <LivingFlow />
            <PricingSection />
            <SecuritySection />
            <FinalCTA />
            <Footer />
        </div>
    );
}

function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 flex items-center justify-between px-8 py-3 w-full max-w-6xl rounded-full pointer-events-auto shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">E</div>
                    <span className="text-xl font-black tracking-tighter text-indigo-900">Eximley</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                    <a href="#flow" className="hover:text-indigo-600 transition-colors">Workflow</a>
                    <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    <a href="mailto:sales@eximley.com" className="hover:text-indigo-600 transition-colors font-black">Contact Sales</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold text-indigo-900 hover:text-blue-600 transition-colors">Sign In</Link>
                    <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98]">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
            {/* WebGL Cinematic Background */}
            <WebGLHero />

            <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full border border-indigo-400/30 shadow-sm mb-8">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-cyan-300">India's First Autonomous Export System</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl">
                        From Enquiry<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 animate-gradient">to Export.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed drop-shadow-lg">
                        AI-powered workflows for Indian exporters, importers, and CHAs — where global trade gets done seamlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login" className="group relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white px-8 h-12 rounded-xl flex items-center justify-center text-base font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center">
                                Get Started Free <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link href="/login" className="px-8 h-12 rounded-xl flex items-center justify-center text-base font-bold bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-[0.98]">
                            Contact Sales
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Dashboard Fragments */}
                <div className="mt-24 relative w-full h-[500px] md:h-[650px] perspective-1000">
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl"
                        initial={{ opacity: 0, y: 100, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="glass-panel w-full aspect-[16/10] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden relative border border-white/40 bg-white/80 backdrop-blur-xl">
                            {/* Dashboard Layout */}
                            <div className="flex h-full">
                                {/* Sidebar */}
                                <div className="w-20 border-r border-indigo-50 flex flex-col items-center py-8 gap-6 bg-white/50">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/20" />
                                    <div className="w-full flex flex-col items-center gap-6 mt-4">
                                        {[LayoutDashboard, Box, FileText, Settings].map((Icon, i) => (
                                            <div key={i} className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${i === 1 ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                                <Icon size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 flex flex-col p-8 relative overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Operations</h3>
                                            <p className="text-sm font-medium text-slate-500">Global Command Center</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white border border-slate-100 shadow-sm" />
                                            <div className="h-10 w-10 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/20" />
                                        </div>
                                    </div>

                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[
                                            { label: "Active Shipments", value: "124", color: "text-blue-600", trend: "+12%" },
                                            { label: "Pending Actions", value: "3", color: "text-amber-500", trend: "-2" },
                                            { label: "Total Value", value: "$4.2M", color: "text-emerald-600", trend: "+8%" }
                                        ].map((m, i) => (
                                            <div key={i} className="p-5 rounded-2xl bg-white border border-indigo-50 shadow-sm flex flex-col justify-between">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={`p-2 rounded-lg bg-slate-50 ${m.color}`}><BarChart3 size={18} /></div>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{m.trend}</span>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 opacity-70">{m.label}</p>
                                                    <p className="text-2xl font-black text-slate-900 tracking-tight">{m.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Active Shipment List */}
                                    <div className="flex-1 bg-white rounded-3xl border border-indigo-50 shadow-sm p-6 overflow-hidden relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="h-5 w-32 bg-slate-100 rounded-full" />
                                            <div className="h-8 w-24 bg-indigo-50 rounded-lg" />
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                { id: "SHP-2025-001", dest: "New York, USA", status: "In Transit", icon: "🇺🇸", state: "default" },
                                                { id: "SHP-2025-002", dest: "Dubai, UAE", status: "AI Drafting...", icon: "🇦🇪", state: "active" },
                                                { id: "SHP-2025-003", dest: "Berlin, GER", status: "Customs", icon: "🇩🇪", state: "default" }
                                            ].map((item, i) => (
                                                <div key={i} className={cn(
                                                    "flex items-center gap-4 p-3 rounded-xl border transition-all",
                                                    item.state === 'active'
                                                        ? "bg-indigo-50/50 border-indigo-200 shadow-sm"
                                                        : "bg-white border-slate-50 hover:bg-slate-50"
                                                )}>
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg shadow-inner">{item.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-slate-900">{item.id}</p>
                                                            {item.state === 'active' && <Sparkles size={12} className="text-indigo-600 animate-pulse" />}
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-500">{item.dest}</p>
                                                    </div>
                                                    <div className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-bold",
                                                        item.state === 'active'
                                                            ? "bg-indigo-100 text-indigo-700 animate-pulse"
                                                            : "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {item.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Floating Status Card Overlay */}
                                        <div className="absolute top-6 right-6 z-10">
                                            <div className="h-[180px] w-[160px] rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-6 relative overflow-hidden shadow-2xl shadow-indigo-500/30 flex flex-col justify-end">
                                                <div className="absolute top-0 right-0 p-6 opacity-20">
                                                    <Globe size={48} />
                                                </div>
                                                <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl mb-4 flex items-center justify-center border border-white/30">
                                                    <CheckCircle2 size={20} className="text-white" />
                                                </div>
                                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Status</p>
                                                <p className="text-lg font-bold leading-tight">All Systems<br />Green</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute top-20 -left-16 md:left-0 h-32 w-52 bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white p-6 flex flex-col justify-between shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] z-20"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 shadow-inner">
                            <Zap size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">AI Auto-Drafting</p>
                            <p className="text-[10px] font-bold text-slate-400">Processing Shipment #002...</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-16 -right-16 md:right-0 h-36 w-60 bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white p-7 flex flex-col gap-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] z-20"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <CheckCircle2 size={18} />
                                </div>
                                <span className="text-[12px] font-black uppercase tracking-tight text-slate-900">Audit Ready</span>
                            </div>
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "95%" }}
                                    transition={{ duration: 2, delay: 1 }}
                                />
                            </div>
                            <div className="h-2.5 w-4/5 bg-slate-100 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function TrustSection() {
    return (
        <section className="py-24 bg-white border-y border-slate-50">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Global", sub: "International Standards", icon: <Globe size={24} className="text-blue-600" /> },
                    { label: "Compliance", sub: "Audit-ready Docs", icon: <FileCheck size={24} className="text-indigo-600" /> },
                    { label: "Secure", sub: "Enterprise Protection", icon: <Shield size={24} className="text-emerald-600" /> },
                    { label: "Intelligent", sub: "AI-Powered Workflows", icon: <Zap size={24} className="text-amber-500" /> }
                ].map((item, i) => (
                    <div key={i} className="sleek-card p-6 flex flex-col items-center text-center justify-center min-h-[160px] group hover:bg-slate-50/50 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:shadow-md group-hover:bg-white">{item.icon}</div>
                        <p className="text-xl font-black text-slate-900 mb-1 tracking-tight">{item.label}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide opacity-70">{item.sub}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FeatureShowcase() {
    const features = [
        {
            title: "Enquiry-to-Export Workflows",
            desc: "One structured road for every shipment. From initial query to final closure.",
            icon: <Globe className="text-blue-600" size={32} />,
            visual: <FeatureVisual1 />
        },
        {
            title: "AI-Assisted Documentation",
            desc: "Auto-draft CI, PL, and Shipping Bills with 99.9% accuracy matching ICEGATE standards.",
            icon: <Sparkles className="text-indigo-600" size={32} />,
            visual: <FeatureVisual2 />
        },
        {
            title: "Human Approval Gates",
            desc: "The precision of AI combined with the safety of mandatory human confirmation.",
            icon: <Shield className="text-emerald-600" size={32} />,
            visual: <FeatureVisual3 />
        }
    ];

    return (
        <section id="features" className="py-32 bg-slate-50/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Core Infrastructure</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Everything you need to run a world-class export organization on one platform.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="weightless-card p-8 flex flex-col min-h-[480px]"
                            whileHover={{ y: -5 }}
                        >
                            <div className="mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">{f.icon}</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{f.title}</h3>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{f.desc}</p>
                            <div className="mt-auto rounded-3xl overflow-hidden shadow-sm">{f.visual}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureVisual1() {
    return (
        <div className="h-32 w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-4 flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 compliance-grid" />
            <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden">
                <div className="p-2 bg-white/20 backdrop-blur text-white rounded-lg"><MessageSquare size={16} /></div>
                <div className="h-1 flex-1 bg-white/20 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-white animate-signal" />
                </div>
                <div className="p-2 bg-emerald-400 text-indigo-900 rounded-lg shadow-lg"><Truck size={16} /></div>
            </div>
        </div>
    );
}

function FeatureVisual2() {
    return (
        <div className="h-32 w-full relative overflow-hidden bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-100 rounded-sm" />
                <div className="h-2 w-24 bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-100 rounded-sm" />
                <div className="h-2 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 scale-150 opacity-10">
                <Sparkles size={100} className="text-indigo-600" />
            </div>
        </div>
    );
}

function FeatureVisual3() {
    return (
        <div className="h-32 w-full relative overflow-hidden bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Lock size={24} />
            </div>
            <div className="space-y-2">
                <div className="h-2 w-32 bg-emerald-200 rounded-full" />
                <div className="h-2 w-20 bg-emerald-200 rounded-full" />
            </div>
        </div>
    );
}

function LivingFlow() {
    const steps = [
        { label: "Enquiry", color: "bg-blue-600", text: "text-blue-600", border: "border-blue-200", icon: <MessageSquare size={16} /> },
        { label: "Quotation", color: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-200", icon: <FileText size={16} /> },
        { label: "Negotiation", color: "bg-violet-600", text: "text-violet-600", border: "border-violet-200", icon: <MessageSquare size={16} /> },
        { label: "Acceptance", color: "bg-purple-600", text: "text-purple-600", border: "border-purple-200", icon: <CheckCircle2 size={16} /> },
        { label: "Proforma", color: "bg-fuchsia-600", text: "text-fuchsia-600", border: "border-fuchsia-200", icon: <FileText size={16} /> },
        { label: "Payment", color: "bg-pink-600", text: "text-pink-600", border: "border-pink-200", icon: <DollarSign size={16} /> },
        { label: "CI / PL", color: "bg-rose-600", text: "text-rose-600", border: "border-rose-200", icon: <FileText size={16} /> },
        { label: "Customs", color: "bg-orange-600", text: "text-orange-600", border: "border-orange-200", icon: <Shield size={16} /> }
    ];

    return (
        <section id="flow" className="py-32 bg-white overflow-hidden relative border-t border-slate-50">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">The Living Flow</h2>
                    <p className="text-xl text-slate-500 font-medium">A guided, intelligent stream for every shipment.</p>
                </div>

                <div className="relative overflow-x-auto pb-12 scrollbar-hide -mx-6 px-6">
                    <div className="flex items-center min-w-max mx-auto justify-center space-x-4">
                        {steps.map((step, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    className="relative group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={cn(
                                            "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border-2 z-10 relative bg-white",
                                            step.border,
                                            step.text
                                        )}>
                                            {step.icon}
                                            <div className={cn(
                                                "absolute inset-0 opacity-10 rounded-xl transition-opacity group-hover:opacity-20",
                                                step.color.replace('text', 'bg')
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{step.label}</span>
                                    </div>
                                </motion.div>

                                {i < steps.length - 1 && (
                                    <div className="w-16 h-[2px] bg-slate-100 relative mt-[-28px]">
                                        <motion.div
                                            className={cn("absolute inset-0 origin-left", step.color)}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Simulated Floating Cursor/Status */}
                <motion.div
                    className="absolute top-[55%] left-[20%] z-20 pointer-events-none hidden md:block"
                    animate={{ x: [0, 600], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Processing...
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function PricingSection() {
    return (
        <section id="pricing" className="py-32 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard
                        title="Starter"
                        price="₹0"
                        desc="For small Indian exporters starting their global journey."
                        features={["10 Enquiries/mo", "Basic AI Drafting", "Email Support"]}
                        href="/login"
                    />
                    <PricingCard
                        title="Growth"
                        price="₹49,990"
                        desc="Scaling exporters needing full workflow automation."
                        features={["Unlimited Enquiries", "Full AI Suite", "CHA Collaboration", "Priority Support"]}
                        popular
                        href="/login"
                    />
                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        desc="Multi-entity controls for Indian trade giants."
                        features={["SLA Guarantees", "Custom Compliance Rules", "Dedicated Onboarding", "API Access"]}
                        ctaLabel="Contact Sales"
                        href="mailto:sales@eximley.com"
                    />
                </div>
            </div>
        </section>
    );
}

function PricingCard({ title, price, desc, features, popular, ctaLabel = "Get Started", href = "/login" }: any) {
    return (
        <div className={cn(
            "p-10 rounded-[2.5rem] flex flex-col min-h-[600px] transition-all duration-500",
            popular ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white scale-105 shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)]" : "bg-white border border-slate-100 text-slate-900"
        )}>
            {popular && (
                <span className="bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-8 shadow-lg">
                    Most Popular
                </span>
            )}
            <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black tracking-tight">{price}</span>
                {price !== "Custom" && <span className="text-sm font-medium opacity-60">/mo</span>}
            </div>
            <p className="font-medium opacity-60 mb-12">{desc}</p>

            <div className="space-y-4 mb-12">
                {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className={popular ? "text-emerald-400" : "text-indigo-600"} />
                        <span className="text-sm font-bold opacity-80">{f}</span>
                    </div>
                ))}
            </div>

            {href.startsWith('mailto:') ? (
                <a href={href} className={cn(
                    "mt-auto h-12 rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-sm flex items-center justify-center",
                    popular ? "bg-white text-indigo-900 hover:bg-indigo-50" : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                )}>
                    {ctaLabel}
                </a>
            ) : (
                <Link href={href} className={cn(
                    "mt-auto h-12 rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-sm flex items-center justify-center",
                    popular ? "bg-white text-indigo-900 hover:bg-indigo-50" : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                )}>
                    {ctaLabel}
                </Link>
            )}
        </div>
    );
}

function SecuritySection() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <div className="h-16 w-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Enterprise-Grade Security</h2>
                    <div className="space-y-8">
                        <SecurityItem
                            icon={<Shield size={20} />}
                            title="Immutable Audit Trails"
                            desc="Every action, approval, and document is tracked in an unalterable compliance log."
                        />
                        <SecurityItem
                            icon={<FileCheck size={20} />}
                            title="RBAC Controls"
                            desc="Role-based access ensure Only authorized users can file customs or approve payments."
                        />
                    </div>
                </div>
                <div className="flex-1 w-full max-w-lg aspect-square glass-panel rounded-[3rem] p-12 relative flex items-center justify-center">
                    <div className="absolute inset-0 compliance-grid opacity-10" />
                    <div className="relative z-10 text-center flex flex-col items-center">
                        <div className="h-32 w-32 border-4 border-slate-900/5 rounded-full flex items-center justify-center mb-6">
                            <div className="h-24 w-24 border-4 border-blue-600 rounded-full flex items-center justify-center animate-pulse">
                                <Lock size={40} className="text-slate-900" />
                            </div>
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Security Core v2.0</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SecurityItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 text-blue-600">{icon}</div>
            <div>
                <h4 className="font-black text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function FinalCTA() {
    return (
        <section className="py-40 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full" />
            </div>
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-indigo-950 mb-12 tracking-tight">Run Global Trade Like a Modern Business.</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 h-12 rounded-xl flex items-center justify-center text-base font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.98]">
                        Get Started Free
                    </Link>
                    <Link href="/login" className="px-8 h-12 rounded-xl flex items-center justify-center text-base font-bold bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-[0.98]">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded flex items-center justify-center font-bold text-xs shadow-md">E</div>
                    <span className="text-lg font-black tracking-tighter text-indigo-900">Eximley</span>
                </div>

                <div className="flex gap-8 text-sm font-bold text-slate-400">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 Eximley Autonomous Systems</p>
            </div>
        </footer>
    );
}
