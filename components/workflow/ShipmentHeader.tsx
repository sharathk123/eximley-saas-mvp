"use client";

import React from 'react';
import { Shipment } from '@/lib/workflow';
import { Box, MapPin, DollarSign, Briefcase } from 'lucide-react';

export function ShipmentHeader({ shipment }: { shipment: Shipment }) {
    return (
        <div className="md:col-span-12 float-panel rounded-2xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-slate-900/30">
                    {shipment.id.split('-')[1]}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{shipment.id}</h1>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                            Export
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <MapPin size={14} /> {shipment.destination}
                        </span>
                        <span className="flex items-center gap-1">
                            <Briefcase size={14} /> {shipment.buyer}
                        </span>
                        {shipment.enquiry && (
                            <span className="flex items-center gap-1 text-blue-500 font-medium">
                                <Box size={14} /> In response to Enquiry {shipment.enquiry.id}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Invoice Value</p>
                    <p className="text-xl font-mono font-bold text-slate-800">{shipment.value}</p>
                </div>
                <div className="h-10 w-[1px] bg-slate-200"></div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Goods</p>
                    <p className="text-sm font-semibold text-slate-800">{shipment.goods}</p>
                </div>
            </div>
        </div>
    );
}
