"use client";

import React from 'react';
import { Shipment } from '@/lib/workflow';

export function DocumentTemplate({ shipment, type }: { shipment: Shipment, type: 'CI' | 'PL' }) {
    const isCI = type === 'CI';
    const docTitle = isCI ? 'COMMERCIAL INVOICE' : 'PACKING LIST';
    const docNo = isCI ? 'CI-2024-001' : 'PL-2024-001';

    return (
        <div className="font-serif text-sm">
            {/* Header */}
            <div className="flex justify-between border-b-2 border-slate-800 pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-widest">{docTitle}</h1>
                    <p className="text-slate-500 mt-1">Invoice No: <span className="text-slate-900 font-semibold">{docNo}</span></p>
                    <p className="text-slate-500">Date: <span className="text-slate-900">Dec 24, 2024</span></p>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-lg">Demo Exports Pvt Ltd</h2>
                    <p className="text-slate-500 text-xs">IEC: 0512345678 | GSTIN: 36ABCDE1234F1Z5</p>
                    <p className="text-slate-500 text-xs mt-1">
                        14/2, Industrial Hub<br /> Mumbai, India - 40001
                    </p>
                </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-slate-300 p-4">
                    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 border-b pb-1">Exporter</h3>
                    <p className="font-bold">Demo Exports Pvt Ltd</p>
                    <p className="text-slate-600">Mumbai, India</p>
                </div>
                <div className="border border-slate-300 p-4">
                    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 border-b pb-1">Consignee</h3>
                    <p className="font-bold">{shipment.buyer}</p>
                    <p className="text-slate-600">{shipment.destination}</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-slate-300 mb-8 max-w-full">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-left">Marks & Nos.</th>
                        <th className="border border-slate-300 p-2 text-left">Description of Goods</th>
                        <th className="border border-slate-300 p-2 text-right">Quantity</th>
                        <th className="border border-slate-300 p-2 text-right">Unit Price</th>
                        {isCI && <th className="border border-slate-300 p-2 text-right">Amount</th>}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-slate-300 p-3 align-top h-32">
                            1-50<br />
                            EXP/001 &rarr; 050
                        </td>
                        <td className="border border-slate-300 p-3 align-top">
                            <strong>{shipment.goods}</strong><br />
                            <span className="text-slate-500 text-xs">HS Code: 610910</span><br />
                            <span className="text-slate-500 text-xs">Origin: INDIA</span>
                        </td>
                        <td className="border border-slate-300 p-3 text-right align-top">5000 PCS</td>
                        <td className="border border-slate-300 p-3 text-right align-top">
                            {isCI ? "€9.00" : "N.A."}
                        </td>
                        {isCI && <td className="border border-slate-300 p-3 text-right align-top font-bold">{shipment.value}</td>}
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="bg-slate-50 font-bold">
                        <td className="border border-slate-300 p-2" colSpan={2}>Total</td>
                        <td className="border border-slate-300 p-2 text-right">5000 PCS</td>
                        <td className="border border-slate-300 p-2"></td>
                        {isCI && <td className="border border-slate-300 p-2 text-right">{shipment.value}</td>}
                    </tr>
                </tfoot>
            </table>

            {/* Declarations */}
            <div className="mt-12 text-xs text-slate-500">
                <p className="mb-2"><strong>Declaration:</strong></p>
                <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </div>

            <div className="mt-16 text-right">
                <p className="font-bold">For Demo Exports Pvt Ltd</p>
                <div className="h-16"></div>
                <p className="border-t border-slate-900 inline-block pt-1 pr-12">Authorized Signatory</p>
            </div>

        </div>
    );
}
