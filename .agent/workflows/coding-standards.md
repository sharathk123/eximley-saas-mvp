---
description: Coding standards and instructions for AI agents working on Eximley EXIM SaaS
---

# Eximley Coding Standards

Follow these instructions when working on this project.

---

## 🚨 CRITICAL BEHAVIOR RULES

### 1. NO HALLUCINATION
- **Only implement what is explicitly asked** - Do not invent features
- **If unsure, ASK** - Never assume requirements
- **Verify file exists before editing** - Use `view_file` first
- **Check existing patterns** - Follow what's already in the codebase

### 2. NO EXTRA WORK
- **Do exactly what is requested** - Nothing more, nothing less
- **Do not refactor unrelated code** - Stay focused on the task
- **Do not add "nice to have" features** - Wait for explicit requests
- **Do not change file structure** - Unless specifically asked

### 3. PRESERVE EXISTING FUNCTIONALITY
- **Run `npm run build` before finishing** - Ensure no compilation errors
- **Test affected flows** - Verify you didn't break anything
- **Keep backward compatibility** - Don't change existing interfaces
- **Review your changes** - Check diff before committing

### 4. WHEN IN DOUBT
- Ask the user for clarification
- Show what you plan to do before doing it
- Provide options if multiple approaches exist

### 5. STATE & CONTEXT AWARENESS

#### Before Starting Any Task:
1. **Check PROJECT_KANBAN.md** - See what's already done, in progress, or planned
2. **Read the conversation summary** - Don't repeat work from previous sessions
3. **Search codebase first** - Use `grep_search` to find existing implementations
4. **Check if feature exists** - Before creating, verify it doesn't already exist

#### After Completing a Task:
1. **Update PROJECT_KANBAN.md** - Mark stories/subtasks as complete
2. **Summarize what was done** - So next session doesn't redo it
3. **Note any blockers** - Document issues for future sessions

#### Files to Check Before Working:
| File | Purpose |
|:-----|:--------|
| `PROJECT_KANBAN.md` | Current sprint, completed tasks |
| `lib/workflow.ts` | Workflow states (don't recreate) |
| `lib/services/` | Existing services (don't duplicate) |
| `components/ui/` | UI components (reuse, don't recreate) |

#### Common Duplications to Avoid:
- ❌ Creating a new Button when `components/ui/button.tsx` exists
- ❌ Adding workflow states when they're in `lib/workflow.ts`
- ❌ Building PDF service when `lib/services/pdfService.ts` exists
- ❌ Adding AI integration when `lib/services/aiService.ts` exists
- ❌ Creating modals when pattern exists in other components

---


## 🏗️ Tech Stack (Do Not Deviate)

| Layer | Technology |
|:------|:-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Radix UI |
| State | Zustand (client), TanStack Query (server) |
| Forms | react-hook-form + Zod |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Workflow | Camunda 8 (Zeebe) |
| AI | OpenAI / Qwen API |
| PDF | jsPDF + jspdf-autotable |

---

## 📁 File Structure

```
app/                    # Next.js App Router pages
  api/                  # API routes
  (auth)/               # Auth pages (login, signup)
  dashboard/            # Dashboard page
  shipments/            # Shipments list and detail
  admin/                # Admin dashboard

components/
  ui/                   # Reusable UI components (Button, Card, Modal)
  layout/               # Layout components (Sidebar, Header)
  workflow/             # Workflow-specific components
  admin/                # Admin-specific components

lib/
  services/             # Business logic services (aiService, pdfService)
  camunda/              # Camunda client and workers
  auth/                 # Auth utilities
  utils.ts              # Shared utilities
  workflow.ts           # Workflow state definitions

types/                  # TypeScript type definitions
```

---

## 🎨 UI/UX Guidelines (STRICTLY FOLLOW)

### Design System: "Sleek Enterprise"
- **Primary Color**: Indigo (`indigo-600`)
- **Accent**: Emerald for success, Amber for warnings, Red for errors
- **Background**: Slate-50 to Slate-100 (NEVER pure black)
- **Text**: Slate-800 (headings), Slate-600 (body)

### Component Styling
```tsx
// ✅ DO: Use btn-sleek-primary class
<Button className="btn-sleek-primary">Submit</Button>

// ✅ DO: Use consistent border-radius
className="rounded-xl" // Cards
className="rounded-lg" // Buttons, inputs

// ❌ DON'T: Use black backgrounds
className="bg-black" // NEVER
```

### Typography
- Headings: `font-black` with `tracking-tight`
- Labels: `text-xs font-black uppercase tracking-widest text-slate-400`
- Body: `text-sm text-slate-600`

---

## 🏛️ ARCHITECTURAL PATTERNS (MANDATORY)

### Component Architecture
```
components/
├── ui/           # Atomic components (Button, Input, Modal) - REUSE THESE
├── layout/       # Page structure (Sidebar, Header) - DO NOT DUPLICATE
├── workflow/     # Business logic components - ONE per feature
└── admin/        # Admin-only components
```

### RULE: Check Before Creating
```bash
# Before creating ANY component, search first:
grep -r "ComponentName" components/

# If it exists, IMPORT IT. Do not create a new one.
```

### Standard Component Patterns

#### Cards (use this exact pattern)
```tsx
<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <h3 className="text-lg font-black text-slate-800 mb-2">Title</h3>
  <p className="text-sm text-slate-600">Content</p>
</div>
```

#### Modals (use this exact pattern)
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800">{title}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

#### Tables (use this exact pattern)
```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-slate-200">
      <th className="text-left text-xs font-black uppercase tracking-widest text-slate-400 py-3 px-4">Column</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-3 px-4 text-sm text-slate-600">Data</td>
    </tr>
  </tbody>
</table>
```

#### Buttons
```tsx
// Primary Action
<Button className="btn-sleek-primary">Submit</Button>

// Secondary Action  
<Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</Button>

// Danger Action
<Button className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
```

#### Form Inputs
```tsx
<div className="space-y-2">
  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Label</label>
  <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
</div>
```

### Page Layout Pattern
```tsx
export default function PageName() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Page Title</h1>
        <p className="text-slate-600 mt-1">Description</p>
      </div>
      
      {/* Page Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### Status Badges (use exact colors)
```tsx
const STATUS_COLORS = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700', 
  error: 'bg-red-100 text-red-700',
  info: 'bg-indigo-100 text-indigo-700',
  neutral: 'bg-slate-100 text-slate-700'
};
```

### Icon Usage
- Use `lucide-react` icons ONLY
- Standard sizes: `size={16}` small, `size={20}` medium, `size={24}` large
- Always add `className="text-slate-400"` or appropriate color

### Animation Standards
- Use `framer-motion` for animations
- Entrance: `initial={{ opacity: 0 }} animate={{ opacity: 1 }}`
- Transitions: `transition={{ duration: 0.2 }}`
- Modal overlays: `bg-black/50`

---


## 🗄️ Multi-Tenancy Rules

### CRITICAL: Every Data Table Must Have `company_id`
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  -- other columns
);
```

### CRITICAL: Apply RLS to Every Table
```sql
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company data"
ON shipments FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));
```

### In API Routes
```typescript
// ✅ DO: Always filter by company_id
const { data } = await supabase
  .from('shipments')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ DON'T: Query without company filter
const { data } = await supabase.from('shipments').select('*');
```

---

## 📝 Code Style

### TypeScript
- Always use explicit types, avoid `any`
- Use interfaces for objects, types for unions
- Suffix interfaces with purpose: `ShipmentData`, `QuotationResponse`

### Components
```tsx
// ✅ DO: Use named exports
export function ShipmentCard({ shipment }: { shipment: Shipment }) {}

// ✅ DO: Destructure props
export function Button({ children, variant = 'primary', ...props }) {}

// ❌ DON'T: Use default exports for components
export default function ShipmentCard() {} // Avoid
```

### API Routes
```typescript
// ✅ DO: Use proper error handling
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // validate with Zod
    const validated = shipmentSchema.parse(body);
    // ... logic
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

---

## 🔄 Workflow States

### Export Lifecycle
```
ENQUIRY_RECEIVED → QUOTATION_DRAFTING → QUOTATION_SENT → 
ORDER_CONFIRMED → PRODUCTION → SHIPPING_BILL → IN_TRANSIT → DELIVERED
```

### Import Lifecycle
```
SUPPLIER_SELECTION → PI_RECEIVED → PI_APPROVED → PAYMENT_INITIATED → 
SHIPMENT_DISPATCHED → BOE_FILED → CUSTOMS_CLEARED → DELIVERED
```

---

## 📄 Document Types

| Code | Document |
|:-----|:---------|
| PI | Proforma Invoice |
| CI | Commercial Invoice |
| PL | Packing List |
| BL | Bill of Lading |
| SB | Shipping Bill |
| BOE | Bill of Entry |
| BRC | Bank Realization Certificate |

---

## ⚙️ Camunda Integration

### Job Types (use exact names)
- `ai-quotation-draft` - AI drafts quotation
- `generate-pdf` - Generate PDF document
- `send-notification` - Send email/SMS
- `compliance-check` - Run compliance validation

### BPMN Best Practices
- Use meaningful process IDs: `export_shipment`, `import_shipment`
- Service tasks must have `type` matching worker subscription
- User tasks need `assignee` or `candidateGroups`

---

## 🧪 Testing Requirements

### Unit Tests
- All services in `lib/services/` must have tests
- Mock external APIs (OpenAI, Supabase, Camunda)

### E2E Tests
- Cover complete Export workflow
- Cover complete Import workflow
- Test auth flow (login, logout, protected routes)

---

## 📦 Git Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation only
style: Formatting, no code change
refactor: Code restructuring
test: Adding tests
chore: Build process, dependencies
```

Example:
```
feat: Add AI quotation drafting with Qwen integration

- Create aiService with generateAIQuotation()
- Add PDF generation for quotations
- Integrate with ReplyQuotationView component
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Never use `any` type** - Always define proper types
2. **Never query without company_id filter** - Multi-tenancy breach
3. **Never use pure black (#000)** - Use slate palette
4. **Never skip form validation** - Use Zod schemas
5. **Never hardcode secrets** - Use environment variables
6. **Never forget loading states** - Show skeletons/spinners
7. **Never ignore errors** - Log and show user-friendly messages

---

## 🚀 Before Submitting Code

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All new services have tests
- [ ] RLS policies applied to new tables
- [ ] Loading and error states handled
- [ ] Mobile responsive
- [ ] Commit message follows convention
