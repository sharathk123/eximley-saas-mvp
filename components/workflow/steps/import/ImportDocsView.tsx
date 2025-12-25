import React from 'react';
import { ImportShipment } from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { SmartDocumentUpload, ExtractedData } from '../../SmartDocumentUpload';
import { FileCheck } from 'lucide-react';

interface ImportDocsViewProps {
    shipment: ImportShipment;
    onAction: (shipmentId: string, newState: any, action: string) => void;
}

export function ImportDocsView({ shipment, onAction }: ImportDocsViewProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileCheck size={16} className="text-purple-600" />
                    Verify Original Documents
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                    Upload the Scan Copies of Original Bill of Lading, Invoice, and Packing List received from the supplier or bank to proceed with Customs Filing.
                </p>
                <div className="h-[350px]">
                    <SmartDocumentUpload
                        title="Upload Set of Documents"
                        documentType="GENERIC"
                        onExtractionComplete={(data: ExtractedData) => {
                            console.log('Docs Data:', data);
                            // Auto-confirm for prototype
                            onAction(shipment.id, 'IMPORT_BOE_FILED', 'Documents Verified');
                        }}
                    />
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-slate-400 mb-2">Or proceed if physical docs are with CHA</p>
                <Button
                    variant="outline"
                    className="w-full border-slate-200 text-slate-600 font-bold"
                    onClick={() => onAction(shipment.id, 'IMPORT_BOE_FILED', 'Manual Confirmation: Docs with CHA')}
                >
                    Confirm Docs Handed to CHA
                </Button>
            </div>
        </div>
    );
}
