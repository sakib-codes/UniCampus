# UI/UX Fix Prompt — UniCampus Web

**Target agent:** Google Gemini 3.8 Flash
**Repository:** `E:\GitHub\UniCampus\unicampus-web`
**Stack:** Next.js 16.4.2 (App Router), React 19.2.8, Tailwind CSS v4, `next-themes` v0.4.6, `framer-motion` v13, `lucide-react`, `recharts` v3.

---

## SECTION 0 — How to execute this prompt

Work through this file **in order**, one section at a time. For each numbered issue:

1. Open the cited file and **read the surrounding code** before editing.
2. Make the change.
3. Verify with `npx tsc --noEmit` (or the project's typecheck script) before moving to the next issue.
4. Run `npm run dev` and visually confirm the affected route in both light and dark themes when the issue is visual.

**Non-negotiable project rules (from `AGENTS.md`):**
- This is **not** the Next.js you know. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/` (resolve from this file's directory — `next` may not be visible from the repo root). Heed deprecation notices.
- The `AGENTS.md` block is auto-written and re-added by `next dev` (verify at `node_modules/next/dist/server/lib/generate-agent-files.js`). **Do not remove it from your diff.** Leave it in the commit so the tree stays clean.

**Do NOT do these:**
- Do not delete a component or CSS rule without grepping for zero remaining references first.
- Do not rewrite `src/lib/theme.ts` wholesale — extend it.
- Do not change the GitHub-dark palette values (`#010409`, `#0D1117`, `#161B22`, `#21262D`, `#30363D`, `#F0F6FC`, `#8D96A0`, `#6E747D`) or the brand indigos (`#5B56F7` light / `#6B66FF` dark). They are the design system's foundation.

**Commit format** — end every commit message with:
```
Co-Authored-By: Claude Code <noreply@anthropic.com>
```
**PR description** — end with:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## SECTION 1 — The three highest-impact issues

These are verified facts about the current tree. Start here.

### 1.1 — Dead animation utilities: 46 usages across 22 files render no animation

`animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-top-2`, `slide-in-from-bottom-2` are **not real Tailwind v4 utilities**. There is no `tailwindcss-animate` in `package.json` and no `@plugin` directive in `src/app/globals.css`, so the compiled stylesheet contains **zero** rules for them. Every element using these classes appears instantly with no transition.

Verified occurrence count: **46 across 22 files** —
`src/app/messages/page.tsx` (10), `src/app/admin/finance/page.tsx` (5), `src/components/layout/AdminHeader.tsx` (3), `src/components/layout/TeacherHeader.tsx` (2), `src/components/layout/MobileNavDrawer.tsx` (2), `src/components/common/CommandPalette.tsx` (2), `src/components/common/KeyboardShortcutsModal.tsx` (2), `src/components/layout/Header.tsx` (2), `src/app/login/page.tsx` (2), `src/app/admin/dashboard/page.tsx` (2), `src/app/admin/settings/page.tsx` (2), `src/app/admin/routine/page.tsx` (2), plus 1 each in `src/app/admin/users/`, `src/app/admin/notices/`, `src/app/admin/departments/`, `src/app/register/`, `src/app/teacher/materials/`, `src/app/teacher/grades/`, `src/app/teacher/attendance/`, `src/components/admin/AdminRoleGate.tsx`, `src/components/admin/SuperAdminGate.tsx`, `src/components/common/MessagingDrawer.tsx`.

**Fix — preferred:** the project already depends on `framer-motion` v13 and already uses it for spotlight cards. Replace the classes with a `motion.div` + `AnimatePresence`:
```tsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    />
  )}
</AnimatePresence>
```
Honor `prefers-reduced-motion` via `useReducedMotion()` from `framer-motion` (the project already imports it elsewhere).

**Fix — acceptable alternative:** install a v4-compatible animation plugin and register it with `@plugin "...";` in `src/app/globals.css`, immediately after `@import "tailwindcss";`. Only pick this if the agent cannot rewrite the 46 call sites.

**Do not "fix"** these — they are valid Tailwind v4 and already work: `w-13`/`h-13`, `hover:scale-130`, `hover:scale-120`, `scale-[1.02]`.

### 1.2 — The `dark:` brand override is a third, competing brand color — 60+ occurrences

`text-brand dark:text-[#817CFF]` appears **60+ times across ~20 files**. But `globals.css` defines the dark brand as `#6B66FF` and `@theme inline` maps `--color-brand → var(--brand-primary)`, so **plain `text-brand` already adapts correctly to dark mode**. The literal `#817CFF` is a third brand value that drifts from the token.

**Fix:** delete the `dark:text-[#817CFF]` half of every such pair. The `text-brand` half is sufficient.

Representative files: `src/app/admin/finance/page.tsx` (~20), `src/app/admin/settings/page.tsx` (8), `src/app/admin/routine/page.tsx` (8), `src/app/admin/departments/page.tsx` (7), `src/app/teachers/page.tsx` (5), `src/app/teacher/routine/page.tsx`, `src/app/teacher/dashboard/page.tsx`, `src/app/teacher/notices/page.tsx`, `src/app/dashboard/page.tsx` (:68, :148), `src/app/materials/page.tsx` (:150), `src/app/register/page.tsx` (:190), `src/app/login/page.tsx` (:124), `src/app/teachers/[id]/page.tsx` (:132), `src/components/layout/Sidebar.tsx` (:73), `src/components/layout/MobileNavDrawer.tsx` (:156, :200).

### 1.3 — Near-zero accessible names on interactive controls

`aria-label` appears only **4 times in the entire `src/app` tree** (`admin/analytics/page.tsx`, `page.tsx`, `teacher/materials/page.tsx` ×2) and `ProfileAvatar.tsx:30`. Meanwhile there are **352 `<button>` elements** and **88 `<label>` elements with 0 `htmlFor`**. `aria-current` appears **nowhere** in the project.

A large number of icon-only buttons rely on `title=` alone — `title` is not announced by most screen readers on focus and is invisible on touch. `src/app/messages/page.tsx` alone has **28** such buttons (lines 718, 724, 784, 809, 915, 940, 980, 988, 996, 1008, 1133, 1144, 1152, 1388, 1396, 1404, 1423, 1455, 1463, 1489, 1532, 1552, 1565, 1582, 1748, 2026, 2038, 2048, 2058).

**Fix:** add `aria-label` to every icon-only control. Keep `title` as a supplementary tooltip. Add `htmlFor` + matching `id` to every `<label>`. Add `aria-current="page"` to active nav links.

---

## SECTION 2 — Design system core (`src/app/globals.css`, `src/lib/theme.ts`)

### 2.1 — Global `*` transition rule causes unintended transitions
`globals.css:304–309` applies `transition-property: background-color, border-color, color;` to **every element**, so non-interactive elements animate on hover. Scope it:
```css
button, [role="button"], a, input, select, textarea, [role="tablist"] {
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}
```

### 2.2 — Broken `!important` escape hatch
`globals.css:312–316` — `*[class*="animate-"], *[class*="transition-transform"], *[class*="transition-opacity"] { transition-property: transform, opacity !important; }`. The `!important` fights Tailwind's own utilities and the attribute-substring selector is far too broad (it also matches `transition-opacity` classes on unrelated components). **Delete the rule.** Tailwind's `transition-transform` / `transition-opacity` work correctly without it.

### 2.3 — Duplicate `:focus-visible` block
`globals.css:319–328` contains the general `:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }` rule **and** a redundant `button:focus-visible, a:focus-visible` block. Merge into one rule (keep the `outline` approach — it is the project-wide focus indicator).

### 2.4 — Dead CSS: `animate-shine`, `glass-effect`, and the hand-rolled component classes
- `globals.css:172–183` — `@keyframes shine` + `.animate-shine`. **Zero consumers:** `ShinyText.tsx` is imported at `src/app/dashboard/page.tsx:25` but never rendered.
- `globals.css:186–196` — `.glass-effect`. Zero call sites.
- `globals.css:198–267` — `.card-elevated`, `.button-primary`, `.button-brand`, `.input-field`, `.badge`, `.badge-brand`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`. Grep for each before deleting; `themeTokens` already provides equivalents (`cardElevated`, `btnPrimary`, `btnBrand`, `input`, `badgeBrand`…).

Also remove the now-unused `ShinyText` import from `src/app/dashboard/page.tsx:25`.

### 2.5 — Font fallback order
`globals.css:138–143` — `font-family: var(--font-sans), Arial, Helvetica, sans-serif;`. Change to `var(--font-sans), system-ui, sans-serif`. Arial/Helvetica are legacy web fonts that break consistency with Geist.

### 2.6 — `suppressHydrationWarning` on `<body>` is unnecessary
`src/app/layout.tsx:38` — remove `suppressHydrationWarning` from `<body>`. It is only required on `<html>` (line 33), which is where `next-themes` injects its class.

### 2.7 — `THEME_PALETTES.light` is dead; `THEME_PALETTES` is a third copy of the palette
`src/lib/theme.ts:7–46`. `THEME_PALETTES` is imported only by `src/app/admin/analytics/page.tsx:26`, and only `.githubDark` is used. The `.light` object (lines 27–46) has zero references. The light values also already exist as CSS custom properties in `globals.css:4–45`.

**Fix:** remove the `.light` sub-object. Optionally reduce `THEME_PALETTES` to the palette actually consumed, or delete it entirely and have `admin/analytics` read the CSS variables. Note that `globals.css` is the canonical source for both themes — `theme.ts` duplicating it is the root cause of the drift documented in 1.2.

### 2.8 — `themeTokens` hardcodes hex instead of referencing the CSS variables
`src/lib/theme.ts:52–116`. Every token is a literal Tailwind arbitrary-value string (`bg-white dark:bg-[#0D1117]`, `text-[#111827] dark:text-[#F0F6FC]`). This means the CSS custom properties in `globals.css` are only half-wired: changing `--brand-primary` in `globals.css` will **not** update `themeTokens`.

**Fix (do this in a way that preserves the exact rendered output):** where `globals.css` already defines a matching `--*` variable that `@theme inline` exposes as a Tailwind color, replace the arbitrary hex with the token utility (e.g. `bg-surface`, `text-primary`, `border-default`, `bg-brand`). Do this **incrementally** — first add any missing `@theme inline` mappings, then convert tokens one at a time, running the dev server to confirm no visual regression.

### 2.9 — `transition-all` on 9 tokens
`themeTokens.btnHero`, `btnPrimary`, `btnBrand`, `btnSecondary`, `btnGhost`, `btnDanger`, `input`, `cardInteractive`, `card3xlInteractive` all use `transition-all`, which animates layout properties (width/height/margin) and causes jank. `themeTokens.cardElevated` correctly uses `transition-shadow` and `themeTokens.select` correctly uses `transition-colors`.

**Fix:** narrow each to the properties that actually change — typically `transition-colors`, `transition-shadow`, or `transition-[color,background-color,border-color,box-shadow]`.

### 2.10 — Missing `textBrand` / `textAccent` tokens
Several call sites want a brand-colored text but reach for `text-indigo-500` / `text-brand dark:text-[#817CFF]`. Add to `themeTokens`:
```ts
textBrand: 'text-brand',
textBrandHover: 'hover:text-brand-hover',
```

### 2.11 — No `SPOTLIGHT` constant — three competing indigos
`SpotlightCard`'s own defaults are `rgba(107, 102, 255, 0.12)` / `rgba(107, 102, 255, 0.4)` (`src/components/bits/SpotlightCard.tsx:15–16`), but call sites use `rgba(99, 102, 241, …)` (`src/app/dashboard/progress/page.tsx:100–151`), `rgba(96, 91, 255, …)` (`src/app/dashboard/page.tsx:132`), and `rgba(107, 102, 255, 0.14)` (`src/app/notices/page.tsx:240–241`, `src/app/students/page.tsx:334–335`).

**Fix:** export a single constant from `src/lib/theme.ts`:
```ts
export const SPOTLIGHT = {
  glow: 'rgba(107, 102, 255, 0.45)',
  wash: 'rgba(107, 102, 255, 0.14)',
} as const;
```
and use it at every call site. Same treatment for the `ClickSpark` / `Aurora` `sparkColor` / `colorStops` hex literals (`src/app/dashboard/page.tsx:65,107`, `src/app/dashboard/progress/page.tsx:81`, `src/app/notices/page.tsx:189`, `src/app/materials/page.tsx:276`, `src/app/teachers/page.tsx:424,642`, `src/app/routine/page.tsx:198`, `src/app/settings/page.tsx:43,64`, `src/app/teacher/dashboard/page.tsx:133–139`) — give `ClickSpark`/`Aurora` a brand-family default and stop passing raw hex.

### 2.12 — Card radius is inconsistent: `card` (rounded-2xl) vs `card3xl` (rounded-3xl) for the same role
Token counts per file: `src/app/dashboard/page.tsx` uses `card3xl` ×5 / `card` ×0; `src/app/dashboard/progress/page.tsx` ×4 / 0; `src/app/routine/page.tsx` ×3 / 0; `src/app/profile/page.tsx` ×5 / 0; `src/app/settings/page.tsx` ×4 / 0; `src/app/notices/[id]/page.tsx` ×3 / 0; `src/app/teachers/[id]/page.tsx` ×4 / 0; `src/app/materials/page.tsx` 0 / ×3; `src/app/notices/page.tsx` ×2 / ×4; `src/app/students/page.tsx` ×2 / ×4; `src/app/teachers/page.tsx` ×3 / ×4.

Concretely the *content card* is `rounded-2xl` on `/materials` but `rounded-3xl` on `/notices` and `/students`.

**Fix:** pick one radius for content cards app-wide (`card3xl` is the dominant one) and reserve `card` for inset/recessed panels. Update `theme.ts` doc comments to say which token is which.

---

## SECTION 3 — Accessibility

### 3.1 — Label/control association
**88 `<label>` elements, 0 `htmlFor`.** Every input/select/textarea needs an `id` and its `<label>` a matching `htmlFor`. Priority locations:
- `src/app/register/page.tsx:243, 261, 278, 294, 312, 327, 341` — 7 labels, 0 `htmlFor`
- `src/app/login/page.tsx` — 2 labels, 0 `htmlFor`
- `src/app/settings/page.tsx:137, 148, 159, 170, 184` — 5 labels, 0 `htmlFor`
- `src/app/materials/page.tsx:176–180, 193–196` — filter `<select>`s labelled with `<span>`, not `<label>`

### 3.2 — Three unlabeled checkboxes
`src/app/settings/page.tsx:202–215, 217–230, 232–245`. Each `<input type="checkbox">` sits opposite an `<h4>` heading and a `<p>` description — a heading is not a label. Wrap the text in `<label htmlFor="…">` or point `aria-labelledby` at the heading's `id`.

### 3.3 — Placeholder-only search inputs
Placeholder-only labelling fails WCAG 3.3.2. Affected: `src/app/materials/page.tsx:208–215`, `src/app/notices/page.tsx:108–113`, `src/app/students/page.tsx:208–213`, `src/app/teachers/page.tsx:155–160`, `src/app/messages/page.tsx:735–741, 1019–1025, 1412–1417, 1879–1886, 1925–1929`.

**Fix:** add `aria-label` (and ideally a `sr-only` `<label>`).

### 3.4 — Icon-only buttons needing `aria-label`
Beyond the 28 in `messages/page.tsx` (Section 1.3), also cover:
- `src/app/teachers/page.tsx:355, 380, 574, 599` — copy-to-clipboard buttons (`title="Copy phone"`, etc.)
- `src/app/teachers/[id]/page.tsx:207, 234` — `title="Copy Phone"` / `title="Copy Email"`
- `src/app/dashboard/page.tsx:414, 564, 597, 658, 687, 1052` — Edit / Approve / Reject / View / Add Course / Call / Toggle notifications
- `src/app/admin/notices/page.tsx:444–465` — Eye / Edit3 / Trash2 buttons (have `title` only)
- `src/app/admin/finance/page.tsx:1066–1073` — receipt button (needs `role="link"` + `aria-label`)
- `src/app/teacher/attendance/page.tsx:144–160` — "Mark All Present" / "Reset" toggle buttons
- `src/app/page.tsx:1442` — password-visibility toggle (~16×16px hit area; also needs `aria-label` and a ≥44×44px hit target)
- `src/app/page.tsx:1228` — modal close button
- `src/app/admin/users/page.tsx:734` — search icon (also needs vertical centering — see 3.8)

### 3.5 — `aria-current` on active navigation
`aria-current` appears **nowhere** in the project. Add `aria-current="page"` to the active item in every nav: `src/app/dashboard/page.tsx:322`, `src/components/layout/Sidebar.tsx`, `AdminSidebar.tsx`, `TeacherSidebar.tsx`, `MobileNavDrawer.tsx`, `src/app/dashboard/progress/page.tsx:342` (also add `role="tablist"` to the activity tab row and `aria-pressed` to toggle buttons), `src/app/admin/dashboard/page.tsx:596–627` (activity filter — no `role="tablist"`).

### 3.6 — Clickable `<div>`s are keyboard-unreachable
- `src/app/messages/page.tsx:781–795` — clickable status-note tray
- `src/app/messages/page.tsx:1777–1781` — clickable photo-grid item
- `src/app/messages/page.tsx:1551, 1564, 1581` — clickable action tiles (`flex flex-col items-center gap-1.5 p-2 … cursor-pointer`)

**Fix:** convert to `<button type="button">` (or add `role="button"`, `tabIndex={0}`, and an `onKeyDown` for Enter/Space).

### 3.7 — `ProfileAvatar` accessible name is always "Profile Icon"
`src/components/common/ProfileAvatar.tsx:14, 30` — `alt = "Profile Icon"` is the default and the component renders `<div aria-label={alt} role="img">`. Every avatar in the app therefore gets the same meaningless name, repeated dozens of times.

**Fix:** default `alt` to `""` (decorative) and let the caller pass a meaningful name; or drop `role="img"` when the adjacent text already names the person. Also: the `size` scale (`xs`…`2xl`, lines 21–28) is defined but nearly every call site passes only `className`/`iconClassName` with hand-written sizes (`w-20 h-20`, `w-16 h-16`, `w-14 h-14`) — the scale is effectively dead. Make `size` the single source of dimension truth and drop the conflicting `className` width/height emission (currently `ProfileAvatar` emits width/height from **both** `size` and `className`, conflicting at `src/components/common/MessagingDrawer.tsx:329`).

### 3.8 — Filter pills blur focus, destroying the focus ring
`src/app/notices/page.tsx:39–42`, `src/app/students/page.tsx:297`, `src/app/teachers/page.tsx:244` — the click handler calls `e.currentTarget.blur()`, so keyboard users lose focus position after every filter change, and the `focus-visible:ring-2` is destroyed by the blur.

**Fix:** don't blur. Move focus to the newly-active pill instead.

### 3.9 — `focus:outline-none` with no replacement ring
`src/components/common/CommandPalette.tsx:376`, `src/components/layout/Header.tsx:151, 164, 179, 274`, `src/app/messages/page.tsx:740, 1417, 1885, 1928` — outline removed with no `focus:ring-*` added. The global `:focus-visible` outline in `globals.css` covers this **only if** `focus:outline-none` doesn't suppress it — it does, on the focused element. Add `focus:ring-2 focus:ring-brand/40 focus:border-brand`.

### 3.10 — Progress bars are visual-only
`src/app/dashboard/page.tsx:193–199` and `src/app/dashboard/progress/page.tsx:254–261` — `motion.div` width animation with no `role="progressbar"`, no `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, no `aria-label`. The percentage exists only as adjacent text that is not programmatically associated.

**Fix:** add `role="progressbar"`, `aria-valuenow={91.5}`, `aria-valuemin={0}`, `aria-valuemax={100}`, and `aria-label` to the track.

### 3.11 — `CountUp` animated numbers are announced as "0" / "0.00"
`src/components/bits/CountUp.tsx:70–74` — the component server-renders `from.toFixed(decimals)` then animates the visible value with framer-motion. There is no `aria-live` region and no `aria-hidden` on the visual layer. Assistive tech reads the *starting* value.

Compare with `src/components/bits/DecryptedText.tsx:602–604`, which correctly renders an `sr-only` copy of the real string — use the same treatment. Applied to the animated layer, and add `aria-hidden="true"`.

Also apply the same `sr-only` + `aria-hidden` treatment to `src/components/bits/BlurText.tsx:19–34` and `src/components/bits/TrueFocus.tsx:168–189`, which currently lack it.

Used at `src/app/dashboard/page.tsx:98`, `src/app/dashboard/progress/page.tsx:111, 135`, `src/app/notices/page.tsx:136, 150, 164, 178`, `src/app/students/page.tsx:236, 250, 264, 278`.

### 3.12 — `TiltedCard` can produce an empty accessible name
`src/components/bits/TiltedCard.tsx:592` — `aria-label={captionText || altText}` yields `aria-label=""` when both are empty. Fall back to `alt`, or omit the attribute entirely when both are absent.

### 3.13 — Splash screen progress has no role or live region
`src/components/splash/SplashScreen.tsx:76–101` — the progress region has no `role="progressbar"` / `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, and the status string is not in a live region. Add `role="progressbar"` with the value attributes and wrap the status text in `aria-live="polite"`.

### 3.14 — "Skip to Portal" is a 12px link with a ~24px target
`src/components/splash/SplashScreen.tsx:94–99` — `text-slate-400` at 12px, target far below 44×44px. Increase the size, use a tokenized muted color, and give it `focus-visible:ring-2`.

---

## SECTION 4 — Dark mode & contrast

### 4.1 — `text-slate-400` used 209 times across 38 files
`text-slate-400` on a white card is ≈2.85:1 — **already fails WCAG AA in light mode**, and where it has no `dark:` counterpart it renders mid-grey on `#0D1117`.

**Fix:** route every one through `themeTokens.textMuted` (`text-[#9CA3AF] dark:text-[#6E747D]`), or at minimum add a `dark:` variant. Highest-count files: `src/app/messages/page.tsx` (28), `src/app/page.tsx` (17), `src/app/teachers/page.tsx` (14), `src/app/dashboard/page.tsx` (7), `src/app/login/page.tsx` (7), `src/app/teacher/dashboard/page.tsx` (7), `src/components/layout/Header.tsx` (13), `src/app/register/page.tsx` (8), `src/app/teachers/[id]/page.tsx` (8), `src/components/layout/AppShell.tsx` (7), plus `src/components/layout/{AdminHeader,TeacherHeader}.tsx` (4 each), `src/app/admin/notices/page.tsx` (6), `src/components/common/CommandPalette.tsx` (6), `src/app/admin/routine/page.tsx` (6), `src/app/teacher/*` pages, `src/components/layout/*Sidebar.tsx` (3 each), `src/components/splash/SplashScreen.tsx`, `src/app/notices/[id]/page.tsx`, `src/app/dashboard/progress/page.tsx`, `src/app/materials/page.tsx`, `src/app/teacher/notices/page.tsx`, `src/app/students/page.tsx`, `src/app/routine/page.tsx`, `src/app/admin/departments/page.tsx`, `src/app/admin/users/page.tsx`, `src/app/admin/analytics/page.tsx`, `src/components/common/{MessagingDrawer,KeyboardShortcutsModal}.tsx`, `src/app/settings/page.tsx`.

### 4.2 — Hardcoded dark call modal with no light variant
`src/app/messages/page.tsx:1963` — the call modal box is `rounded-3xl bg-[#0D1117] border border-[#30363D] … text-white` with **no light-mode variant**, so in light theme it renders a dark panel with `text-white` while every other modal uses `themeTokens.modalBox`. Its control bar at `:2020` is `p-4 bg-[#161B22] border-t border-[#30363D]`, the end-call button at `:2057` is `bg-red-600 hover:bg-red-700`, and the close icon at `:1973` is `text-slate-400 hover:text-white` with no dark variant.

**Fix:** use `themeTokens.modalBox` + `themeTokens.modalOverlay` and tokenize the control bar.

### 4.3 — `bg-white/70 dark:bg-black/40` chips fail contrast in light mode
`src/app/routine/page.tsx:260` and `:363` — `<span className="… ${style.room} bg-white/70 dark:bg-black/40 …">` where `style.room` is `text-blue-500 dark:text-blue-300`. `text-blue-500` on `bg-white/70` is ≈2.6:1.

**Fix:** use `themeTokens.cardRecessed2xl` as the chip surface with a darker text tone.

### 4.4 — 2FA toggle off-state reads as a disabled label
`src/app/settings/page.tsx:264–270` — off-state is `bg-slate-200 dark:bg-[#161B22] text-slate-700 dark:text-[#8D96A0]` with no border, vs the on-state `bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800`.

**Fix:** give the off-state a border and use the same tonal family as the on-state.

### 4.5 — Login and register banners diverge
- `src/app/login/page.tsx:85` — `bg-gradient-to-br from-[#605BFF] via-[#5048E5] to-[#3B34C8]` (light-mode-only gradient), with `bg-white/20` and `text-white/60` decorations.
- `src/app/register/page.tsx:86` — `bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D]` (always-dark slate gradient).

Two different visual languages for sibling pages, neither derived from a token. **Fix:** unify on one brand-indigo gradient derived from `--brand-primary` / `--brand-hover`, applied consistently to both.

### 4.6 — Input icons missing `dark:` variants
`src/app/page.tsx:1404, 1433, 1581, 1599` — input icons have no `dark:` variant, while `src/app/page.tsx:1517, 1523, 1531, 1539` do. Same file, same pattern, inconsistent.

---

## SECTION 5 — Component & layout consistency

### 5.1 — `themeTokens.btnPrimary` is used only 4 times in the entire project
`src/components/common/MessagingDrawer.tsx`, `src/app/login/page.tsx`, `src/app/admin/users/page.tsx`, `src/app/admin/dashboard/page.tsx`. Meanwhile raw `bg-brand hover:bg-brand-hover text-white` appears at `src/app/profile/page.tsx:39–44`, `src/app/settings/page.tsx:46`, `src/app/notices/[id]/page.tsx:160–163`, `src/app/teachers/page.tsx:443`, `src/app/teachers/[id]/page.tsx:148`, `src/app/messages/page.tsx:1901`, and more.

**Fix:** standardize on `themeTokens.btnPrimary` for every primary CTA.

### 5.2 — Same action, two different button treatments, on one page
`src/app/teachers/page.tsx:443` (leadership card) is a **solid** brand button; `src/app/teachers/page.tsx:677` (academic card) is a **tinted** brand button with a border. Both are "Message". Pick one (tinted) and use it for both.

### 5.3 — `themeTokens.btnHero` misused as a tab/selection state
`src/app/routine/page.tsx:208` (mobile day picker) and `:303` (desktop day header) both apply `btnHero` to the *selected* state. `btnHero` is the high-emphasis primary action button (dark fill in light mode, near-white in dark mode) — the day tab row ends up looking like a stack of CTAs.

**Fix:** add a dedicated selected-tab token, e.g. `tabSelected: 'bg-brand/10 text-brand border-brand/30 dark:bg-brand/15'`, and use it.

### 5.4 — Raw Tailwind palette classes bypass tokens
- `src/app/dashboard/page.tsx:40–46` — `quickShortcuts` uses five arbitrary hues (`text-blue-500 bg-blue-500/10`, `text-indigo-500 …`, `text-rose-500 …`, `text-amber-500 …`, `text-emerald-500 …`), making the quick-launch strip the only multi-colored region on the dashboard. Map to the brand family plus one semantic accent token.
- `src/app/routine/page.tsx:139–163` — `getCardClasses` bypasses tokens entirely, using `bg-blue-50/70 dark:bg-blue-950/40`, `text-blue-950 dark:text-blue-100`, `text-blue-600 dark:text-blue-400`, `text-blue-500 dark:text-blue-300` and emerald/amber equivalents. `text-blue-950` / `text-emerald-950` / `text-amber-950` are off-palette for the GitHub-dark system. Express the three variants via the brand token plus opacity, and one neutral variant.
- `src/app/login/page.tsx:186, 203, 219, 235, 251` — raw `purple-50/60`, `purple-500/25`, `purple-600`, `emerald-600`, `amber-600`.
- `src/app/settings/page.tsx` — raw `purple-50`, `purple-500/25`, `purple-600`.

### 5.5 — Two parallel hand-rolled badge systems
- `src/app/notices/page.tsx:59–74` — `getCategoryBadgeClass` re-implements badges with `bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border …` for five categories.
- `src/app/teachers/page.tsx:54–82` — `getStatusBadge` is a second, independent implementation (emerald/amber/purple/blue/slate).

`themeTokens` already ships `badgeBrand` / `badgeSuccess` / `badgeWarning` / `badgeError` / `badgeInfo`. **Fix:** replace both switches with the badge tokens; add status-specific tokens only where the state is genuinely semantic.

### 5.6 — Hardcoded chat theme gradients
`src/app/messages/page.tsx:112–137` — `THEME_GRADIENTS` defines four themes with literal stops: `classic` `from-[#0084FF] via-[#0099FF] to-[#605BFF]`, `violet` `from-[#605BFF] via-[#7B3FE4] to-[#B339E0]`, `sunset` `from-[#FF5E62] via-[#FF758C] to-[#FF9966]`, `emerald` `from-[#059669] via-[#10B981] to-[#34D399]`. The "Messenger Blue" theme is a different hue family from the app's `#5B56F7`/`#6B66FF` brand. Also the `accent` key is declared in all four entries but referenced nowhere — dead.

**Fix:** derive the stops from a single brand-family constant; delete the unused `accent` key.

### 5.7 — Leadership card is a third card style
`src/app/teachers/page.tsx:294–299` — amber border, `hover:shadow-[0_12px_32px_-4px_rgba(245,158,11,0.12)]`, and a `bg-gradient-to-br from-amber-500/10 to-transparent` corner wash, plus a `rounded-2xl` avatar (`:306`) where every other avatar is `rounded-full`. Peer cards use `hover:border-slate-300 dark:hover:border-[#6E747D]/80 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)]` with `borderGlowColor="rgba(107, 102, 255, 0.45)"`.

**Fix:** express "featured" via a single accent-border token; keep the radius and avatar shape consistent.

### 5.8 — Filter pill rows don't match across pages
`src/app/teachers/page.tsx:247` uses `px-4 py-2.5 rounded-full` + `transition-all` + `shadow-sm shadow-brand/30`, while the identical rows at `src/app/notices/page.tsx:200` and `src/app/students/page.tsx:299` use `px-5 py-2.5` + `transition-colors` + `shadow-sm shadow-brand/25`.

**Fix:** extract a shared `FilterPill` component in `src/components/common/`.

### 5.9 — Header lacks `backdrop-blur`
`src/components/layout/Header.tsx:102` — the student header has no `backdrop-blur`, while `src/components/layout/AdminHeader.tsx:124` and `src/components/layout/TeacherHeader.tsx:81` both use `backdrop-blur-md`. Add it for consistency.

### 5.10 — Theme toggle logic is wrong when the system theme is active
`setTheme(theme === 'dark' ? 'light' : 'dark')` appears at `src/components/layout/Header.tsx:148`, `AdminHeader.tsx:289`, `TeacherHeader.tsx:143`, `src/components/layout/AppShell.tsx:79`, `src/components/layout/MobileNavDrawer.tsx:231`. The provider is configured with `defaultTheme="system" enableSystem`, so `theme` is `"system"` until the user picks a mode — the toggle then computes `"dark"` (because `"system" !== "dark"`) and jumps straight to dark, skipping light. The matching icon at `Header.tsx:154` has the same bug.

**Fix:** use `resolvedTheme` for the icon and the toggle:
```ts
const { resolvedTheme, setTheme } = useTheme();
setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
```

### 5.11 — Focus rings removed with no replacement
Covered in 3.9.

### 5.12 — `focus:outline-none` on the dashboard scroll area / command palette
`src/components/common/CommandPalette.tsx:376` and `src/components/common/KeyboardShortcutsModal.tsx` — the modal's inner input loses the focus indicator entirely. Covered in 3.9.

### 5.13 — Unused `transition-all` across the codebase
**199 occurrences** of `transition-all` project-wide. Where the element only changes color, use `transition-colors`; where it only changes shadow, `transition-shadow`. This is a broad but mechanical pass — prioritise the 9 theme tokens in 2.9 and any element with a `scale` transform in the same class list.

### 5.14 — Sidebar footer band is copy-pasted 4×
`p-3 border-t ${themeTokens.border} bg-slate-50/50 dark:bg-[#010409]/60` at `src/components/layout/Sidebar.tsx:152`, `AdminSidebar.tsx:178`, `TeacherSidebar.tsx:145`, `MobileNavDrawer.tsx:212`. Extract to a shared `SidebarFooter` component.

### 5.15 — `AppShell` status bar is copy-pasted 3×
`src/components/layout/AppShell.tsx:150–172, 189–211, 227–253` — three near-identical status bars for admin/teacher/student. Extract to one `<StatusBar>` component.

### 5.16 — Sidebar active-item styling diverges
`src/components/layout/AdminSidebar.tsx:148–149` uses `bg-purple-600 text-white font-bold shadow-sm` (super admin) or `bg-blue-600 text-white`, while `Sidebar.tsx` / `TeacherSidebar.tsx` use `bg-brand text-white shadow-sm font-bold`. Two different active colors for the same affordance.

**Fix:** use `bg-brand` everywhere, or add explicit `roleAccent` tokens if purple/blue are semantically required.

### 5.17 — Sidebar collapse handles use `transition-all` + `hover:scale-110`
`src/components/layout/Sidebar.tsx:93`, `AdminSidebar.tsx:122`, `TeacherSidebar.tsx:96` — `hover:scale-110 transition-all z-30`. Use `transition-transform` and add `motion-reduce:` handling (see 6.3).

---

## SECTION 6 — Responsive & layout

### 6.1 — Desktop timetable forces horizontal scroll
`src/app/routine/page.tsx:286–287` — `<div className="hidden md:block … overflow-x-auto …">` wrapping `<div className="min-w-[900px]">`. At 1024px (i.e. `md:` and up) the 900px-min grid plus card padding overflows the viewport, and the time column is squeezed against 6 fixed day columns (`grid-cols-12` at `:289`, `col-span-10 grid-cols-6` at `:294`).

**Fix:** drop `min-w-[900px]` and make the day grid responsive: `grid-cols-2 md:grid-cols-3 xl:grid-cols-6`.

### 6.2 — The timetable is implemented twice with different visuals
`src/app/routine/page.tsx:196` (mobile: `block md:hidden space-y-5`) vs `:286` (desktop: `hidden md:block`). Different card treatments (`:250` `${themeTokens.card3xl} p-5 border-l-4` vs `:349` `h-28 rounded-2xl p-3.5 … ${style.container}`) and different room-chip markup (`:260` vs `:363`) — so a lecture looks different at 767px than at 768px.

**Fix:** one data-driven card component used by both layouts.

### 6.3 — Rotation animations ignore `prefers-reduced-motion`
`src/components/layout/Header.tsx:155, 157` — `hover:rotate-45` / `hover:-rotate-12` on the theme-toggle icons. `src/app/globals.css:172–183` (the `shine` keyframes) has no reduced-motion guard either (though that rule is being deleted in 2.4).

**Fix:** add `motion-reduce:transition-none motion-reduce:rotate-0` to the transforms, and guard any remaining keyframe animation with:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.4 — Login/register card is unreachable on short screens
`src/app/login/page.tsx:82` and `src/app/register/page.tsx:83` — `rounded-[36px] sm:rounded-[44px] … min-h-[640px]` with **no `overflow-y-auto`**. On a 568px-tall viewport the form is cut off and cannot be scrolled to.

**Fix:** add `max-h-[calc(100vh-2rem)] overflow-y-auto` to the card and `overflow-y-auto` to the inner form column.

### 6.5 — Three fixed-width columns in the messenger
`src/app/messages/page.tsx:696, 701, 1479` — column 1 is `w-full md:w-80 lg:w-[350px]`, column 3 is `w-80 lg:w-[320px]` (`shrink-0`). At `md` (768px) the sidebar alone takes 320px, and with the details column open the message stream is squeezed to a few hundred pixels with no stacking behavior.

**Fix:** make the details column an overlay/drawer below `xl`, or use a grid that collapses the third column.

### 6.6 — Profile page wastes width at `lg`
`src/app/profile/page.tsx:49` — `grid grid-cols-1 xl:grid-cols-2 gap-6`. Below 1280px the four information cards stack one-per-row. **Fix:** `grid-cols-1 md:grid-cols-2`.

### 6.7 — Dashboard pinned-notice header can collide on mobile
`src/app/dashboard/page.tsx:206–244` — the flex row has no `flex-wrap`, so a long notice title and the "View All" affordance collide at 360px. **Fix:** add `flex-wrap` and `min-w-0 truncate` on the title.

### 6.8 — Dashboard ribbon: first cell missing the row padding
`src/app/page.tsx:404` — the pulse ribbon is `grid grid-cols-2 sm:grid-cols-4` with `divide-y sm:divide-y-0 sm:divide-x` + `gap-4`; cell 1 lacks the `pt-4 sm:pt-2` that the other three cells have.

### 6.9 — Floating HUD button
`src/app/page.tsx:231` — `fixed bottom-6 right-6 … hidden sm:flex`. Verify it does not overlap the mobile nav or the messenger FAB; the `sm:` breakpoint may be too low.

### 6.10 — Modal nested scroll containers
`src/app/page.tsx:1208` — the overlay is `fixed inset-0 z-[100] … overflow-y-auto` wrapping a `max-h-[92vh] overflow-y-auto` card. Two nested scrollers. **Fix:** keep scroll on the overlay only, or on the card only.

### 6.11 — `CommandPalette` modal box has no `max-h`
`src/components/common/CommandPalette.tsx:364` — the modal box has no max height (only the results list at `:395` does, `max-h-[380px]`). On a short viewport the box overflows. Add `max-h-[85vh] flex flex-col` to the box and `min-h-0` to the list.

`src/components/common/KeyboardShortcutsModal.tsx:80` — content is `max-h-[420px] overflow-y-auto` but the box has no `max-h`. Same fix.

### 6.12 — `MessagingDrawer` missing `min-h-0` and body scroll lock
`src/components/common/MessagingDrawer.tsx:227` — the list pane has no `min-h-0`, so it cannot shrink inside a flex column. The overlay at `:222–224` is `fixed inset-0 z-50` with no body scroll lock. Also `iconClassName="w-4.5 h-4.5"` at `:329` is not a valid Tailwind size (should be `w-4 h-4` or `w-[18px] h-[18px]`).

---

## SECTION 7 — Structure & duplication

### 7.1 — Do NOT treat `/student` as a duplicate — it is a redirect
`src/app/student/page.tsx` is **6 lines**: `import { redirect } from "next/navigation"; export default function StudentPage() { redirect("/dashboard"); }`. `src/components/layout/Sidebar.tsx:30` and `src/components/layout/MobileNavDrawer.tsx:84` link to `/students` (plural); nothing links to `/student`. **No fix needed.** Do not create a shared shell here.

### 7.2 — The real duplicate: `/dashboard` and `/teacher/dashboard`
`src/app/dashboard/page.tsx` (419 lines) vs `src/app/teacher/dashboard/page.tsx` (357 lines) duplicate the header chrome (`h-16 flex items-center justify-between px-4 sm:px-6 border-b … z-30`), the sidebars, the chapter tiles, the ribbon grid, and the status bar.

**Fix:** extract `src/components/layout/DashboardShell.tsx` accepting a `variant: 'student' | 'teacher'` prop, and have both pages supply only their content.

### 7.3 — The real duplicate: notice managers in `/notices` and `/teachers/[id]`
Both render a filter row, a results list, `<NoticeCardDetail>`, `<NoticeCreateModal>` and `<NoticeSearchModal>` — identical except for an `isActiveTeacher` branch. Extract `src/components/common/NoticeManager.tsx` accepting a `role` prop.

### 7.4 — Admin dashboard duplicates other admin pages
`src/app/admin/dashboard/page.tsx:385–485` re-implements the "Express Notice Composer" from `src/app/admin/notices/page.tsx:710–889`, and `:487–582` re-implements the department health table from `src/app/admin/departments/page.tsx:439–499`. Extract both.

### 7.5 — Admin notices: toast/banner duplicated 4×
`src/app/admin/notices/page.tsx:239–320` — the same toast/banner markup appears four times. Extract a `<Toast>` component.

### 7.6 — Orphaned components (~1,700 lines)
`src/components/bits/PixelCard.tsx` (678 lines), `TiltedCard.tsx` (692 lines), `TrueFocus.tsx` — all have **zero consumers**. `ShinyText.tsx` is imported by `src/app/dashboard/page.tsx:25` but never rendered.

**Do not delete blindly.** First confirm zero references (grep the import path, not just the file name). Then either delete them or move them to a documented `experimental/` folder with a README explaining they are unreleased. Whichever is chosen, remove the now-dead `.animate-shine` CSS (2.4) and the unused `ShinyText` import.

### 7.7 — `TiltedCardLayer` is missing `pointer-events-none`
`src/components/bits/TiltedCard.tsx:137–144` — the decorative layer does not set `pointer-events-none`, so it can intercept clicks over the card content.

### 7.8 — `PixelCard` focus management
`src/components/bits/PixelCard.tsx:667` — `tabIndex={focusOff ? -1 : 0}`. If the component is retained, verify the tab-stop behavior is intentional.

### 7.9 — `template.tsx` mixes spring and duration
`src/app/template.tsx:8–16` — `transition={{ type: "spring", stiffness: 260, damping: 25, duration: 0.3 }}`. In framer-motion, `duration` is ignored when `type: "spring"` is set. Remove `duration` (or switch to `type: "tween"`).

---

## SECTION 8 — Data density, empty states, data-viz

### 8.1 — No empty state for a zero-message conversation
`src/app/messages/page.tsx:1101` — the stream is `{activeConv.messages.map(...)}` with no guard. A conversation with `messages: []` renders a blank pane under the "Today" separator (`:1093–1099`). The file *does* have an empty state for "no chats match search" (~`:833–837`), so the pattern exists but wasn't applied to the thread. **Fix:** add a "Start the conversation" empty state.

### 8.2 — Progress page: three stat cards, three unrelated color systems
`src/app/dashboard/progress/page.tsx:100–151` — card 1 `rgba(99,102,241,0.15)`/`(0.45)`, card 2 `rgba(16,185,129,…)`, card 3 `rgba(245,158,11,…)`. Covered by 2.11.

### 8.3 — Timeline rail uses magic-number offsets
`src/app/dashboard/progress/page.tsx:171` — `<div className="absolute left-[35px] md:left-[43px] top-6 bottom-12 w-0.5 bg-slate-200 dark:bg-[#30363D]">` is hand-aligned to the 24px dot at `:186` inside a container padded `pl-6 md:pl-8` (`:169`). Any change to the dot size or container padding breaks the rail.

**Fix:** use a `border-left` on the list container instead of an absolutely-positioned rail.

### 8.4 — Double vertical spacing on the card footer
`src/app/notices/page.tsx:269` — `pt-4 border-t ${themeTokens.border} flex items-center justify-between text-xs mt-4`. `pt-4` and `mt-4` stack, giving 32px of space above the rule where 16px was intended. Drop one.

### 8.5 — `last:border-0` on definition rows is fragile
`src/app/profile/page.tsx:57–76, 82, 116, 142` — each row is `flex justify-between items-center py-2 border-b ${themeTokens.border} last:border-0` inside a `flex flex-col gap-4` container. The rows use `gap-4` *plus* `py-2` *plus* a border, producing 16px gaps with borders floating between them.

**Fix:** use `divide-y` on the container and drop the per-row border.

### 8.6 — `/materials` has no KPI bar
`/notices` (`:129–185`), `/students` (`:229–284`), `/teachers` (`:176–233`) and `/dashboard/progress` (`:101–151`) all open with a 3–4 tile KPI row. `/materials` goes straight from the header to the filter bar (`:171`). Add a matching KPI row, or accept the difference deliberately and note it in a comment.

### 8.7 — Analytics page uses inline hex for tooltips and chart colors
`src/app/admin/analytics/page.tsx:62–71` — inline tooltip styles with raw `#FFFFFF` / `#0F172A` / `#64748B`. `:501–512` — gradient stops `#605BFF` / `#f43f5e`, axis ticks `fill: '#6E747D'`. `:533–538` — legend dots `bg-indigo-500` / `bg-amber-400`. `:146, 158, 171` — `ClickSpark sparkColor="#605BFF"`. `:194` on the dashboard — `sparkColor={["#605BFF", "#10B981", "#F59E0B", "#EC4899"]}`.

**Fix:** pull these into the token system so charts follow the theme.

### 8.8 — Recharts is used in exactly one file
`src/app/admin/analytics/page.tsx` is the only consumer of `recharts` v3. Do **not** remove the dependency (it is genuinely used) — but be aware that adding recharts to any other page will pull ~150KB into that route's bundle. Prefer the existing CSS/Token-based visuals elsewhere.

---

## SECTION 9 — Performance

### 9.1 — Scroll telemetry re-renders a 1,762-line component
`src/app/page.tsx:96–135` — a `useEffect` sets `scrollPercent` on **every** scroll event, re-rendering the entire landing page component.

**Fix:** throttle with `requestAnimationFrame`, or use a `useRef` for the raw value and only `setState` on a throttled interval. Even better: move the scroll-dependent UI into its own small component so only it re-renders.

### 9.2 — Nested `ClickSpark` wrappers create non-sequential tab stops
`src/app/admin/users/page.tsx:455–468, 580–600` — `ClickSpark` wraps interactive elements, injecting a `<span>` (or similar) between the focusable control and its accessible name. Verify the DOM order and that the Spark layer is `aria-hidden` (as `ClickSpark.tsx:393` already does for spawned canvases).

---

## SECTION 10 — Completion checklist

Before opening the PR, confirm each of these:

- [ ] `npx tsc --noEmit` passes with no new errors
- [ ] `npm run build` succeeds
- [ ] The `AGENTS.md` block is **still present** in the diff (do not remove it)
- [ ] Light theme checked on: `/`, `/login`, `/register`, `/dashboard`, `/messages`, `/routine`, `/materials`, `/notices`, `/students`, `/teachers`, `/settings`, `/profile`, `/admin/analytics`, `/admin/finance`, `/admin/notices`
- [ ] Dark theme checked on the same list
- [ ] Every changed file diff-reviewed for unintended visual drift
- [ ] No new raw hex introduced outside `src/lib/theme.ts` and `src/app/globals.css`
- [ ] `grep -rn "animate-in " src/` returns **0** (Section 1.1 resolved)
- [ ] `grep -rn "dark:text-\[#817CFF\]" src/` returns **0** (Section 1.2 resolved)
- [ ] Every icon-only button has an `aria-label` (Section 3.4)
- [ ] Every `<label>` has a matching `htmlFor` (Section 3.1)
- [ ] Active nav items have `aria-current="page"` (Section 3.5)
- [ ] `grep -rn "text-slate-400" src/` count has dropped substantially (Section 4.1)

---

## Appendix — Verified correction log

Two claims from earlier drafts of this audit were **wrong** and must not be acted on:

1. **"`/student` and `/students` are duplicate implementations."** — False. `src/app/student/page.tsx` is a 6-line `redirect("/dashboard")`. Nothing links to `/student`. See 7.1.
2. **"`font-mono` falls back to Tailwind's default `ui-monospace` stack."** — False. The compiled CSS contains `.font-mono { font-family: var(--font-geist-mono); }`, so `font-mono` correctly resolves to Geist Mono. No change needed.
3. **"`teacher/attendance` table lacks `overflow-x-auto`."** — False. `src/app/teacher/attendance/page.tsx:219` has it.

Two more to leave alone:
4. `w-13` / `h-13`, `hover:scale-130`, `hover:scale-120`, `scale-[1.02]` are **valid Tailwind v4** utilities. Do not "fix" them.
5. `src/app/teacher/attendance/page.tsx:219` — the `overflow-x-auto` is present and correct.
