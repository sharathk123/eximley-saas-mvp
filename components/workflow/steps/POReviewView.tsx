import React from 'react';
import { Shipment } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2 } from 'lucide-react';

interface POReviewViewProps {
    shipment: Shipment;
    onAction: (shipmentId: string, newState: any, action: string) => void;
}

export function POReviewView({ shipment, onAction }: POReviewViewProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <FileText size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                    <div>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/30">
                            Incoming Request
                        </span>
                        <h3 className="text-2xl font-black mt-4 tracking-tight uppercase">Purchase Order Received</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                            The buyer has sent a formal Purchase Order (PO) referencing the quotation. Please review the document to ensure terms match.
                        </p>
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <FileText size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">PO-BUYER-{shipment.id.slice(-4)}</p>
                                <p className="text-xs text-indigo-200 mt-1">Received today • PDF Document</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-indigo-300 hover:text-white hover:bg-white/10">
                                View
                            </Button>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                        onClick={() => onAction(shipment.id, 'PI_APPROVED', 'Acknowledged PO and Generated PI')}
                    >
                        Acknowledge & Generate PI
                    </Button>
                </div>
            </div>
        </div>
    );
}
