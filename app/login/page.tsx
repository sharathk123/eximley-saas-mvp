"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflow } from '@/context/WorkflowContext';
import { Role } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, FolderKanban, Stamp, ArrowRight, Lock, Mail, Building2, Globe, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticateUser } from '@/lib/services/userService';
import type { User as UserType } from '@/lib/types/user';

export default function LoginPage() {
    const router = useRouter();
    const { setRole } = useWorkflow();
    const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [userStatus, setUserStatus] = useState<UserType['status'] | null>(null);

    const handleAction = async () => {
        setIsLoading(true);
        setAuthError('');

        if (authMode === 'SIGN_UP') {
            // Simulate sign-up
            setTimeout(() => {
                setIsPending(true);
                setIsLoading(false);
            }, 1500);
        } else {
            // Sign-in flow with user authentication
            try {
                const user = await authenticateUser(email, password);

                if (!user) {
                    setAuthError('Invalid email or password');
                    setIsLoading(false);
                    return;
                }

                // Check user status
                if (user.status === 'PENDING') {
                    setUserStatus('PENDING');
                    setIsLoading(false);
                    return;
                }

                if (user.status === 'DECLINED') {
                    setUserStatus('DECLINED');
                    setIsLoading(false);
                    return;
                }

                // User is approved - proceed to dashboard
                if (user.status === 'APPROVED' || user.status === 'INVITED') {
                    // Store user data in context/session (simplified for demo)
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Set role in workflow context
                    setRole(user.role as Role);

                    // Redirect based on role
                    if (user.role === 'SAAS_ADMIN') {
                        router.push('/admin');
                    } else {
                        router.push('/dashboard');
                    }
                }
            } catch (error) {
                setAuthError('An error occurred. Please try again.');
                setIsLoading(false);
            }
        }
    };

    const roles = [
        { id: 'EXPORTER_ADMIN', label: 'Exporter Admin', icon: <ShieldCheck size={20} />, desc: 'Primary organizational control' },
        { id: 'EXPORT_MANAGER', label: 'Export Manager', icon: <FolderKanban size={20} />, desc: 'Logistics & documentation' },
        { id: 'CHA', label: 'Licensed CHA', icon: <Stamp size={20} />, desc: 'Customs Filing & Compliance' },
        { id: 'FINANCE', label: 'Finance User', icon: <User size={20} />, desc: 'Payments & Treasury' },
    ];

    if (isPending) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden text-center">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
                    <div className="absolute inset-0 compliance-grid opacity-10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-xl p-8 glass-panel rounded-[3rem] shadow-2xl"
                >
                    <div className="h-24 w-24 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-inner border border-blue-600/10">
                        <Sparkles size={48} className="animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Submitted</h2>
                    <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
                        Your enterprise workspace is being provisioned. Our compliance team will review your application within 24 hours.
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl text-left">
                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Step 1: Compliance Check</p>
                                <p className="text-xs text-slate-400 font-bold">Standard KYC & Entity validation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl text-left opacity-50">
                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Step 2: Role Assignment</p>
                                <p className="text-xs text-slate-400 font-bold">Admin will assign your organizational roles</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsPending(false)}
                        className="h-16 w-full rounded-2xl font-black text-lg border-2"
                    >
                        Back to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Abstract Motion */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
                <div className="absolute inset-0 compliance-grid opacity-10" />
            </div>

            <div className="relative z-10 w-full max-w-xl p-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-xl font-bold mb-4 shadow-xl shadow-indigo-500/30">
                        E
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        {authMode === 'SIGN_IN' ? 'Welcome back to Eximley' : 'Join the Global Trade OS'}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        {authMode === 'SIGN_IN' ? 'Enter your credentials to access your workspace' : 'Create your enterprise account in seconds'}
                    </p>
                </div>

                <motion.div
                    layout
                    className="glass-panel p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={authMode}
                            initial={{ opacity: 0, x: authMode === 'SIGN_IN' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: authMode === 'SIGN_IN' ? 20 : -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="space-y-6">
                                {authMode === 'SIGN_UP' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                                                <input className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="Global Trade Inc." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                            <div className="relative group">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                                                <input className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" placeholder="India" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {authError && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <AlertCircle size={18} className="text-red-600" />
                                        <p className="text-sm font-bold text-red-700">{authError}</p>
                                    </div>
                                )}

                                {/* User Status Messages */}
                                {userStatus === 'PENDING' && (
                                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-black text-amber-900 mb-1">Application Under Review</p>
                                                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                                    Your application is currently being reviewed by our team. You'll receive an email once your account is approved.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setUserStatus(null);
                                                setEmail('');
                                                setPassword('');
                                            }}
                                            className="w-full h-12 border-2 border-amber-200 rounded-xl font-black text-sm hover:bg-amber-100"
                                        >
                                            Back to Login
                                        </Button>
                                    </div>
                                )}

                                {userStatus === 'DECLINED' && (
                                    <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <AlertCircle size={20} className="text-red-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-black text-red-900 mb-1">Application Declined</p>
                                                <p className="text-xs text-red-700 font-medium leading-relaxed">
                                                    Unfortunately, your application was not approved. Please contact support for more information.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setUserStatus(null);
                                                setEmail('');
                                                setPassword('');
                                            }}
                                            className="w-full h-12 border-2 border-red-200 rounded-xl font-black text-sm hover:bg-red-100"
                                        >
                                            Back to Login
                                        </Button>
                                    </div>
                                )}

                                {/* Only show submit button if no status message */}
                                {!userStatus && (
                                    <Button
                                        size="lg"
                                        onClick={handleAction}
                                        disabled={isLoading || !email || !password}
                                        className={cn(
                                            "w-full h-12 rounded-xl text-base font-black shadow-xl transition-all active:scale-[0.98]",
                                            isLoading ? "bg-slate-100 text-transparent" : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/30"
                                        )}
                                    >
                                        {isLoading ? "" : authMode === 'SIGN_IN' ? 'Sign In' : 'Submit Application'}
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="h-6 w-6 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </motion.div >
                    </AnimatePresence >

                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <button
                            onClick={() => setAuthMode(authMode === 'SIGN_IN' ? 'SIGN_UP' : 'SIGN_IN')}
                            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            {authMode === 'SIGN_IN' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>

                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                            <Sparkles size={12} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secured by Antigravity v4.0</span>
                        </div>
                    </div>
                </motion.div >

                <p className="mt-8 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Enterprise Trade Operating System
                </p>
            </div >
        </div >
    );
}
