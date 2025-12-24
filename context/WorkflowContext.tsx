"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Shipment, MOCK_SHIPMENTS, ShipmentState } from '@/lib/workflow';

interface WorkflowContextType {
    currentRole: Role;
    setRole: (role: Role) => void;
    shipments: Shipment[];
    setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
    updateShipmentStatus: (id: string, newStatus: ShipmentState, action: string) => void;
    addShipment: (shipment: Shipment) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
    const [currentRole, setRole] = useState<Role>('EXPORTER_ADMIN');
    const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);

    const addShipment = (shipment: Shipment) => {
        setShipments(prev => [shipment, ...prev]);
    };

    const updateShipmentStatus = (id: string, newStatus: ShipmentState, action: string) => {
        setShipments(prev => prev.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status: newStatus,
                    history: [
                        ...s.history,
                        {
                            state: newStatus,
                            timestamp: new Date().toISOString(),
                            actor: 'Demo User',
                            role: currentRole,
                            action: action
                        }
                    ]
                };
            }
            return s;
        }));
    };

    return (
        <WorkflowContext.Provider value={{ currentRole, setRole, shipments, setShipments, updateShipmentStatus, addShipment }}>
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflow() {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}
