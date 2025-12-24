"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import {
    Box,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    Users
} from 'lucide-react';
import { Role } from '@/lib/workflow';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Shell({ children }: { children: React.ReactNode }) {
    const { currentRole, setRole } = useWorkflow();
    const pathname = usePathname();
    const [userInitials, setUserInitials] = useState('JD');

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const initials = user.name.split(' ').map((n: string) => n[0]).join('');
                setUserInitials(initials);
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    // Hide shell on login, landing, and admin pages
    if (pathname === '/login' || pathname === '/landing' || pathname === '/admin') return <>{children}</>;


    const roleColors: Record<Role, string> = {
        'EXPORTER_ADMIN': 'bg-blue-100 text-blue-800 border-blue-200',
        'EXPORT_MANAGER': 'bg-purple-100 text-purple-800 border-purple-200',
        'CHA': 'bg-amber-100 text-amber-800 border-amber-200',
        'FINANCE': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'COMPANY_ADMIN': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'COMPANY_EXPORT_ANALYST': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 z-50 glass border-r border-slate-200/60 hidden md:flex flex-col transition-all duration-300">
                <div className="h-20 flex items-center px-6 border-b border-indigo-50/50 bg-indigo-50/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xl shadow-indigo-500/20">
                            E
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-indigo-950 tracking-tighter text-xl leading-none">Eximley</span>
                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1"
                            >
                                SaaS Cluster
                            </motion.span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
                    <NavItem href="/shipments" icon={<Box size={18} />} label="Shipments" active={pathname.startsWith('/shipments')} />
                    <NavItem href="/company/network" icon={<Users size={18} />} label="Partner Network" active={pathname === '/company/network'} />
                    <NavItem href="/documents" icon={<FileText size={18} />} label="Documents" active={pathname === '/documents'} />
                    <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/settings'} />
                </nav>

                <div className="p-4 border-t border-indigo-50/50">
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[9px] rounded-xl">
                        <LogOut size={16} className="mr-3" />
                        Terminate Session
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-20 fixed top-0 right-0 left-0 md:left-64 z-40 glass border-b border-slate-200/60 flex items-center justify-between px-8 transition-all duration-300">
                    {/* Search Bar */}
                    <div className="w-[480px] relative hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Universal search shipments, documents, or partners..."
                            className="input-sleek w-full !h-10 pl-11 pr-4 bg-slate-50 border-transparent focus:bg-white transition-all text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* Demo Role Switcher */}
                        <div className="hidden md:flex items-center bg-white rounded-xl p-1 mr-2 border border-slate-200 shadow-sm">
                            <select
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none px-2 cursor-pointer"
                                value={currentRole}
                                onChange={(e) => setRole(e.target.value as Role)}
                            >
                                <option value="EXPORTER_ADMIN">Exporter (Admin)</option>
                                <option value="COMPANY_EXPORT_ANALYST">Exporter (Analyst)</option>
                                <option value="CHA">CHA Agent</option>
                                <option value="FINANCE">Finance</option>
                            </select>
                        </div>

                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-10 w-10">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)] border-2 border-white"></span>
                        </Button>

                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 border border-white/20 shadow-lg shadow-indigo-500/10 flex items-center justify-center text-xs font-black text-white uppercase tracking-tighter">
                            {userInitials}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="pt-28 px-8 pb-16 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:translate-x-1"
            )}
        >
            <span className={cn("mr-4", active ? "text-white" : "text-slate-300 transition-colors")}>{icon}</span>
            {label}
        </Link>
    );
}
