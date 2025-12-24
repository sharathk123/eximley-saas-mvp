"use client";

import React, { useState } from 'react';
import { Shipment } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Send, ArrowRight } from 'lucide-react';

export function CustomsQueryView({ shipment }: { shipment: Shipment }) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const [replyText, setReplyText] = useState(
        "The variation in weight is due to packaging material differences for this specific batch. The net product weight remains consistent with the invoice declaration. Attached is the packing list breakdown."
    );

    const isCHA = currentRole === 'CHA';

    return (
        <div className="h-full flex flex-col">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <MessageSquare size={14} />
                    </span>
                    <h3 className="font-bold text-red-900">Customs Query Raised</h3>
                </div>
                <p className="text-sm text-red-800">
                    "Mismatch in declared gross weight vs. supporting documents. Please clarify."
                </p>
                <p className="text-xs text-red-400 mt-2 font-mono">Query ID: QRY-ICE-99281 • 2 hours ago</p>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Draft Reply</label>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        <Sparkles size={12} /> AI Suggested
                    </span>
                </div>

                <textarea
                    className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />
            </div>

            <div className="mt-6 pt-0">
                {!isCHA ? (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
                        <p className="text-sm text-slate-500 mb-2">Only CHA can submit replies to ICEGATE.</p>
                        <Button variant="outline" className="w-full" disabled>Waiting for CHA</Button>
                    </div>
                ) : (
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-md shadow-lg shadow-blue-900/20"
                        onClick={() => updateShipmentStatus(shipment.id, 'LEO_GRANTED', 'Replied to Query')}
                    >
                        <Send size={18} className="mr-2" />
                        Submit Reply & Resolve
                    </Button>
                )}
            </div>
        </div>
    );
}
