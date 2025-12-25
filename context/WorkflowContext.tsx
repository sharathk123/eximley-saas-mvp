"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Shipment, ImportShipment, MOCK_SHIPMENTS, MOCK_IMPORT_SHIPMENTS, ShipmentState, ImportState } from '@/lib/workflow';

type AnyShipment = Shipment | ImportShipment;
type AnyState = ShipmentState | ImportState;

interface WorkflowContextType {
    currentRole: Role;
    setRole: (role: Role) => void;
    shipments: AnyShipment[];
    setShipments: React.Dispatch<React.SetStateAction<AnyShipment[]>>;
    updateShipmentStatus: (id: string, newStatus: AnyState, action: string) => void;
    addShipment: (shipment: AnyShipment) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
    const [currentRole, setRole] = useState<Role>('EXPORTER_ADMIN');
    const [shipments, setShipments] = useState<AnyShipment[]>([...MOCK_SHIPMENTS, ...MOCK_IMPORT_SHIPMENTS]);

    const addShipment = (shipment: AnyShipment) => {
        setShipments(prev => [shipment, ...prev]);
    };

    const updateShipmentStatus = (id: string, newStatus: AnyState, action: string) => {
        setShipments(prev => prev.map(s => {
            if (s.id === id) {
                // Type casting here is necessary because we are updating a specific field
                // safely assuming the state is valid for the shipment type due to UI logic
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
                } as AnyShipment;
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
