import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, ArrowRight, X, Copy, CheckCircle, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Status = 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

interface Subtask {
    id: string;
    title: string;
    prompt: string;
    completed?: boolean;
}

interface Task {
    id: string;
    title: string;
    description: string;
    epic: string;
    status: Status;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    sprint?: number;
    assignee?: string;
    acceptanceCriteria?: string[];
    subtasks?: Subtask[];
}

const INITIAL_TASKS: Task[] = [
    // ═══════════════════════════════════════════════════════════════
    // SPRINT 0: Architecture & Planning
    // Deliverable: Tech stack decisions documented
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S0-01',
        title: 'Tech Stack Documentation',
        description: 'Multi-tenant EXIM SaaS architecture',
        epic: 'DevOps',
        status: 'DONE',
        priority: 'HIGH',
        sprint: 0,
        acceptanceCriteria: [
            'All technology choices documented with rationale',
            'Multi-tenancy pattern defined (RLS by company_id)',
            'Architecture diagram created'
        ],
        subtasks: [
            { id: '0.1.1', title: 'Frontend Stack', prompt: 'Document frontend stack: Next.js 14 (App Router) for SSR and API routes, Tailwind CSS + Radix UI for styling, Zustand for state, react-hook-form + Zod for forms.' },
            { id: '0.1.2', title: 'Database & Auth', prompt: 'Document data layer: PostgreSQL via Supabase with Row-Level Security (RLS) for multi-tenancy. Every table has company_id column. Supabase Auth with JWT for authentication.' },
            { id: '0.1.3', title: 'Multi-tenancy RLS', prompt: 'Create SQL migration for RLS policy pattern: CREATE POLICY "Users see own company" ON [table] FOR ALL USING (company_id = auth.jwt() ->> \'company_id\'). Apply to all tenant tables.' },
            { id: '0.1.4', title: 'Workflow Engine', prompt: 'Document Camunda 8 (Zeebe) integration for BPMN workflow orchestration. Use for Export/Import lifecycles with human tasks and service workers.' },
            { id: '0.1.5', title: 'AI & Integrations', prompt: 'Document AI stack: OpenAI/Qwen for quotation drafting, AWS Textract for OCR, Descartes for HS codes. Background jobs via Trigger.dev or Inngest.' },
            { id: '0.1.6', title: 'Storage & Caching', prompt: 'Document Supabase Storage for documents with signed URLs per tenant. Upstash Redis for edge caching, rate limiting, and sessions.' },
            { id: '0.1.7', title: 'DevOps & Monitoring', prompt: 'Document infrastructure: Vercel for frontend, Railway/Render for workers. Sentry for errors, Vercel Analytics for APM. GitHub Actions for CI/CD.' }
        ]
    },
    {
        id: 'S0-02',
        title: 'AI Coding Standards',
        description: 'Behavioral rules & context awareness',
        epic: 'DevOps',
        status: 'DONE',
        priority: 'HIGH',
        sprint: 0,
        acceptanceCriteria: [
            'Critical behavior rules defined (No hallucination, No extra work)',
            'State & Context awareness rules defined',
            'Architectural patterns (Cards, Modals, Tables) documented',
            'Workflow instructions created in .agent/workflows/coding-standards.md'
        ],
        subtasks: [
            { id: '0.2.1', title: 'Behavioral Rules', prompt: 'Define rules for NO Hallucination, NO Extra Work, and Preserving Functionality.' },
            { id: '0.2.2', title: 'Context Awareness', prompt: 'Define rules for checking PROJECT_KANBAN.md and conversation summaries before starting tasks.' },
            { id: '0.2.3', title: 'Architectural Patterns', prompt: 'Document standard patterns for Cards, Modals, and Tables in the design system.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 1: Foundation (Deployable baseline)
    // Deliverable: CI/CD pipeline, design system, basic testing
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S1-01',
        title: 'CI/CD Pipeline',
        description: 'GitHub Actions and Vercel deploy',
        epic: 'DevOps',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 1,
        subtasks: [
            { id: '8.1.1', title: 'GitHub Actions CI', prompt: 'Create .github/workflows/ci.yml that runs on PR: checkout, pnpm install, lint, typecheck, jest tests. Cache node_modules.' },
            { id: '8.1.2', title: 'Vercel Deployment', prompt: 'Configure Vercel project with GitHub integration. Set environment variables for production and preview. Enable automatic deployments from main.' }
        ]
    },
    {
        id: 'S1-02',
        title: 'Design System',
        description: 'Design tokens, Storybook, Dark mode',
        epic: 'UI/UX',
        status: 'DONE',
        priority: 'HIGH',
        sprint: 1,
        subtasks: [
            { id: '9.1.1', title: 'Design Tokens', prompt: 'Create lib/design-tokens.ts exporting colors, spacing, typography, shadows for the Sleek Enterprise theme. Use CSS variables for runtime theming.' },
            { id: '9.1.2', title: 'Storybook Setup', prompt: 'Install Storybook for Next.js. Configure .storybook/main.ts with addon-essentials and addon-a11y. Create stories for Button, Card, Modal components.' }
        ]
    },
    {
        id: 'S1-03',
        title: 'Unit Testing Setup',
        description: 'Jest config and service tests',
        epic: 'Testing',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 1,
        subtasks: [
            { id: '7.1.1', title: 'Jest Setup', prompt: 'Configure Jest with TypeScript in a Next.js 14 app. Create jest.config.js with moduleNameMapper for @/ paths and setupFilesAfterEnv for testing-library.' },
            { id: '7.1.2', title: 'AI Service Tests', prompt: 'Write unit tests for lib/services/aiService.ts. Mock the OpenAI client. Test generateAIQuotation() returns valid JSON.' }
        ]
    },
    {
        id: 'S1-04',
        title: 'Forms & Validation',
        description: 'react-hook-form + Zod schemas',
        epic: 'UI/UX',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 1,
        subtasks: [
            { id: '9.5.1', title: 'Form Setup', prompt: 'Install react-hook-form and zod. Create lib/schemas for Shipment, Buyer, Invoice. Add zodResolver to forms.' },
            { id: '9.5.2', title: 'Form Components', prompt: 'Create FormInput, FormSelect, FormDatePicker components that integrate with react-hook-form Controller.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 2: Export Workflow MVP
    // Deliverable: Complete Export lifecycle with Camunda
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S2-01',
        title: 'Camunda 8 Engine Setup',
        description: 'Configure Zeebe client with SaaS credentials',
        epic: 'Camunda Orchestration',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 2,
        subtasks: [
            { id: '1.1.1', title: 'Camunda SDK Install', prompt: 'Install @camunda8/sdk in a Next.js 14 app. Create lib/camunda/client.ts that exports a configured Zeebe grpc client using env vars.' },
            { id: '1.1.2', title: 'Health Check API', prompt: 'Create app/api/camunda/health/route.ts that calls zeebe.topology() and returns {status: "connected", brokers: [...]}.' }
        ]
    },
    {
        id: 'S2-02',
        title: 'Export BPMN Design',
        description: 'Model core Export lifecycle in Camunda Modeler',
        epic: 'Camunda Orchestration',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 2,
        subtasks: [
            { id: '1.2.1', title: 'Design Export BPMN', prompt: 'Using Camunda Modeler, create export_shipment.bpmn with: Start -> Quotation Draft -> AI Drafting -> Review -> PDF Gen -> End.' },
            { id: '1.2.2', title: 'Deploy BPMN API', prompt: 'Create app/api/camunda/deploy/route.ts that deploys a BPMN file from /bpmn folder to Camunda.' },
            { id: '1.2.3', title: 'Start Process API', prompt: 'Create app/api/shipments/[id]/start-workflow/route.ts that calls zeebe.createProcessInstance("export_shipment", {...}).' }
        ]
    },
    {
        id: 'S2-03',
        title: 'Task Workers',
        description: 'Implement workers for AI/PDF automated tasks',
        epic: 'Camunda Orchestration',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 2,
        subtasks: [
            { id: '1.4.1', title: 'AI Drafting Worker', prompt: 'Create lib/camunda/workers/aiDraftingWorker.ts that subscribes to "ai-quotation-draft", calls generateAIQuotation(), completes job.' },
            { id: '1.4.2', title: 'PDF Generation Worker', prompt: 'Create lib/camunda/workers/pdfWorker.ts that subscribes to "generate-pdf", calls pdfService, saves to storage.' }
        ]
    },
    {
        id: 'S2-04',
        title: 'E2E Testing',
        description: 'Playwright browser tests',
        epic: 'Testing',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 2,
        subtasks: [
            { id: '7.4.1', title: 'Playwright Setup', prompt: 'Install Playwright in the Next.js project. Create playwright.config.ts with baseURL pointing to localhost:3000.' },
            { id: '7.4.2', title: 'Export Workflow E2E', prompt: 'Write Playwright test for: Login -> Create Shipment -> Draft Quotation -> Generate PDF -> View in Documents.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 3: Documents & Storage
    // Deliverable: Complete document generation and storage
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S3-01',
        title: 'Doc Generation Engine',
        description: 'CI, PL, Shipping Bill PDF generation',
        epic: 'Document Mgmt',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 3,
        subtasks: [
            { id: '2.1.1', title: 'Commercial Invoice PDF', prompt: 'Extend lib/services/pdfService.ts to add generateCommercialInvoice(data) with seller/buyer info, line items, HSN codes.' },
            { id: '2.1.2', title: 'Packing List PDF', prompt: 'Add generatePackingList(data) to pdfService. Include quantities, weights, carton dimensions.' },
            { id: '2.1.3', title: 'Bill of Lading Template', prompt: 'Add generateBillOfLading(data) with shipper, consignee, vessel details, container numbers.' }
        ]
    },
    {
        id: 'S3-02',
        title: 'Document Storage',
        description: 'Supabase Storage integration by Shipment ID',
        epic: 'Document Mgmt',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 3,
        subtasks: [
            { id: '2.2.1', title: 'Storage Service', prompt: 'Create lib/services/storageService.ts with uploadDocument(bucket, shipmentId, fileName, file) that uploads to Supabase Storage.' },
            { id: '2.2.2', title: 'Get Signed URL', prompt: 'Add getSignedUrl(bucket, path, expiresIn = 3600) to storageService that returns a time-limited URL.' }
        ]
    },
    {
        id: 'S3-03',
        title: 'RBAC Implementation',
        description: 'Role-based access control middleware',
        epic: 'Security',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 3,
        subtasks: [
            { id: '5.1.1', title: 'Supabase RLS Policies', prompt: 'Write SQL RLS policies for "shipments" table: Users can only access rows where company_id matches their profile.' },
            { id: '5.1.2', title: 'withAuth HOC', prompt: 'Create lib/auth/withAuth.tsx Higher Order Component that wraps pages and redirects to /login if unauthenticated.' }
        ]
    },
    {
        id: 'S3-04',
        title: 'Responsive Design',
        description: 'Mobile-first layouts',
        epic: 'UI/UX',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 3,
        subtasks: [
            { id: '9.2.1', title: 'Mobile Navigation', prompt: 'Create components/layout/MobileNav.tsx with hamburger menu, slide-out drawer, and touch-friendly links.' },
            { id: '9.2.2', title: 'Responsive Tables', prompt: 'Create components/ui/ResponsiveTable.tsx that renders as cards on mobile and table on desktop.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 4: Import Workflow & AI
    // Deliverable: Import lifecycle + AI intelligence
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S4-01',
        title: 'Import BPMN Design',
        description: 'Model Import lifecycle (Procurement → BOE → Delivery)',
        epic: 'Camunda Orchestration',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 4,
        subtasks: [
            { id: '1.3.1', title: 'Design Import BPMN', prompt: 'Create import_shipment.bpmn with: Start -> Supplier Selection -> PI Review -> Payment Reminder -> BOE Filing -> End.' }
        ]
    },
    {
        id: 'S4-02',
        title: 'Human Task UI',
        description: 'Approval UI for Buyer, CHA, Bank reviews',
        epic: 'Camunda Orchestration',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 4,
        subtasks: [
            { id: '1.5.1', title: 'Fetch Tasklist API', prompt: 'Create app/api/camunda/tasks/route.ts that calls zeebe tasklist API to fetch open tasks for the current user.' },
            { id: '1.5.2', title: 'Complete Task API', prompt: 'Create app/api/camunda/tasks/[taskId]/complete/route.ts that accepts {variables} body and completes the job.' },
            { id: '1.5.3', title: 'Tasklist UI', prompt: 'Create components/workflow/Tasklist.tsx that displays task cards with "Complete" buttons.' }
        ]
    },
    {
        id: 'S4-03',
        title: 'AI Compliance Validation',
        description: 'Sanctions screening, Dual-Use detection',
        epic: 'AI Intelligence',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 4,
        subtasks: [
            { id: '4.3.1', title: 'Sanctions Screening', prompt: 'Create lib/services/complianceService.ts with checkSanctions(buyerName, country) that queries OFAC/EU sanctions lists.' },
            { id: '4.3.2', title: 'Dual-Use Detection', prompt: 'Add checkDualUse(hsCode) to complianceService that checks the dual-use control list.' }
        ]
    },
    {
        id: 'S4-04',
        title: 'Bill of Entry Template',
        description: 'Import document generation',
        epic: 'Document Mgmt',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 4,
        subtasks: [
            { id: '2.1.4', title: 'Bill of Entry Template', prompt: 'Add generateBillOfEntry(data) for import shipments with BE number, IEC, HS codes, assessable value, and duty breakdown.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 5: Integrations & Monitoring
    // Deliverable: External APIs + Production monitoring
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S5-01',
        title: 'IceGate / DGFT API',
        description: 'E-BRC fetching, Shipping Bill status',
        epic: 'Integrations',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 5,
        subtasks: [
            { id: '3.1.1', title: 'DGFT E-BRC Fetch', prompt: 'Create lib/services/dgftService.ts with fetchEBRC(iecCode, sbNo) that calls DGFT API (mock for now).' },
            { id: '3.1.2', title: 'IceGate SB Status', prompt: 'Add checkShippingBillStatus(sbNo) to dgftService that returns {status, letExportDate}.' }
        ]
    },
    {
        id: 'S5-02',
        title: 'Monitoring & Observability',
        description: 'Sentry, APM, Alerting',
        epic: 'DevOps',
        status: 'BACKLOG',
        priority: 'HIGH',
        sprint: 5,
        subtasks: [
            { id: '8.3.1', title: 'Sentry Setup', prompt: 'Install @sentry/nextjs. Configure in next.config.js with DSN from env. Enable source maps upload.' },
            { id: '8.3.2', title: 'APM Integration', prompt: 'Add Vercel Analytics or OpenTelemetry. Track: page load times, API latencies, DB query durations.' }
        ]
    },
    {
        id: 'S5-03',
        title: 'In-App Notifications',
        description: 'Real-time toast for status changes',
        epic: 'Notifications',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 5,
        subtasks: [
            { id: '6.1.1', title: 'Notifications Table', prompt: 'Create Supabase table "notifications" with: id, user_id, title, message, link, is_read, created_at.' },
            { id: '6.1.2', title: 'Notification Bell UI', prompt: 'Create components/ui/NotificationBell.tsx that fetches /api/notifications, shows unread count badge.' }
        ]
    },
    {
        id: 'S5-04',
        title: 'Audit Logging',
        description: 'Log all user actions for compliance',
        epic: 'Security',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 5,
        subtasks: [
            { id: '5.2.1', title: 'Audit Log Table', prompt: 'Create Supabase table "audit_logs" with: id, user_id, action, entity_type, entity_id, changes (JSONB), created_at.' },
            { id: '5.2.2', title: 'Logging Middleware', prompt: 'Create lib/middleware/auditLogger.ts that intercepts API mutations and inserts audit log rows.' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SPRINT 6: Polish & Scale
    // Deliverable: Performance, advanced features, additional integrations
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'S6-01',
        title: 'Real HS Code API',
        description: 'Integrate Descartes/3rd party API',
        epic: 'AI Intelligence',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 6,
        subtasks: [
            { id: '4.1.1', title: 'HS Code API Integration', prompt: 'Replace mock in lib/services/itcHSCodeService.ts with real API call to Descartes or similar.' },
            { id: '4.1.2', title: 'Caching Layer', prompt: 'Add Redis or in-memory caching to itcHSCodeService. Cache HS code lookups by product description for 24 hours.' }
        ]
    },
    {
        id: 'S6-02',
        title: 'OCR Service',
        description: 'Backend service for PDF extraction',
        epic: 'AI Intelligence',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 6,
        subtasks: [
            { id: '4.2.1', title: 'OCR Backend', prompt: 'Create app/api/documents/extract/route.ts that accepts PDF upload, sends to AWS Textract, returns extracted fields.' },
            { id: '4.2.2', title: 'OCR to Form Mapping', prompt: 'Create lib/services/ocrMapper.ts that maps Textract keys to system fields.' }
        ]
    },
    {
        id: 'S6-03',
        title: 'Bank & LC APIs',
        description: 'SWIFT parsing, LC tracking',
        epic: 'Integrations',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 6,
        subtasks: [
            { id: '3.2.1', title: 'SWIFT Parser', prompt: 'Create lib/services/swiftParser.ts that parses MT700 LC messages and extracts key fields.' },
            { id: '3.2.2', title: 'LC Tracking Model', prompt: 'Create Supabase table "letters_of_credit" with columns: id, shipment_id, lc_number, amount, currency, expiry_date, status.' }
        ]
    },
    {
        id: 'S6-04',
        title: 'Dashboard & Charts',
        description: 'Data visualization widgets',
        epic: 'UI/UX',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 6,
        subtasks: [
            { id: '9.4.1', title: 'Chart Components', prompt: 'Create components/charts using Recharts. Implement LineChart, BarChart, PieChart with Sleek Enterprise palette.' },
            { id: '9.4.2', title: 'Dashboard Widgets', prompt: 'Create reusable dashboard widgets: StatCard, RecentActivity, ShipmentsByStatus.' }
        ]
    },
    {
        id: 'S6-05',
        title: 'Performance Testing',
        description: 'Load and Lighthouse tests',
        epic: 'Testing',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        sprint: 6,
        subtasks: [
            { id: '7.5.1', title: 'Lighthouse CI', prompt: 'Add Lighthouse CI to GitHub Actions. Create lighthouserc.js with assertions for performance > 80, accessibility > 90.' },
            { id: '7.5.2', title: 'API Load Testing', prompt: 'Create k6 load test script for /api/shipments endpoint. Simulate 100 concurrent users over 5 minutes.' }
        ]
    },
    {
        id: 'S6-06',
        title: 'Email/SMS Alerts',
        description: 'Deadline reminders, shipment updates',
        epic: 'Notifications',
        status: 'BACKLOG',
        priority: 'LOW',
        sprint: 6,
        subtasks: [
            { id: '6.2.1', title: 'Email Service', prompt: 'Create lib/services/emailService.ts using Resend SDK. Add sendEmail(to, subject, templateId, variables) method.' },
            { id: '6.2.2', title: 'SMS Service', prompt: 'Create lib/services/smsService.ts using Twilio SDK. Add sendSMS(to, message) method.' }
        ]
    },
];

const COLUMNS: { id: Status; label: string; color: string }[] = [
    { id: 'BACKLOG', label: 'Backlog', color: 'bg-slate-500' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500' },
    { id: 'REVIEW', label: 'Review', color: 'bg-purple-500' },
    { id: 'DONE', label: 'Done', color: 'bg-emerald-500' }
];

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const moveTask = (taskId: string, newStatus: Status) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        if (selectedTask?.id === taskId) {
            setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const toggleSubtask = (taskId: string, subtaskId: string) => {
        setTasks(prev => {
            const updated = prev.map(t => {
                if (t.id === taskId && t.subtasks) {
                    const newSubtasks = t.subtasks.map(s =>
                        s.id === subtaskId ? { ...s, completed: !s.completed } : s
                    );
                    const allDone = newSubtasks.every(s => s.completed);
                    return { ...t, subtasks: newSubtasks, status: allDone ? 'DONE' as Status : t.status };
                }
                return t;
            });
            // Update selectedTask if it was modified
            const updatedTask = updated.find(t => t.id === taskId);
            if (updatedTask && selectedTask?.id === taskId) {
                setSelectedTask(updatedTask);
            }
            return updated;
        });
    };

    const copyPrompt = (subtaskId: string, prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedId(subtaskId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getCompletedCount = (task: Task) => {
        if (!task.subtasks) return { done: 0, total: 0 };
        const done = task.subtasks.filter(s => s.completed).length;
        return { done, total: task.subtasks.length };
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 mb-1">Product Roadmap</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click a task to view subtasks & prompts</p>
                </div>
                <Button className="btn-sleek-primary">
                    <Plus size={16} className="mr-2" />
                    New Task
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1000px] h-full pb-4">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="w-80 flex-shrink-0 flex flex-col h-full bg-slate-100/50 rounded-2xl border border-slate-200">
                            {/* Column Header */}
                            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", col.color)} />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">{col.label}</h3>
                                    <span className="bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {tasks.filter(t => t.status === col.id).length}
                                    </span>
                                </div>
                                <MoreHorizontal size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                            </div>

                            {/* Tasks Container */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <motion.div
                                        layoutId={task.id}
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                                task.epic === 'Camunda Orchestration' && "bg-orange-50 text-orange-600 border-orange-100",
                                                task.epic === 'Document Mgmt' && "bg-cyan-50 text-cyan-600 border-cyan-100",
                                                task.epic === 'Integrations' && "bg-pink-50 text-pink-600 border-pink-100",
                                                task.epic === 'AI Intelligence' && "bg-purple-50 text-purple-600 border-purple-100",
                                                task.epic === 'Security' && "bg-amber-50 text-amber-600 border-amber-100",
                                                task.epic === 'Notifications' && "bg-green-50 text-green-600 border-green-100",
                                                task.epic === 'Testing' && "bg-red-50 text-red-600 border-red-100",
                                                task.epic === 'DevOps' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                                                task.epic === 'UI/UX' && "bg-teal-50 text-teal-600 border-teal-100"
                                            )}>
                                                {task.epic}
                                            </span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                {col.id !== 'BACKLOG' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); moveTask(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) - 1].id); }}
                                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                                        title="Move Back"
                                                    >
                                                        <ArrowRight size={12} className="rotate-180" />
                                                    </button>
                                                )}
                                                {col.id !== 'DONE' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); moveTask(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) + 1].id); }}
                                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                                        title="Move Forward"
                                                    >
                                                        <ArrowRight size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{task.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{task.description}</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                {task.sprint && (
                                                    <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-black">
                                                        S{task.sprint}
                                                    </span>
                                                )}
                                                <Calendar size={12} />
                                                <span className="text-[10px] font-medium">{task.id}</span>
                                            </div>
                                            {task.subtasks && task.subtasks.length > 0 && (
                                                <div className="flex items-center gap-1 text-indigo-500">
                                                    <ListTodo size={12} />
                                                    <span className="text-[10px] font-bold">{task.subtasks.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Detail Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTask(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                                <div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border inline-block mb-2",
                                        selectedTask.epic === 'Camunda Orchestration' && "bg-orange-50 text-orange-600 border-orange-100",
                                        selectedTask.epic === 'Document Mgmt' && "bg-cyan-50 text-cyan-600 border-cyan-100",
                                        selectedTask.epic === 'Integrations' && "bg-pink-50 text-pink-600 border-pink-100",
                                        selectedTask.epic === 'AI Intelligence' && "bg-purple-50 text-purple-600 border-purple-100",
                                        selectedTask.epic === 'Security' && "bg-amber-50 text-amber-600 border-amber-100",
                                        selectedTask.epic === 'Notifications' && "bg-green-50 text-green-600 border-green-100"
                                    )}>
                                        {selectedTask.epic}
                                    </span>
                                    <h2 className="text-xl font-black text-slate-800">{selectedTask.title}</h2>
                                    <p className="text-sm text-slate-500 mt-1">{selectedTask.description}</p>
                                </div>
                                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* Acceptance Criteria */}
                                {selectedTask.acceptanceCriteria && selectedTask.acceptanceCriteria.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Acceptance Criteria</h3>
                                        <ul className="space-y-2">
                                            {selectedTask.acceptanceCriteria.map((ac, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    {ac}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Subtasks */}
                                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Subtasks & Prompts</h3>
                                        <div className="space-y-4">
                                            {selectedTask.subtasks.map(subtask => (
                                                <div key={subtask.id} className={cn("rounded-xl p-4 border transition-all", subtask.completed ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200")}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleSubtask(selectedTask.id, subtask.id)}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                                    subtask.completed
                                                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                                                        : "border-slate-300 hover:border-indigo-400"
                                                                )}
                                                            >
                                                                {subtask.completed && <CheckCircle size={12} />}
                                                            </button>
                                                            <div>
                                                                <span className="text-[10px] font-black text-slate-400">{subtask.id}</span>
                                                                <h4 className={cn("font-bold text-sm", subtask.completed ? "text-slate-400 line-through" : "text-slate-800")}>{subtask.title}</h4>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => copyPrompt(subtask.id, subtask.prompt)}
                                                            className={cn(
                                                                "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                                                                copiedId === subtask.id
                                                                    ? "bg-emerald-100 text-emerald-600"
                                                                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                                            )}
                                                        >
                                                            {copiedId === subtask.id ? (
                                                                <>
                                                                    <CheckCircle size={12} />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy size={12} />
                                                                    Copy Prompt
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <pre className={cn("text-xs p-3 rounded-lg border whitespace-pre-wrap font-mono", subtask.completed ? "bg-white/50 text-slate-400 border-emerald-100" : "bg-white text-slate-600 border-slate-100")}>
                                                        {subtask.prompt}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!selectedTask.subtasks?.length && !selectedTask.acceptanceCriteria?.length && (
                                    <p className="text-slate-400 text-sm text-center py-8">No subtasks defined for this story yet.</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
