"use client";

import React, { useState } from 'react';
import { Shipment, Role } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuoteApprovalView } from './steps/QuoteApprovalView';
import { DocumentView } from './steps/DocumentView';
import { ShippingBillView } from './steps/ShippingBillView';
import { CustomsQueryView } from './steps/CustomsQueryView';
import { BillOfLadingView } from './steps/BillOfLadingView';
import { FinanceView } from './steps/FinanceView';
import { EnquiryDetailView } from './steps/EnquiryDetailView';
import { ReplyQuotationView } from './steps/ReplyQuotationView';
import { ConversationThread } from './ConversationThread';
import { Sparkles, MessageCircle, FileCheck, Clock, AlertTriangle } from 'lucide-react';

interface ActionPanelProps {
    shipment: Shipment;
}

export function ActionPanel({ shipment }: ActionPanelProps) {
    const { currentRole, updateShipmentStatus, setShipments } = useWorkflow();
    const [showReplyForm, setShowReplyForm] = useState(false);

    // Helper to check if current role can act
    // For prototype, we map the current state to the allowed roles defined in WORKFLOW_STEPS
    // But we can also look up permissions directly

    // Helper to simulate buyer acceptance
    const simulateBuyerAcceptance = () => {
        const acceptanceMessage = {
            id: `msg-acc-${Date.now()}`,
            sender: 'BUYER' as const,
            content: "Dear Team,\n\nWe are pleased to confirm acceptance of your quotation. Please proceed with the **Proforma Invoice** at the earliest.\n\nRegards,\nBerlin Trading GmbH",
            timestamp: new Date().toISOString()
        };

        setShipments((prev: Shipment[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: 'QUOTE_ACCEPTED' as const,
                    messages: [...s.messages, acceptanceMessage],
                    history: [
                        ...s.history,
                        {
                            state: 'QUOTE_ACCEPTED' as const,
                            timestamp: new Date().toISOString(),
                            actor: shipment.buyer,
                            role: 'BUYER' as any,
                            action: 'Accepted Quotation'
                        }
                    ]
                };
            }
            return s;
        }));
    };

    // Helper to simulate buyer rejection
    const simulateBuyerRejection = (reason: string) => {
        const rejectionMessage = {
            id: `msg-rej-${Date.now()}`,
            sender: 'BUYER' as const,
            content: `We regret to inform you that we cannot proceed with this enquiry/quotation at this time.\n\n**Reason:** ${reason}`,
            timestamp: new Date().toISOString()
        };

        setShipments((prev: Shipment[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: 'REJECTED' as const,
                    messages: [...s.messages, rejectionMessage],
                    history: [
                        ...s.history,
                        {
                            state: 'REJECTED' as const,
                            timestamp: new Date().toISOString(),
                            actor: shipment.buyer,
                            role: 'BUYER' as any,
                            action: `Rejected: ${reason}`
                        }
                    ]
                };
            }
            return s;
        }));
    };

    // Helper to simulate counter-offer
    const simulateCounterOffer = () => {
        const counterMessage = {
            id: `msg-counter-${Date.now()}`,
            sender: 'BUYER' as const,
            content: "Thank you for your quotation. Could you please revise the price to **USD 10.50 per unit FOB** and confirm delivery within **30 days**?",
            timestamp: new Date().toISOString()
        };

        setShipments((prev: Shipment[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: 'NEGOTIATION' as const,
                    messages: [...s.messages, counterMessage],
                    history: [
                        ...s.history,
                        {
                            state: 'NEGOTIATION' as const,
                            timestamp: new Date().toISOString(),
                            actor: shipment.buyer,
                            role: 'BUYER' as any,
                            action: 'Received Counter-Offer'
                        }
                    ]
                };
            }
            return s;
        }));
    };

    // Helper to simulate expiry
    const simulateExpiry = () => {
        const expiryMessage = {
            id: `msg-expiry-${Date.now()}`,
            sender: 'EXPORTER' as const,
            content: `System Notification: Quotation QT-001 has expired as of ${new Date().toLocaleDateString()}. Negotiation is paused.`,
            timestamp: new Date().toISOString()
        };

        setShipments((prev: Shipment[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: 'QUOTE_EXPIRED' as const,
                    messages: [...s.messages, expiryMessage],
                    history: [
                        ...s.history,
                        {
                            state: 'QUOTE_EXPIRED' as const,
                            timestamp: new Date().toISOString(),
                            actor: 'System',
                            role: 'EXPORTER_ADMIN',
                            action: 'Quotation Expired'
                        }
                    ]
                };
            }
            return s;
        }));
    };

    // Render Dynamic Content based on State
    const renderContent = () => {
        switch (shipment.status) {
            case 'ENQUIRY_RECEIVED':
            case 'NEGOTIATION':
            case 'QUOTE_EXPIRED':
                if (showReplyForm) {
                    return (
                        <ReplyQuotationView
                            shipment={shipment}
                            isRevision={shipment.status === 'NEGOTIATION' || shipment.status === 'QUOTE_EXPIRED'}
                            onBack={() => setShowReplyForm(false)}
                            onSend={(data) => {
                                const exporterMsg = {
                                    id: `msg-rev-${Date.now()}`,
                                    sender: 'EXPORTER' as const,
                                    content: data.message,
                                    timestamp: new Date().toISOString(),
                                    attachments: [{ name: 'Quotation QT-002', type: 'PDF', id: 'qt-002' }]
                                };

                                setShipments((prev: Shipment[]) => prev.map(s => {
                                    if (s.id === shipment.id) {
                                        return {
                                            ...s,
                                            status: 'QUOTE_SENT' as const,
                                            value: `$${data.price} per ${data.unit}`,
                                            messages: [...s.messages, exporterMsg],
                                            history: [
                                                ...s.history,
                                                {
                                                    state: 'QUOTE_SENT' as const,
                                                    timestamp: new Date().toISOString(),
                                                    actor: 'Demo User',
                                                    role: 'EXPORTER_ADMIN',
                                                    action: `Sent Revised Quotation for $${data.price}/${data.unit}`
                                                }
                                            ]
                                        };
                                    }
                                    return s;
                                }));
                                setShowReplyForm(false);
                            }}
                        />
                    );
                }
                return (
                    <div className="space-y-6">
                        <EnquiryDetailView
                            shipment={shipment}
                            onReply={() => setShowReplyForm(true)}
                        />
                        <Button
                            variant="ghost"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold"
                            onClick={() => simulateBuyerRejection("Pricing exceeds our current budget for this project.")}
                        >
                            <AlertTriangle size={14} className="mr-2" />
                            Simulate Buyer Rejection
                        </Button>
                    </div>
                );

            case 'QUOTE_SENT':
                return (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Negotiation</h4>
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                                <Clock size={10} className="text-blue-600" />
                                <span className="text-[9px] font-bold text-slate-600 uppercase">Valid until: 15 May 2025</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4 scrollbar-hide">
                            <ConversationThread messages={shipment.messages} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Acceptance</h3>
                                    <p className="text-[10px] text-blue-50 leading-tight mb-4">Confirm deal terms.</p>
                                    <Button
                                        size="sm"
                                        className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-[10px]"
                                        onClick={simulateBuyerAcceptance}
                                    >
                                        Accept Deal
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Negotiation</h3>
                                    <p className="text-[10px] text-slate-400 leading-tight mb-4">Request revisions.</p>
                                    <Button
                                        size="sm"
                                        className="w-full bg-slate-800 text-white hover:bg-slate-700 font-bold text-[10px]"
                                        onClick={simulateCounterOffer}
                                    >
                                        Counter-Offer
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-slate-200 text-slate-600 text-[10px] font-bold h-10 rounded-xl"
                                onClick={simulateExpiry}
                            >
                                <Clock size={14} className="mr-2" />
                                Simulate Expiry
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-red-100 text-red-600 hover:bg-red-50 text-[10px] font-bold h-10 rounded-xl"
                                onClick={() => simulateBuyerRejection("Terms not acceptable.")}
                            >
                                <AlertTriangle size={14} className="mr-2" />
                                Reject
                            </Button>
                        </div>
                    </div>
                );

            case 'REJECTED':
                return (
                    <div className="p-8 text-center space-y-4 bg-red-50 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-500">
                        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-red-900">Workflow Terminated</h3>
                        <p className="text-sm text-red-700 max-w-xs mx-auto">
                            This enquiry has been rejected by the buyer. No further operational actions are permitted in this thread.
                        </p>
                        <div className="pt-4 border-t border-red-200 mt-6">
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">History Log</p>
                            <div className="text-[11px] text-red-600 font-medium italic">
                                "{shipment.messages[shipment.messages.length - 1]?.content.split('**Reason:** ')[1]}"
                            </div>
                        </div>
                    </div>
                );

            case 'QUOTE_ACCEPTED':
                return (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileCheck size={100} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/30">
                                        Action Required
                                    </span>
                                    <h3 className="text-2xl font-bold mt-4 tracking-tight">Generate Proforma Invoice</h3>
                                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                        The buyer has formally accepted the quotation. You are now authorized to generate the Proforma Invoice (PI).
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98]"
                                    onClick={() => updateShipmentStatus(shipment.id, 'PI_APPROVED', 'Generated Proforma Invoice')}
                                >
                                    Create Proforma Invoice
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 'QUOTE_DRAFT':
                return <QuoteApprovalView shipment={shipment} />;

            case 'PI_APPROVED':
                return (
                    <div className="space-y-6">
                        <StandardActionView
                            shipment={shipment}
                            nextState="PAYMENT_CONFIRMED"
                            actionLabel="Confirm Advance Payment"
                            role="FINANCE"
                        />
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
                            <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ShieldCheck size={12} />
                                Logistics Strategy
                            </h5>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-blue-800 font-medium">CHA Operational Mode:</span>
                                <div className="flex bg-blue-100 p-0.5 rounded-lg border border-blue-200">
                                    <button
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                            shipment.chaMode === 'EMBEDDED' ? "bg-white text-blue-600 shadow-sm" : "text-blue-400 hover:text-blue-500"
                                        )}
                                        onClick={() => setShipments((prev: Shipment[]) => prev.map(s => s.id === shipment.id ? { ...s, chaMode: 'EMBEDDED' } : s))}
                                    >
                                        EMBEDDED
                                    </button>
                                    <button
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                            shipment.chaMode === 'MANUAL' ? "bg-white text-blue-600 shadow-sm" : "text-blue-400 hover:text-blue-500"
                                        )}
                                        onClick={() => setShipments((prev: Shipment[]) => prev.map(s => s.id === shipment.id ? { ...s, chaMode: 'MANUAL' } : s))}
                                    >
                                        MANUAL
                                    </button>
                                </div>
                            </div>
                            <p className="text-[9px] text-blue-500 mt-2 leading-tight">
                                {shipment.chaMode === 'EMBEDDED'
                                    ? "CHA has direct access to file SB on ICEGATE via your account."
                                    : "You will manually upload SB copies received from your offline CHA."}
                            </p>
                        </div>
                    </div>
                );

            case 'PAYMENT_CONFIRMED':
            case 'CI_PL_APPROVED':
                // Document Viewer handles both AI generation and Approval states
                return <DocumentView shipment={shipment} />;

            case 'SB_PENDING_CHA':
            case 'SB_FILED':
                return <ShippingBillView shipment={shipment} />;

            case 'LEO_GRANTED':
            case 'BL_APPROVED':
                return <BillOfLadingView shipment={shipment} />;

            case 'CLOSED':
                return <FinanceView shipment={shipment} />;

            case 'CUSTOMS_QUERY':
                return <CustomsQueryView shipment={shipment} />;

            default:
                // Fallback for steps like PAYMENT_CONFIRMED if not explicitly handled
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <p>Workflow step specific UI not implemented for {shipment.status} yet.</p>
                    </div>
                );
        }
    };

    return (
        <div className="float-panel rounded-2xl min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Header Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="flex-1 p-6">
                {renderContent()}
            </div>
        </div>
    );
}

// Simple fallback view for steps that are just a button press in this prototype
function StandardActionView({ shipment, nextState, actionLabel, role }: any) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isAllowed = currentRole === role || currentRole === 'EXPORTER_ADMIN';

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <CheckCircle size={40} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Pending Action</h3>
                <p className="text-slate-500">This step requires approval from {role.replace('_', ' ')}.</p>
            </div>

            {isAllowed ? (
                <Button
                    size="lg"
                    className="w-full max-w-sm"
                    onClick={() => updateShipmentStatus(shipment.id, nextState, actionLabel)}
                >
                    {actionLabel}
                </Button>
            ) : (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Restricted to {role.replace('_', ' ')}</span>
                </div>
            )}
        </div>
    )
}
