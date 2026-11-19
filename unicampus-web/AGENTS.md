<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# UniCampus Web — Agent Operating Directive & Conventions

> **Framework:** Next.js 16.4.6 (App Router) • React 19.2.8 • Tailwind CSS v4 • Framer Motion v13  
> **Master Router:** [`../AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/AGENTS.md) • **Web Architecture Context:** [`WEB_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/WEB_CONTEXT.md)

---

## 1. Web Fast Rules (Token-Efficient Reference)

1. **Next.js 16 App Router & Shell Architecture**:
   - All pages reside in `src/app/**/page.tsx`.
   - Layouts reside in `src/app/**/layout.tsx`. All roles (Student, Faculty, Admin) are unified under `src/components/shell/PortalShell.tsx` mounted via `src/components/layout/AppShell.tsx`.
   - Shell components (`SideNav`, `TopBar`, `BottomTabs`, `NotificationsMenu`, `AccountMenu`, `MoreSheet`) live in `src/components/shell/`.
   - Mark client components explicitly with `'use client';` at the top of the file when using hooks, state, or event handlers.
   - Server components are default. Never add `'use client'` unless interactivity is strictly necessary.

2. **Tailwind CSS v4 & Styling Rules**:
   - Tailwind v4 does not use `tailwind.config.js`. CSS configuration is defined directly in `src/app/globals.css`.
   - **Dead Animation Utility Prohibition**: Do **not** use `animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-top-2`, or `slide-in-from-bottom-2`. These classes do not exist in Tailwind v4 and produce 0 animation. Use `framer-motion` (`motion.div`, `AnimatePresence`) for micro-interactions and transitions.
   - **Calm Campus Palette Adherence**:
     - Light Mode: Canvas `#F5F5FA` (`--canvas`), Surface `#FFFFFF` (`--surface`), Border `#E7E7F0` (`--line`), Brand Indigo `#605BFF` (`--brand`).
     - Dark Mode: Canvas `#0B0B10`, Surface `#15151D`, Border `#262630`, Brand Indigo `#7C78FF`.
     - Always use semantic classes (`bg-canvas`, `bg-surface`, `border-line`, `text-fg`, `text-fg-muted`, `bg-brand`, `text-brand-fg`). Avoid hardcoded hex classes.
   - **UI Primitives & Retirement of Gimmicks**:
     - Use `@/components/ui/` primitives for all standard UI: `Button`, `Card`, `PageHeader`, `Stat`, `Badge`, `Chip`, `ListRow`, `DataTable`, `Tabs`, `Modal`, `Sheet`, `Toast`, `EmptyState`, `Skeleton`, `Avatar`.
     - Gimmicks (`SpotlightCard`, `PixelCard`, `Aurora`, `BlurText`, `ShinyText`, `TiltedCard`, `DecryptedText`, `StarBorder`, `TrueFocus`, `ClickSpark`) have been removed.

3. **Role Gates & Layout Protection**:
   - **Student routes**: Standard routes wrapped by `PortalShell` via `AppShell.tsx`.
   - **Admin routes** (`src/app/admin/*`): Wrapped with `AdminRoleGate.tsx` and access auth state via `AdminAuthContext.tsx`.
   - **Teacher routes** (`src/app/teacher/*`): Wrapped with `TeacherRoleGate.tsx`.

4. **Zero Evaporation Rule**:
   - Never remove existing components or utility functions without verifying zero usages across `src/` using `grep` or search.
   - Do not remove the `<!-- BEGIN:nextjs-agent-rules -->` block above.

---

## 2. Pre-Flight & Post-Flight Checklist for Web Agents

### Pre-Flight:
1. Verify task requirements against [`WEB_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/WEB_CONTEXT.md) to understand existing components and service layers.
2. Check [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) Web Feature Matrix to ensure you don't rebuild already completed features.
3. Check [`../BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md) for known web issues.

### Post-Flight:
1. Run TypeScript typecheck: `npx tsc --noEmit`.
2. Run linter: `npm run lint`.
3. Update [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) to mark completed items `[x]`.
4. If a bug was fixed or discovered, log it in [`../BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md).
