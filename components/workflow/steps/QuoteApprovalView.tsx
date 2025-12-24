"use client";

import { ActionPanel } from '../ActionPanel';

import React from 'react';
import { Shipment, Role } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function QuoteApprovalView({ shipment }: { shipment: Shipment }) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isAllowed = currentRole === 'EXPORT_MANAGER' || currentRole === 'EXPORTER_ADMIN';

    return (
        <div className="h-full flex flex-col">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="text-blue-600" />
                        Quote #Q-2024-001
                    </h3>
                    <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">DRAFT</span>
                </div>

                <div className="space-y-4">
                    {/* Mock Quote content */}
                    <div className="flex justify-between text-sm py-2 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500">Item Total</span>
                        <span className="font-medium text-slate-800">$12,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500">Freight & Insurance</span>
                        <span className="font-medium text-slate-800">$500.00</span>
                    </div>
                    <div className="flex justify-between text-lg py-2 font-bold">
                        <span className="text-slate-800">Grand Total</span>
                        <span className="text-blue-600">$12,500.00</span>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
                    <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-800">AI Margin Analysis</p>
                        <p className="text-xs text-blue-600 mt-1">
                            Profit margin is <strong>22%</strong>, which is above the 18% threshold for this category. Recommended to approve.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex justify-end gap-4">
                <Button variant="outline">Edit Quote</Button>
                <Button
                    disabled={!isAllowed}
                    onClick={() => updateShipmentStatus(shipment.id, 'QUOTE_ACCEPTED', 'Approved Quote')}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isAllowed ? "Approve Quote" : "Waiting for Export Manager"}
                </Button>
            </div>
        </div>
    );
}
