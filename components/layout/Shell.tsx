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
    ChevronDown
} from 'lucide-react';
import { Role } from '@/lib/workflow';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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
                <div className="h-16 flex items-center px-6 border-b border-slate-100/50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
                            E
                        </div>
                        <span className="font-semibold text-indigo-900 tracking-tight">Eximley</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
                    <NavItem href="/shipments" icon={<Box size={18} />} label="Shipments" active={pathname.startsWith('/shipments')} />
                    <NavItem href="/documents" icon={<FileText size={18} />} label="Documents" active={pathname === '/documents'} />
                    <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/settings'} />
                </nav>

                <div className="p-4 border-t border-slate-100/50">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 fixed top-0 right-0 left-0 md:left-64 z-40 glass border-b border-slate-200/60 flex items-center justify-between px-6 transition-all duration-300">
                    {/* Search Bar */}
                    <div className="w-96 relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search shipments, documents..."
                            className="w-full h-9 pl-10 pr-4 rounded-full bg-slate-100/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="relative text-slate-500">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                        </Button>

                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-white">
                            {userInitials}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="pt-20 px-6 pb-12 flex-1 overflow-auto">
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
                "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 translate-x-1"
                    : "text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-700 hover:translate-x-1"
            )}
        >
            <span className={cn("mr-3", active ? "text-white" : "text-slate-400")}>{icon}</span>
            {label}
        </Link>
    );
}
