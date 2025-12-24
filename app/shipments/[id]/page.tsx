"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useWorkflow } from '@/context/WorkflowContext';
import { Timeline } from '@/components/workflow/Timeline';
import { ShipmentHeader } from '@/components/workflow/ShipmentHeader';
import { ActionPanel } from '@/components/workflow/ActionPanel';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShipmentPage() {
    const { id } = useParams();
    const { shipments } = useWorkflow();

    const shipment = shipments.find(s => s.id === id);

    if (!shipment) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-400">Shipment not found</h2>
                <Link href="/dashboard" className="text-blue-600 hover:underline mt-4">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Back Button */}
            <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-800 transition-colors mb-6 group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <ShipmentHeader shipment={shipment} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative items-start">

                {/* Left: Timeline - Sticky */}
                <div className="md:col-span-4 lg:col-span-3 sticky top-24">
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-100">
                        <Timeline currentStatus={shipment.status} />
                    </div>
                </div>

                {/* Right: Action Panel */}
                <div className="md:col-span-8 lg:col-span-9">
                    <ActionPanel shipment={shipment} />

                    {/* Audit Log / History Preview */}
                    <div className="mt-8 px-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Activity Log</h4>
                        <div className="space-y-4 border-l-2 border-slate-100 pl-4">
                            {shipment.history.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
                            ) : (
                                shipment.history.map((entry, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="font-medium text-slate-800">{entry.action}</p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(entry.timestamp).toLocaleTimeString()} by <span className="text-slate-600">{entry.role.replace('_', ' ')}</span>
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
