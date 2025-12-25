"use client";

import React, { useState } from 'react';
import { Shipment, ImportShipment, Role, getProgressPercentage } from '@/lib/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, ShieldCheck, Zap, AlertTriangle, Clock, FileCheck, MessageCircle } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
// New Imports
import { SupplierPIReview } from './steps/import/SupplierPIReview';
import { ImportPaymentView } from './steps/import/ImportPaymentView';
import { BillOfEntryView } from './steps/import/BillOfEntryView';
import { ImportEnquiryView } from './steps/import/ImportEnquiryView';
import { ImportQuoteReceivedView } from './steps/import/ImportQuoteReceivedView';
import { SmartDocumentUpload } from './SmartDocumentUpload';
import { ProcurementView } from './steps/ProcurementView'; // New
import { POReviewView } from './steps/POReviewView'; // New
import { ImportDocsView } from './steps/import/ImportDocsView'; // New

interface ActionPanelProps {
    shipment: Shipment | ImportShipment;
}

export function ActionPanel({ shipment }: ActionPanelProps) {
    const { currentRole, updateShipmentStatus, setShipments } = useWorkflow();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingMessage, setThinkingMessage] = useState('');

    const progress = getProgressPercentage(shipment.status);

    const handleUpdateStatus = async (shipmentId: string, newState: any, action: string) => {
        setIsThinking(true);
        setThinkingMessage(`AI is validating ${newState.replace('_', ' ')} logic...`);

        // Dynamic thinking messages based on state
        const messages: Record<string, string> = {
            'PI_APPROVED': 'Cross-referencing commercial terms with product catalog...',
            'PAYMENT_CONFIRMED': 'Verifying SWIFT/Bank remittance with ledger patterns...',
            'SB_FILED': 'Analyzing HSN compatibility for ICEGATE submission...',
            'BL_APPROVED': 'Checking Bill of Lading parity with Packing List...',
            // Import messages
            'IMPORT_PI_APPROVED': 'Validating supplier PI against purchase order...',
            'IMPORT_BOE_FILED': 'Checking HSN codes and duty structure for Bill of Entry...',
            'IMPORT_DUTY_PAID': 'Verifying duty payment with customs gateway...'
        };

        if (messages[newState]) setThinkingMessage(messages[newState]);

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
        updateShipmentStatus(shipmentId, newState, action);
        setIsThinking(false);
    };

    // Helper to simulate buyer/supplier acceptance
    const simulateCounterpartyAcceptance = () => {
        const isImport = shipment.status.startsWith('IMPORT');
        const counterparty = isImport ? 'SUPPLIER' : 'BUYER';
        const acceptanceMessage = {
            id: `msg-acc-${Date.now()}`,
            sender: counterparty as any,
            content: isImport
                ? "We confirm the order terms and accept the Purchase Order."
                : "Dear Team,\n\nWe are pleased to confirm acceptance of your quotation. Please proceed with the **Proforma Invoice** at the earliest.\n\nRegards,\nBerlin Trading GmbH",
            timestamp: new Date().toISOString()
        };

        setShipments((prev: any[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: isImport ? 'IMPORT_QUOTE_ACCEPTED' : 'QUOTE_ACCEPTED',
                    messages: [...s.messages, acceptanceMessage],
                    history: [
                        ...s.history,
                        {
                            state: isImport ? 'IMPORT_QUOTE_ACCEPTED' : 'QUOTE_ACCEPTED',
                            timestamp: new Date().toISOString(),
                            actor: isImport ? (s as unknown as ImportShipment).supplier : (s as Shipment).buyer,
                            role: counterparty as any,
                            action: 'Accepted Quotation'
                        }
                    ]
                } as any;
            }
            return s;
        }));
    };

    // Helper to simulate counterparty rejection
    const simulateCounterpartyRejection = (reason: string) => {
        const isImport = shipment.status.startsWith('IMPORT');
        const counterparty = isImport ? 'SUPPLIER' : 'BUYER';

        const rejectionMessage = {
            id: `msg-rej-${Date.now()}`,
            sender: counterparty as any,
            content: `We regret to inform you that we cannot proceed with this enquiry/quotation at this time.\n\n**Reason:** ${reason}`,
            timestamp: new Date().toISOString()
        };

        setShipments((prev: any[]) => prev.map(s => {
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
                            actor: isImport ? (s as unknown as ImportShipment).supplier : (s as Shipment).buyer,
                            role: counterparty as any,
                            action: `Rejected: ${reason}`
                        }
                    ]
                } as any;
            }
            return s;
        }));
    };

    // Helper to simulate counter-offer
    const simulateCounterOffer = () => {
        const isImport = shipment.status.startsWith('IMPORT');
        const counterparty = isImport ? 'SUPPLIER' : 'BUYER';

        const counterMessage = {
            id: `msg-counter-${Date.now()}`,
            sender: counterparty as any,
            content: isImport
                ? "We can offer a 5% discount if you increase quantity by 20%."
                : "Thank you for your quotation. Could you please revise the price to **USD 10.50 per unit FOB** and confirm delivery within **30 days**?",
            timestamp: new Date().toISOString()
        };

        setShipments((prev: any[]) => prev.map(s => {
            if (s.id === shipment.id) {
                return {
                    ...s,
                    status: isImport ? 'IMPORT_NEGOTIATION' : 'NEGOTIATION',
                    messages: [...s.messages, counterMessage],
                    history: [
                        ...s.history,
                        {
                            state: isImport ? 'IMPORT_NEGOTIATION' : 'NEGOTIATION',
                            timestamp: new Date().toISOString(),
                            actor: isImport ? (s as unknown as ImportShipment).supplier : (s as Shipment).buyer,
                            role: counterparty as any,
                            action: 'Received Counter-Offer'
                        }
                    ]
                } as any;
            }
            return s;
        }));
    };

    // Helper to simulate expiry
    const simulateExpiry = () => {
        const expiryMessage = {
            id: `msg-expiry-${Date.now()}`,
            sender: 'EXPORTER' as const, // Or Importer
            content: `System Notification: Quotation has expired as of ${new Date().toLocaleDateString()}. Negotiation is paused.`,
            timestamp: new Date().toISOString()
        };

        setShipments((prev: any[]) => prev.map(s => {
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
                } as any;
            }
            return s;
        }));
    };

    // Render Dynamic Content based on State
    const renderContent = () => {
        switch (shipment.status) {
            // === EXPORT FLOW ===
            case 'ENQUIRY_RECEIVED':
            case 'NEGOTIATION':
            case 'QUOTE_EXPIRED':
                if (showReplyForm) {
                    return (
                        <ReplyQuotationView
                            shipment={shipment as Shipment}
                            isRevision={shipment.status === 'NEGOTIATION' || shipment.status === 'QUOTE_EXPIRED'}
                            onBack={() => setShowReplyForm(false)}
                            onSend={(data) => {
                                const quotationId = `QT-${shipment.id}-${Date.now().toString().slice(-4)}`;
                                const exporterMsg = {
                                    id: `msg-rev-${Date.now()}`,
                                    sender: 'EXPORTER' as const,
                                    content: data.message,
                                    timestamp: new Date().toISOString(),
                                    attachments: [{
                                        name: `${quotationId}.pdf`,
                                        type: 'PDF',
                                        id: quotationId,
                                        url: data.pdfUrl // Passing the data URL
                                    }]
                                };

                                setShipments((prev: any[]) => prev.map(s => {
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
                                                    action: `Sent AI Quotation ${quotationId} for $${data.price}/${data.unit}`
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
                            shipment={shipment as Shipment}
                            onReply={() => setShowReplyForm(true)}
                        />
                        <Button
                            variant="ghost"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold"
                            onClick={() => simulateCounterpartyRejection("Pricing exceeds our current budget for this project.")}
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
                            <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-wider mb-2">Acceptance</h3>
                                    <p className="text-[10px] text-indigo-50 leading-tight mb-4 font-bold">Confirm deal terms and proceed.</p>
                                    <Button
                                        size="sm"
                                        className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black text-[10px] rounded-xl"
                                        onClick={simulateCounterpartyAcceptance}
                                    >
                                        Accept Deal
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group border border-white/5">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-wider mb-2">Negotiation</h3>
                                    <p className="text-[10px] text-slate-400 leading-tight mb-4 font-bold">Request revisions or counter.</p>
                                    <Button
                                        size="sm"
                                        className="w-full bg-slate-800 text-white hover:bg-slate-700 font-black text-[10px] rounded-xl"
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
                                onClick={() => simulateCounterpartyRejection("Terms not acceptable.")}
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
                            This process has been rejected. No further operational actions are permitted in this thread.
                        </p>
                        <div className="pt-4 border-t border-red-200 mt-6">
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">History Log</p>
                            <div className="text-[11px] text-red-600 font-medium italic">
                                "{shipment.messages[shipment.messages.length - 1]?.content.split('**Reason:** ')[1] || 'Reason not specified'}"
                            </div>
                        </div>
                    </div>
                );

            case 'PO_RECEIVED':
                return (
                    <POReviewView
                        shipment={shipment as Shipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'QUOTE_ACCEPTED':
                return (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                <FileCheck size={120} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                                        Action Required
                                    </span>
                                    <h3 className="text-2xl font-black mt-4 tracking-tight uppercase">Generate Proforma Invoice</h3>
                                    <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                                        The buyer has formally accepted the quotation. You are now authorized to generate the Proforma Invoice (PI).
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                                    onClick={() => handleUpdateStatus(shipment.id, 'PI_APPROVED', 'Generated Proforma Invoice')}
                                >
                                    Create Proforma Invoice
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 'QUOTE_DRAFT':
                return <QuoteApprovalView shipment={shipment as Shipment} />;

            case 'PI_APPROVED':
                return (
                    <div className="space-y-6">
                        <StandardActionView
                            shipment={shipment}
                            nextState="INSURANCE_FILED"
                            actionLabel="Obtain Marine Insurance"
                            role={['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN']}
                            onAction={handleUpdateStatus}
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
                                        onClick={() => setShipments((prev: any[]) => prev.map(s => s.id === shipment.id ? { ...s, chaMode: 'EMBEDDED' } : s))}
                                    >
                                        EMBEDDED
                                    </button>
                                    <button
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                            shipment.chaMode === 'MANUAL' ? "bg-white text-blue-600 shadow-sm" : "text-blue-400 hover:text-blue-500"
                                        )}
                                        onClick={() => setShipments((prev: any[]) => prev.map(s => s.id === shipment.id ? { ...s, chaMode: 'MANUAL' } : s))}
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

            // Procurement Stages
            case 'PROCUREMENT_INITIATED':
            case 'SUPPLIER_SELECTED':
            case 'SUPPLIER_PO_SENT':
            case 'GOODS_IN_TRANSIT':
            case 'GOODS_RECEIVED':
            case 'QUALITY_CHECK_PASSED':
                return (
                    <ProcurementView
                        shipment={shipment as Shipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'INSURANCE_FILED':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="ECGC_COVER_OBTAINED"
                        actionLabel="Secure ECGC Cover"
                        role={['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'ECGC_COVER_OBTAINED':
                return (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-blue-600" />
                                Review Inward Remittance
                            </h3>
                            <div className="h-[350px]">
                                <SmartDocumentUpload
                                    title="Upload FIRC / Bank Advice"
                                    documentType="SWIFT"
                                    onExtractionComplete={(data) => {
                                        console.log('FIRC Data:', data);
                                        // Auto-confirm for prototype
                                        handleUpdateStatus(shipment.id, 'PAYMENT_CONFIRMED', 'Payment verified via FIRC');
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-2">Or verify manually</p>
                            <StandardActionView
                                shipment={shipment}
                                nextState="PAYMENT_CONFIRMED"
                                actionLabel="Confirm Advance Payment (Manual)"
                                role="FINANCE"
                                onAction={handleUpdateStatus}
                            />
                        </div>
                    </div>
                );

            case 'PAYMENT_CONFIRMED':
            case 'CI_PL_APPROVED':
                return <DocumentView shipment={shipment as Shipment} />;

            case 'SB_PENDING_CHA':
            case 'SB_FILED':
                return <ShippingBillView shipment={shipment as Shipment} />;

            case 'LEO_GRANTED':
            case 'BL_APPROVED':
                return <BillOfLadingView shipment={shipment as Shipment} />;

            case 'FINANCIAL_RECONCILIATION':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="CLOSED"
                        actionLabel="Complete Final Reconciliation"
                        role="FINANCE"
                        onAction={handleUpdateStatus}
                    />
                );

            // === IMPORT FLOW ===
            case 'IMPORT_ENQUIRY_SENT':
                return (
                    <ImportEnquiryView
                        shipment={shipment as ImportShipment}
                        onReply={() => console.log('Reply to supplier')} // Placeholder handler
                    />
                );

            case 'IMPORT_QUOTE_RECEIVED':
                return (
                    <ImportQuoteReceivedView
                        shipment={shipment as ImportShipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_NEGOTIATION':
                return (
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
                        <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4 scrollbar-hide">
                            <ConversationThread messages={shipment.messages} />
                        </div>
                        <div className="flex gap-2">
                            <Button size="lg" className="flex-1 bg-indigo-600" onClick={simulateCounterpartyAcceptance}>
                                Accept Supplier Quote
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1" onClick={simulateCounterOffer}>
                                Negotiate
                            </Button>
                        </div>
                    </div>
                );

            case 'IMPORT_QUOTE_ACCEPTED':
                return (
                    <SupplierPIReview
                        shipment={shipment as ImportShipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_PI_APPROVED':
                return (
                    <ImportPaymentView
                        shipment={shipment as ImportShipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_PAYMENT_SENT':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_INSURANCE_FILED"
                        actionLabel="File Import Insurance"
                        role={['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_INSURANCE_FILED':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_COMPLIANCE_CHECK"
                        actionLabel="Verify Compliance"
                        role={['COMPANY_EXPORT_ANALYST']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_COMPLIANCE_CHECK':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_GOODS_SHIPPED"
                        actionLabel="Confirm Goods Shipped"
                        role={['COMPANY_EXPORT_ANALYST']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_GOODS_SHIPPED':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_IN_TRANSIT"
                        actionLabel="Update Tracking: In Transit"
                        role={['COMPANY_EXPORT_ANALYST']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_IN_TRANSIT':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_ARRIVED_PORT"
                        actionLabel="Mark Arrived at Port"
                        role={['COMPANY_EXPORT_ANALYST', 'CHA']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_ARRIVED_PORT':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_DOCS_RECEIVED"
                        actionLabel="Confirm Arrival & Docs"
                        role={['COMPANY_EXPORT_ANALYST', 'CHA']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_DOCS_RECEIVED':
                return (
                    <ImportDocsView
                        shipment={shipment as ImportShipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_BOE_FILED':
                return (
                    <BillOfEntryView
                        shipment={shipment as ImportShipment}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_CUSTOMS_ASSESSMENT':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_DUTY_PAID"
                        actionLabel="Pay Import Duty"
                        role={['COMPANY_ADMIN', 'FINANCE']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_DUTY_PAID':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_CUSTOMS_CLEARANCE"
                        actionLabel="Confirm Customs Clearance"
                        role={['CHA']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_CUSTOMS_CLEARANCE':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_GOODS_RECEIVED"
                        actionLabel="Confirm Goods Received at Warehouse"
                        role={['COMPANY_EXPORT_ANALYST']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_GOODS_RECEIVED':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_QUALITY_CHECK"
                        actionLabel="Complete Quality Check"
                        role={['COMPANY_EXPORT_ANALYST']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_QUALITY_CHECK':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_RECONCILIATION"
                        actionLabel="Start Financial Reconciliation"
                        role={['FINANCE', 'COMPANY_ADMIN']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'IMPORT_RECONCILIATION':
                return (
                    <StandardActionView
                        shipment={shipment}
                        nextState="IMPORT_CLOSED"
                        actionLabel="Close Import Cycle"
                        role={['COMPANY_ADMIN']}
                        onAction={handleUpdateStatus}
                    />
                );

            case 'ESCALATED':
                return (
                    <div className="p-8 text-center space-y-6 bg-amber-50 rounded-3xl border border-amber-100 animate-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                            <AlertTriangle size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tight">Escalation Managed</h3>
                            <p className="text-sm text-amber-700 max-w-xs mx-auto mt-2 font-medium">
                                High-priority intervention is active. Administrators are resolving the identified bottleneck.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-amber-900/10 uppercase tracking-widest text-xs"
                            onClick={() => handleUpdateStatus(shipment.id, 'CLOSED', 'Resolved Escalation & Closed')}
                        >
                            Mark Escalation Resolved
                        </Button>
                    </div>
                );

            case 'CLOSED':
            case 'IMPORT_CLOSED':
                return <FinanceView shipment={shipment as Shipment} />;

            case 'CUSTOMS_QUERY':
                return (
                    <div className="space-y-6">
                        <CustomsQueryView shipment={shipment as Shipment} />
                        <Button
                            variant="ghost"
                            className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-[10px] font-black uppercase tracking-widest gap-2"
                            onClick={() => handleUpdateStatus(shipment.id, 'ESCALATED', 'Escalated due to Customs Query delay')}
                        >
                            <AlertTriangle size={12} />
                            Escalate this Query
                        </Button>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <p>Action view for {shipment.status} is pending configuration.</p>
                        <StandardActionView
                            shipment={shipment}
                            nextState={shipment.status}
                            actionLabel="Manual Step (Prototype)"
                            role="COMPANY_ADMIN"
                            onAction={() => console.log('Placeholder Action')}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="float-panel rounded-2xl min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Header Strip & Progress */}
            <div className="relative group/progress">
                <div className="h-1.5 w-full bg-slate-100 relative overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                            "h-full transition-colors duration-500",
                            shipment.status === 'REJECTED' ? "bg-red-500" :
                                shipment.status === 'ESCALATED' ? "bg-amber-500" :
                                    "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
                        )}
                    />
                </div>

                {/* Progress Hub */}
                <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px]",
                            shipment.status === 'REJECTED' ? "bg-red-500 shadow-red-500/50" :
                                shipment.status === 'ESCALATED' ? "bg-amber-500 shadow-amber-500/50" :
                                    "bg-indigo-500 shadow-indigo-500/50"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shipment Maturity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-800 tracking-tight">{progress}%</span>
                        <div className="h-4 w-px bg-slate-200" />
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            shipment.status === 'REJECTED' ? "text-red-600" :
                                shipment.status === 'ESCALATED' ? "text-amber-600" :
                                    "text-indigo-600"
                        )}>
                            {shipment.status === 'CLOSED' || shipment.status === 'IMPORT_CLOSED' ? 'Completed' :
                                shipment.status === 'ESCALATED' ? 'Attention' :
                                    shipment.status === 'REJECTED' ? 'Terminated' : 'Operational'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thinking Overlay */}
            <AnimatePresence>
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="relative">
                            <div className="h-20 w-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap size={24} className="text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="mt-8 text-lg font-black text-slate-900 tracking-tight">AI Agent Working</h3>
                        <p className="mt-2 text-sm text-slate-500 font-medium max-w-xs">{thinkingMessage}</p>

                        <div className="mt-12 flex gap-1">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="h-1 shadow-indigo-600 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 p-6">
                {renderContent()}
            </div>
        </div>
    );
}

// Simple fallback view for steps that are just a button press in this prototype
function StandardActionView({ shipment, nextState, actionLabel, role, onAction }: any) {
    const { updateShipmentStatus, currentRole } = useWorkflow();
    const isAllowed = Array.isArray(role)
        ? role.includes(currentRole) || currentRole === 'EXPORTER_ADMIN' || currentRole === 'COMPANY_ADMIN'
        : currentRole === role || currentRole === 'EXPORTER_ADMIN' || currentRole === 'COMPANY_ADMIN';

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <CheckCircle size={40} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Pending Action</h3>
                <p className="text-slate-500">This step requires approval from {Array.isArray(role) ? role.join(' / ').replace(/_/g, ' ') : role.replace(/_/g, ' ')}.</p>
            </div>

            {isAllowed ? (
                <Button
                    size="lg"
                    className="w-full max-w-sm"
                    onClick={() => onAction ? onAction(shipment.id, nextState, actionLabel) : updateShipmentStatus(shipment.id, nextState, actionLabel)}
                >
                    {actionLabel}
                </Button>
            ) : (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Restricted Role</span>
                </div>
            )}
        </div>
    )
}
