import React, { useState } from 'react';
import { Shipment, Role } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Package, Truck, ClipboardCheck, Search, CheckCircle2, ShoppingCart, UserCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcurementViewProps {
    shipment: Shipment;
    onAction: (shipmentId: string, newState: any, action: string) => void;
}

export function ProcurementView({ shipment, onAction }: ProcurementViewProps) {
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

    const renderContent = () => {
        switch (shipment.status) {
            case 'PROCUREMENT_INITIATED':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Search size={16} className="text-blue-600" />
                                Supplier Sourcing
                            </h3>
                            <div className="space-y-3">
                                {['Global Fabrics Ltd.', 'Textile Hub India', 'Cotton Kings Exp.'].map((supplier) => (
                                    <div
                                        key={supplier}
                                        onClick={() => setSelectedSupplier(supplier)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedSupplier === supplier
                                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                : 'bg-white border-slate-100 hover:border-blue-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                    {supplier[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{supplier}</p>
                                                    <p className="text-xs text-slate-500">Verified Manufacturer • Mumbai</p>
                                                </div>
                                            </div>
                                            {selectedSupplier === supplier && <CheckCircle2 size={20} className="text-blue-600" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                            disabled={!selectedSupplier}
                            onClick={() => onAction(shipment.id, 'SUPPLIER_SELECTED', `Selected supplier: ${selectedSupplier}`)}
                        >
                            Confirm Supplier Selection
                        </Button>
                    </div>
                );

            case 'SUPPLIER_SELECTED':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center py-10">
                            <ShoppingCart size={40} className="text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">Generate Purchase Order</h3>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                                Generate and send the domestic PO to the selected supplier to initiate production.
                            </p>
                            <div className="mt-8 bg-white p-4 rounded-xl border border-slate-200 text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase">PO Preview</p>
                                <p className="font-bold text-slate-900 mt-1">PO-INT-{shipment.id}</p>
                                <p className="text-xs text-slate-500 mt-1">For: {shipment.goods}</p>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                            onClick={() => onAction(shipment.id, 'SUPPLIER_PO_SENT', 'Generated and Sent Domestic PO')}
                        >
                            Send Purchase Order
                        </Button>
                    </div>
                );

            case 'SUPPLIER_PO_SENT':
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <UserCheck size={16} />
                                Awaiting Production
                            </h3>
                            <p className="text-xs text-blue-700">
                                Supplier has acknowledged the PO. Waiting for goods readiness notification.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold"
                            onClick={() => onAction(shipment.id, 'GOODS_IN_TRANSIT', 'Supplier dispatched goods')}
                        >
                            Simulate: Goods Dispatched
                        </Button>
                    </div>
                );

            case 'GOODS_IN_TRANSIT':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center py-10">
                            <Truck size={40} className="text-amber-500 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-lg font-bold text-slate-900">Inbound Logistics</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Goods are moving from Supplier Factory to Your Warehouse.
                            </p>
                            <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 px-4">
                                <span>Factory</span>
                                <span>.............</span>
                                <span>Warehouse</span>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                            onClick={() => onAction(shipment.id, 'GOODS_RECEIVED', 'Goods received at warehouse')}
                        >
                            Confirm Goods Receipt
                        </Button>
                    </div>
                );

            case 'GOODS_RECEIVED':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ClipboardCheck size={16} className="text-purple-600" />
                                Quality Control Check
                            </h3>
                            <div className="space-y-2">
                                {['Visual Inspection', 'Quantity Verification', 'Packaging Integrity'].map((check) => (
                                    <div key={check} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <span className="text-sm font-medium text-slate-700">{check}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 font-bold"
                            onClick={() => onAction(shipment.id, 'QUALITY_CHECK_PASSED', 'QC Passed - Ready for Export')}
                        >
                            Mark QC Passed
                        </Button>
                    </div>
                );

            case 'QUALITY_CHECK_PASSED':
                return (
                    <div className="text-center py-10">
                        <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900">Ready for Export</h3>
                        <p className="text-sm text-emerald-700 mt-2 mb-8">
                            Goods are packed and ready. Proceed to generate Export Invoice.
                        </p>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                            onClick={() => onAction(shipment.id, 'CI_PL_APPROVED', 'Proceeded to Documentation')}
                        >
                            Proceed to CI/PL Generation
                        </Button>
                    </div>
                );

            default:
                return <div>Unknown State</div>;
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {renderContent()}
        </div>
    );
}
