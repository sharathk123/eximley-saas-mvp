# Eximley SaaS - Project Kanban Board (Sprint-Based Roadmap)

All tasks are organized into 6 logical sprints for iterative delivery.

---

## 🏗️ SPRINT 0: Architecture & Planning
**Deliverable:** Tech stack decisions & AI coding standards documented.

### User Story S0-01: Tech Stack Documentation
**Status:** DONE

**Acceptance Criteria:**
- [x] All technology choices documented with rationale
- [x] Multi-tenancy pattern defined (RLS by company_id)
- [x] Architecture diagram created

**Subtasks:**
| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 0.1.1 | Frontend Stack | Document frontend stack: Next.js 14, Tailwind, Zustand, Zod. |
| 0.1.2 | Database & Auth | Document Supabase + RLS for multi-tenancy. |
| 0.1.3 | Multi-tenancy RLS | Create SQL migration for RLS policy pattern. |
| 0.1.4 | Workflow Engine | Document Camunda 8 (Zeebe) integration. |

---

### User Story S0-02: AI Coding Standards
**Status:** DONE

**Acceptance Criteria:**
- [x] Critical behavior rules defined (No hallucination, No extra work)
- [x] State & Context awareness rules defined
- [x] Architectural patterns (Cards, Modals, Tables) documented
- [x] Workflow instructions created in `.agent/workflows/coding-standards.md`

**Subtasks:**
| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 0.2.1 | Behavioral Rules | Define rules for NO Hallucination, NO Extra Work. |
| 0.2.2 | Context Awareness | Define rules for checking KANBAN and conversation summaries. |
| 0.2.3 | Architectural Patterns | Document standard patterns for Cards, Modals, and Tables. |

---

## 🚀 SPRINT 1: Foundation
**Deliverable:** CI/CD pipeline, design system, basic testing.

### Epic 1: Camunda Workflow Orchestration (Setup)

## 🚀 Epic 1: Camunda Workflow Orchestration

### User Story 1.1: Camunda Engine Setup
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Zeebe client connects to Camunda 8 SaaS cluster
- [ ] Health check endpoint returns `connected` status
- [ ] Environment variables configured for cluster credentials

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 1.1.1 | Camunda SDK Install | `Install @camunda8/sdk in a Next.js 14 app. Create lib/camunda/client.ts that exports a configured Zeebe grpc client using env vars CAMUNDA_CLUSTER_ID, CAMUNDA_CLIENT_ID, CAMUNDA_CLIENT_SECRET.` |
| 1.1.2 | Health Check API | `Create app/api/camunda/health/route.ts that calls zeebe.topology() and returns {status: 'connected', brokers: [...]} or error.` |

---

### User Story 1.2: Export BPMN Model
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] BPMN file deploys successfully to Camunda
- [ ] Process starts when API endpoint is called
- [ ] Service tasks invoke registered workers

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 1.2.1 | Design Export BPMN | `Using Camunda Modeler, create export_shipment.bpmn with: Start -> User Task (Quotation Draft) -> Service Task (AI Drafting) -> User Task (Review) -> Service Task (PDF Gen) -> End. Use proper job types.` |
| 1.2.2 | Deploy BPMN API | `Create app/api/camunda/deploy/route.ts that deploys a BPMN file from /bpmn folder to Camunda using zeebe.deployProcess().` |
| 1.2.3 | Start Process API | `Create app/api/shipments/[id]/start-workflow/route.ts that calls zeebe.createProcessInstance('export_shipment', {shipmentId, buyerName, goods}).` |

---

### User Story 1.3: Import BPMN Model
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Import lifecycle modeled: Procurement → Supplier PI → Payment → Customs → Delivery
- [ ] BPMN deploys and starts correctly

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 1.3.1 | Design Import BPMN | `Create import_shipment.bpmn with: Start -> User Task (Supplier Selection) -> User Task (PI Review) -> Service Task (Payment Reminder) -> User Task (BOE Filing) -> End.` |

---

### User Story 1.4: Task Workers
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Workers subscribe to job types and complete tasks
- [ ] Errors are logged and retried

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 1.4.1 | AI Drafting Worker | `Create lib/camunda/workers/aiDraftingWorker.ts that subscribes to job type 'ai-quotation-draft', calls generateAIQuotation(), and completes the job with {quotationData}.` |
| 1.4.2 | PDF Generation Worker | `Create lib/camunda/workers/pdfWorker.ts that subscribes to 'generate-pdf', calls pdfService.generateQuotationPDF(), saves to storage, and completes job with {pdfUrl}.` |

---

### User Story 1.5: Human Task UI
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Tasklist shows pending user tasks
- [ ] User can claim and complete tasks
- [ ] Task completion advances the workflow

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 1.5.1 | Fetch Tasklist API | `Create app/api/camunda/tasks/route.ts that calls zeebe tasklist API to fetch open tasks for the current user. Return [{taskId, name, assignee, createdAt}].` |
| 1.5.2 | Complete Task API | `Create app/api/camunda/tasks/[taskId]/complete/route.ts that accepts {variables} body and calls zeebe.completeJob(taskId, variables).` |
| 1.5.3 | Tasklist UI | `Create components/workflow/Tasklist.tsx that fetches from /api/camunda/tasks, displays cards for each task, and has "Complete" buttons.` |

---

## 📄 Epic 2: Document Management

### User Story 2.1: Document Generation Engine
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All 6 document types generate valid PDFs
- [ ] PDFs include company branding and dynamic data

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 2.1.1 | Commercial Invoice PDF | `Extend lib/services/pdfService.ts to add generateCommercialInvoice(data: InvoiceData) that creates a professional CI with seller/buyer info, line items table, HSN codes, totals, and bank details.` |
| 2.1.2 | Packing List PDF | `Add generatePackingList(data) to pdfService. Include item descriptions, quantities, gross/net weights, carton dimensions, and marks & numbers.` |
| 2.1.3 | Bill of Lading Template | `Add generateBillOfLading(data) with shipper, consignee, notify party, vessel details, container numbers, and freight terms.` |
| 2.1.4 | Bill of Entry Template | `Add generateBillOfEntry(data) for import shipments with BE number, IEC, HS codes, assessable value, and duty breakdown.` |

---

### User Story 2.2: Document Storage
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Documents uploaded to Supabase Storage
- [ ] Files organized by shipment ID
- [ ] Signed URLs generated for secure access

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 2.2.1 | Storage Service | `Create lib/services/storageService.ts with uploadDocument(bucket, shipmentId, fileName, file) that uploads to Supabase Storage at path /{shipmentId}/{fileName}.` |
| 2.2.2 | Get Signed URL | `Add getSignedUrl(bucket, path, expiresIn = 3600) to storageService that returns a time-limited public URL.` |

---

## 🔗 Epic 3: 3rd Party Integrations

### User Story 3.1: IceGate / DGFT API
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] E-BRC data fetched and stored
- [ ] Shipping Bill status tracked

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 3.1.1 | DGFT E-BRC Fetch | `Create lib/services/dgftService.ts with fetchEBRC(iecCode, sbNo) that calls DGFT API (mock for now) and returns {ebrcNo, realizedAmount, dateOfRealization}.` |
| 3.1.2 | IceGate SB Status | `Add checkShippingBillStatus(sbNo) to dgftService that returns {status, letExportDate, epcgLicNo} from IceGate (mock initially).` |

---

### User Story 3.2: Bank & LC APIs
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] LC details parsed from SWIFT messages
- [ ] Payment milestones tracked

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 3.2.1 | SWIFT Parser | `Create lib/services/swiftParser.ts that parses MT700 LC messages and extracts {lcNumber, issuingBank, amount, expiryDate, shipmentDeadline}.` |
| 3.2.2 | LC Tracking Model | `Create Supabase table 'letters_of_credit' with columns: id, shipment_id, lc_number, amount, currency, issuing_bank, expiry_date, status.` |

---

### User Story 3.3: Freight Forwarder APIs
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Container tracking returns real-time location
- [ ] ETA updates stored on shipment

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 3.3.1 | Container Tracking | `Create lib/services/trackingService.ts with trackContainer(containerNo, carrier) that calls Maersk/MSC API (mock) and returns {currentPort, eta, events[]}.` |

---

## 🧠 Epic 4: AI-Powered Trade Intelligence

### User Story 4.1: Real-time HS Code Classification
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] AI suggests top 3 HS codes with confidence scores
- [ ] Duty rates displayed for each suggestion

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 4.1.1 | HS Code API Integration | `Replace mock in lib/services/itcHSCodeService.ts with real API call to Descartes or similar. Parse response to match existing ITCHSCodeSuggestion interface.` |
| 4.1.2 | Caching Layer | `Add Redis or in-memory caching to itcHSCodeService. Cache HS code lookups by product description for 24 hours to reduce API costs.` |

---

### User Story 4.2: Intelligent Document OCR
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] PDF upload extracts structured data
- [ ] Low-confidence fields flagged for review

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 4.2.1 | OCR Backend | `Create app/api/documents/extract/route.ts that accepts PDF upload, sends to AWS Textract, and returns {fields: [{key, value, confidence}]}.` |
| 4.2.2 | OCR to Form Mapping | `Create lib/services/ocrMapper.ts that maps Textract keys (e.g., "Invoice Total") to our system fields (e.g., "totalValue").` |

---

### User Story 4.3: AI Compliance Validation
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Sanctions list checked before shipment creation
- [ ] Dual-use goods flagged for review

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 4.3.1 | Sanctions Screening | `Create lib/services/complianceService.ts with checkSanctions(buyerName, country) that queries OFAC/EU sanctions lists and returns {isFlagged, reason}.` |
| 4.3.2 | Dual-Use Detection | `Add checkDualUse(hsCode) to complianceService that checks if the HS code is on the dual-use control list and returns {isControlled, licenseRequired}.` |

---

## 🔒 Epic 5: Security

### User Story 5.1: Role-Based Access Control
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Roles defined: Admin, Editor, Viewer
- [ ] Unauthorized access returns 403
- [ ] RLS policies enforce data isolation

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 5.1.1 | Supabase RLS Policies | `Write SQL RLS policies for 'shipments' table: Users can only SELECT/UPDATE rows where company_id matches their profile. Admins can INSERT/DELETE.` |
| 5.1.2 | withAuth HOC | `Create lib/auth/withAuth.tsx Higher Order Component that wraps pages and redirects to /login if unauthenticated. Accept requiredRole prop for role checks.` |

---

### User Story 5.2: Audit Logging
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All write operations logged with user, action, timestamp
- [ ] Logs queryable by shipment ID

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 5.2.1 | Audit Log Table | `Create Supabase table 'audit_logs' with: id, user_id, action (ENUM: CREATE, UPDATE, DELETE), entity_type, entity_id, changes (JSONB), created_at.` |
| 5.2.2 | Logging Middleware | `Create lib/middleware/auditLogger.ts that intercepts API mutations and inserts a row into audit_logs with before/after diff.` |

---

## 🔔 Epic 6: Notifications & Alerts

### User Story 6.1: In-App Notifications
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Bell icon shows unread count
- [ ] Clicking opens notification dropdown
- [ ] Notifications link to relevant shipment

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 6.1.1 | Notifications Table | `Create Supabase table 'notifications' with: id, user_id, title, message, link, is_read, created_at. Add index on (user_id, is_read).` |
| 6.1.2 | Notification Bell UI | `Create components/ui/NotificationBell.tsx that fetches /api/notifications, shows unread count badge, and renders dropdown list on click.` |

---

### User Story 6.2: Email/SMS Alerts
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Email sent for: Shipment status change, Payment reminder, Document ready
- [ ] SMS sent for urgent deadlines only

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 6.2.1 | Email Service | `Create lib/services/emailService.ts using Resend SDK. Add sendEmail(to, subject, templateId, variables) method with templates for status_update, payment_reminder.` |
| 6.2.2 | SMS Service | `Create lib/services/smsService.ts using Twilio SDK. Add sendSMS(to, message) method. Only trigger for priority: 'urgent' notifications.` |

---

## 🧪 Epic 7: Testing & Quality Assurance

### User Story 7.1: Unit Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All service functions have unit tests
- [ ] Test coverage > 80% for lib/services
- [ ] Tests run in CI pipeline

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.1.1 | Jest Setup | `Configure Jest with TypeScript in a Next.js 14 app. Create jest.config.js with moduleNameMapper for @/ paths and setupFilesAfterEnv for testing-library.` |
| 7.1.2 | AI Service Tests | `Write unit tests for lib/services/aiService.ts. Mock the OpenAI client. Test generateAIQuotation() returns valid JSON with price, currency, message fields.` |
| 7.1.3 | PDF Service Tests | `Write unit tests for lib/services/pdfService.ts. Mock jspdf. Test generateQuotationPDF() returns a valid data URL starting with 'data:application/pdf'.` |
| 7.1.4 | Workflow Logic Tests | `Write unit tests for lib/workflow.ts. Test getProgressPercentage() returns correct values for each ShipmentState. Test state transition helpers.` |

---

### User Story 7.2: Component Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All UI components have snapshot tests
- [ ] Interactive components have behavior tests
- [ ] Accessibility checks pass

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.2.1 | Testing Library Setup | `Install @testing-library/react and @testing-library/jest-dom. Create test-utils.tsx with custom render that wraps components in necessary providers.` |
| 7.2.2 | Button Component Tests | `Write tests for components/ui/button.tsx. Test all variants render correctly, onClick fires, disabled state prevents clicks.` |
| 7.2.3 | KanbanBoard Tests | `Write tests for components/admin/KanbanBoard.tsx. Test task cards render, clicking opens modal, completing subtasks updates state.` |

---

### User Story 7.3: Integration Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] API routes tested with database
- [ ] Auth flows tested end-to-end
- [ ] Camunda integration tested

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.3.1 | Supabase Test Setup | `Create a test Supabase project or use local Supabase CLI. Configure test environment variables. Create seed script for test data.` |
| 7.3.2 | Shipment API Tests | `Write integration tests for app/api/shipments. Test POST creates shipment in DB, GET returns correct data, PUT updates status.` |
| 7.3.3 | Auth Flow Tests | `Write integration tests for login/signup. Test user creation, session management, protected route access.` |

---

### User Story 7.4: E2E Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Critical user journeys covered
- [ ] Tests run in headless browser
- [ ] Visual regression detection

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.4.1 | Playwright Setup | `Install Playwright in the Next.js project. Create playwright.config.ts with baseURL pointing to localhost:3000. Configure projects for Chrome and Firefox.` |
| 7.4.2 | Export Workflow E2E | `Write Playwright test for: Login -> Create Shipment -> Draft Quotation with AI -> Generate PDF -> View in Documents. Assert each step succeeds.` |
| 7.4.3 | Import Workflow E2E | `Write Playwright test for complete Import lifecycle: Create Import -> Supplier Selection -> PI Review -> BOE Filing -> Mark Delivered.` |
| 7.4.4 | Admin Dashboard E2E | `Write Playwright test for Admin Dashboard: Login as admin -> Approve user -> View Kanban -> Complete subtask -> Verify task moves to Done.` |

---

### User Story 7.5: Performance Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Page load < 3 seconds
- [ ] API response < 500ms p95
- [ ] No memory leaks detected

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.5.1 | Lighthouse CI | `Add Lighthouse CI to GitHub Actions. Create lighthouserc.js with assertions for performance > 80, accessibility > 90, best-practices > 80.` |
| 7.5.2 | API Load Testing | `Create k6 load test script for /api/shipments endpoint. Simulate 100 concurrent users over 5 minutes. Assert p95 latency < 500ms.` |
| 7.5.3 | React Profiler | `Add React DevTools Profiler to development mode. Create a test that renders KanbanBoard with 50 tasks and asserts render time < 100ms.` |

---

### User Story 7.6: Security Testing
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] No critical vulnerabilities in dependencies
- [ ] XSS and injection prevented
- [ ] Auth bypass attempts blocked

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 7.6.1 | Dependency Audit | `Add npm audit to CI pipeline. Configure .nsprc to ignore known false positives. Fail build on critical vulnerabilities.` |
| 7.6.2 | OWASP ZAP Scan | `Integrate OWASP ZAP into GitHub Actions. Run active scan against staging environment. Assert no high-severity findings.` |
| 7.6.3 | Auth Penetration Tests | `Write security tests that attempt: SQL injection in search, XSS in user input fields, CSRF on state-changing endpoints, JWT tampering.` |

---

## 🚀 Epic 8: DevOps & Infrastructure

### User Story 8.1: CI/CD Pipeline
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] PRs trigger lint, typecheck, and test jobs
- [ ] Main branch auto-deploys to staging
- [ ] Tagged releases deploy to production

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 8.1.1 | GitHub Actions CI | `Create .github/workflows/ci.yml that runs on PR: checkout, pnpm install, lint, typecheck, jest tests. Cache node_modules.` |
| 8.1.2 | Vercel Deployment | `Configure Vercel project with GitHub integration. Set environment variables for production and preview. Enable automatic deployments from main.` |
| 8.1.3 | Docker Build | `Create Dockerfile for Next.js standalone output. Create docker-compose.yml with app, Supabase local, and Redis services.` |

---

### User Story 8.2: Environment Management
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Separate configs for dev/staging/prod
- [ ] Secrets managed securely
- [ ] Feature flags supported

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 8.2.1 | Env Config | `Create lib/config.ts that reads from process.env and exports typed config object with validation. Throw on missing required vars.` |
| 8.2.2 | Feature Flags | `Create lib/featureFlags.ts using LaunchDarkly or simple env-based flags. Add flags for: AI_ENABLED, CAMUNDA_ENABLED, OCR_ENABLED.` |

---

### User Story 8.3: Monitoring & Observability
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Error tracking captures unhandled exceptions
- [ ] Performance metrics collected
- [ ] Alerting on critical errors

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 8.3.1 | Sentry Setup | `Install @sentry/nextjs. Configure in next.config.js with DSN from env. Enable source maps upload for production builds.` |
| 8.3.2 | APM Integration | `Add Vercel Analytics or custom OpenTelemetry instrumentation. Track: page load times, API latencies, DB query durations.` |
| 8.3.3 | Alerting Rules | `Configure Sentry alerts: Email on any error, Slack on >10 errors/hour, PagerDuty on >50 errors/hour.` |

---

## 🎨 Epic 9: UI/UX & Design System

### User Story 9.1: Design System & Component Library
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All UI components follow consistent design tokens
- [ ] Storybook documents all components
- [ ] Dark mode support implemented

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.1.1 | Design Tokens | `Create lib/design-tokens.ts exporting colors, spacing, typography, shadows for the Sleek Enterprise theme. Use CSS variables for runtime theming.` |
| 9.1.2 | Storybook Setup | `Install Storybook for Next.js. Configure .storybook/main.ts with addon-essentials and addon-a11y. Create stories for Button, Card, Modal components.` |
| 9.1.3 | Dark Mode | `Implement dark mode toggle using next-themes. Update tailwind.config for dark: variants. Store preference in localStorage.` |

---

### User Story 9.2: Responsive Design
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All pages work on mobile (320px+)
- [ ] Tablet breakpoint optimized (768px)
- [ ] Desktop layouts utilize full width (1440px+)

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.2.1 | Mobile Navigation | `Create components/layout/MobileNav.tsx with hamburger menu, slide-out drawer, and touch-friendly links. Hide desktop sidebar on mobile.` |
| 9.2.2 | Responsive Tables | `Create components/ui/ResponsiveTable.tsx that renders as cards on mobile (<640px) and horizontal table on desktop. Use CSS grid.` |
| 9.2.3 | Dashboard Responsive | `Update app/dashboard/page.tsx to stack widgets vertically on mobile, 2-column on tablet, 3-column on desktop using Tailwind responsive classes.` |

---

### User Story 9.3: Accessibility (a11y)
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works everywhere
- [ ] Screen reader tested

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.3.1 | Axe Audits | `Install @axe-core/react. Wrap app in dev mode with axe reporting. Fix all critical and serious violations.` |
| 9.3.2 | Keyboard Focus | `Add visible focus rings to all interactive elements. Implement focus trap in modals. Add skip-to-content link.` |
| 9.3.3 | ARIA Labels | `Audit all forms and buttons for proper aria-label, aria-describedby, and role attributes. Ensure icons have sr-only text.` |

---

### User Story 9.4: Dashboard & Data Visualization
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] Charts load within 1 second
- [ ] Real-time updates without page refresh
- [ ] Export data to CSV

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.4.1 | Chart Components | `Create components/charts using Recharts. Implement LineChart, BarChart, PieChart with Sleek Enterprise color palette.` |
| 9.4.2 | Dashboard Widgets | `Create reusable dashboard widgets: StatCard, RecentActivity, ShipmentsByStatus. Use consistent styling and animations.` |
| 9.4.3 | Data Export | `Add "Export CSV" button to data tables. Create lib/utils/csvExport.ts that converts array of objects to downloadable CSV file.` |

---

### User Story 9.5: Forms & Validation
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All forms use react-hook-form
- [ ] Validation with Zod schemas
- [ ] Inline error messages

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.5.1 | Form Setup | `Install react-hook-form and zod. Create lib/schemas for Shipment, Buyer, Invoice. Add zodResolver to forms.` |
| 9.5.2 | Form Components | `Create FormInput, FormSelect, FormDatePicker components that integrate with react-hook-form's Controller. Show error messages below fields.` |
| 9.5.3 | Multi-step Forms | `Create components/forms/MultiStepForm.tsx with step indicator, prev/next buttons, validation per step, and summary before submit.` |

---

### User Story 9.6: Loading States & Skeleton UI
**Status:** BACKLOG

**Acceptance Criteria:**
- [ ] All async operations show loading indicators
- [ ] Skeleton screens for data-heavy pages
- [ ] Optimistic UI updates

**Subtasks:**

| ID | Subtask | AI Prompt |
|:---|:--------|:----------|
| 9.6.1 | Skeleton Components | `Create components/ui/Skeleton.tsx with variants: text, circle, rect. Use CSS animation for shimmer effect. Match Sleek Enterprise palette.` |
| 9.6.2 | Page Skeletons | `Create skeleton versions for Shipments list, Dashboard, and Invoice form pages. Show while data loads.` |
| 9.6.3 | Button Loading | `Update Button component to accept isLoading prop that shows spinner and disables button. Prevent double-submit.` |

