"use client";

import { CompanyDashboard } from '@/components/company/CompanyDashboard';
import { CHADashboard } from '@/components/cha/CHADashboard';
import { useWorkflow } from '@/context/WorkflowContext';

export default function DashboardPage() {
    const { currentRole } = useWorkflow();

    if (currentRole === 'CHA') {
        return <CHADashboard />;
    }

    return <CompanyDashboard />;
}
