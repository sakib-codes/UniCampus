# Fix Prompt — Student Roster Contains The Authenticated Reader

**Target agent:** Google Gemini Flash 3.8 (Antigravity)
**Repository:** `E:\GitHub\UniCampus\unicampus-web`
**Stack:** Next.js 16.4.2 (App Router), React 19.2.8, Tailwind CSS v4, `framer-motion` v13, `lucide-react`
**Severity:** MAJOR (verified, `verification-result.json`)

---

## SECTION 0 — How to execute this prompt

Work through this file **in order**. For each file:

1. Open the cited file and **read the surrounding code** before editing.
2. Make the change.
3. Verify with `npx tsc --noEmit` in `E:\GitHub\UniCampus\unicampus-web` before moving on.
4. Run `npm run dev` and visually confirm the affected route in **both light and dark** themes.

**Non-negotiable project rules (from `AGENTS.md`):**
- This is **not** the Next.js you know. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/` (resolve from this file's directory — `next` may not be visible from the repo root). Heed deprecation notices.
- The `AGENTS.md` block is auto-written and re-added by `next dev` (verify at `node_modules/next/server/lib/generate-agent-files.js`). **Do not remove it from your diff.**

**Do NOT do these:**
- Do not delete a component or CSS rule without grepping for zero remaining references first.
- Do not rewrite `src/lib/theme.ts` wholesale — extend it.
- Do not change the GitHub-dark palette values (`#010409`, `#0D1117`, `#161B22`, `#21262D`, `#30363D`, `#F0F6FC`, `#8D96A0`, `#6E747D`) or the brand indigos (`#5B56F7` light / `#6B66FF` dark).

**Commit format** — end every commit message with:
```
Co-Authored-By: Claude Code <noreply@anthropic.com>
```
**PR description** — end with:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## SECTION 1 — The defect

`src/app/students/page.tsx` violates the core invariant **"the authenticated student never appears in a peer-contactable roster."**

### 1.1 — The roster is a hardcoded singleton with no auth gate

`src/app/students/page.tsx:25–146` defines `studentsData` as a literal array. `studentsData[0]` is:

```tsx
{
  id: "1",
  name: "Sakib Rahman",
  studentId: "26039",
  semester: "6th Sem",
  section: "Sec A",
  department: "CSE",
  avatar: "",
  isActive: true,
},
```

There is **no** `useAdminAuth()` call, **no** current-user check, **no** auth gate, and **no** request-path filtering anywhere in the file. `GET /students` renders the same snapshot for every reader, including the signed-in student.

### 1.2 — The reader's own card renders a "Message Peer" button

`src/app/students/page.tsx:367–374`:

```tsx
<button
  onClick={() => window.dispatchEvent(new CustomEvent("open-messaging", { detail: { peerName: student.name } }))}
  ...
>
  <MessageSquare className="w-3.5 h-3.5" />
  <span>Message Peer</span>
</button>
```

Because the roster contains the reader, the reader gets a contactable-peer affordance on their **own** card.

### 1.3 — The dispatched event names the wrong conversation

`src/components/layout/AppShell.tsx:112–114` — the `open-messaging` listener sets `isMessagingOpen` and **ignores `event.detail`** entirely:

```tsx
function handleOpenMessaging() {
  setIsMessagingOpen(true);
}
```

`src/components/common/MessagingDrawer.tsx:44–88` — `STUDENT_CONVERSATIONS[0]` is `Dr. Asif Rahman`. So clicking "Message Peer" on the reader's own card opens a thread titled **"Dr. Asif Rahman"**, not the clicked peer. The `peerName` payload is dead weight.

### 1.4 — The identity itself is inconsistent across surfaces

| Surface | Name | Student ID |
|---|---|---|
| `src/components/layout/Header.tsx:287, :290` | `Sakib` | `Student ID • 26039` |
| `src/components/layout/Header.tsx:304` | `Sakib Ahmed` | — |
| `src/app/profile/page.tsx:24` | `Sakib Ahmed` | — |
| `src/app/settings/page.tsx:109–110` | `Sakib Ahmed` | `Student ID • 26039` |
| `src/context/AdminAuthContext.tsx:42–44` | `Sakib Ahmed` (`INITIAL_PROFILES.find(p => p.role === 'student')`) | `211-15-4424` |
| `src/lib/mockData.ts:340, :348` | `Sakib Ahmed` | `211-15-4424` |
| **`src/app/students/page.tsx:28–29`** | **`Sakib Rahman`** | **`26039`** |

The roster uses an **entirely separate hardcoded array** that disagrees with the canonical profile in `mockData.ts` on both the name and the student ID. This is the root cause of the reader appearing in the roster: the roster is not derived from the same identity source as the session.

### 1.5 — Impact

- The reader can interact directly with their own card.
- The **"Enrolled Peers"** KPI (`src/app/students/page.tsx:243`, `stats.total`) is inflated by **+1**.
- The contactable-peer UX pattern is actively harmed — rendering the reader inside a strangers list breaks the mental model the page is built on.
- A chat thread opened against "themselves" is semantically broken (and, per 1.3, opens against the wrong person entirely).

### 1.6 — Contrast with how the admin console already does this

The admin pages already scope by session identity — `src/app/admin/users/page.tsx:32, :64–66`, `src/app/admin/finance/page.tsx:50, :86–88`, `src/app/admin/departments/page.tsx:37, :74–75` all read `currentUser` from `useAdminAuth()` and filter by `department_id`. The student panel must do the equivalent here.

---

## SECTION 2 — Reproduction

```
1. Open http://localhost:3000/ and log in as the default student session
   (AdminAuthContext.tsx:42-44 -> INITIAL_PROFILES.find(p => p.role === 'student')
    => Sakib Ahmed, sakib.cse@unicampus.edu, student_id 211-15-4424)

2. Navigate to /students

3. Observe: the "Enrolled Peers" KPI reads 12, and a card for
   "Sakib Rahman" (ID: 26039) is rendered as if they were a peer.

4. Click the "Message Peer" button on the "Sakib Rahman" card.

5. Observe: the Campus Messenger drawer opens on the conversation
   titled "Dr. Asif Rahman" — the payload { peerName: "Sakib Rahman" }
   was discarded by AppShell.tsx:112.

6. Navigate to /profile and observe it renders "Sakib Ahmed" (211-15-4424).
   The two surfaces disagree about who the reader is.
```

**SSR check:** `curl http://localhost:3000/students` and grep — the response contains **12** occurrences of `<h3 ...>Sakib Rahman` and the header chrome reads `Student ID • 26039`.

---

## SECTION 3 — Exactly what to change

### 3.1 — `src/app/students/page.tsx` (primary fix)

**Step A — import the session.**

```tsx
import { useAdminAuth } from "@/context/AdminAuthContext";
```

**Step B — read the current user inside the component.**

```tsx
export default function StudentsPage() {
  const [activeFilter, setActiveFilter] = useState("All Peers");
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAdminAuth();

  const selfName = currentUser?.full_name?.trim() ?? "";
  const selfStudentId = currentUser?.student_id?.trim() ?? "";
```

**Step C — exclude the reader from the rendered roster and from the KPI.**

Match on **name + student ID**, which is deterministic and needs no new fields or invented ids:

```tsx
const isSelf = (student: Student) =>
  (!!selfName && student.name === selfName) ||
  (!!selfStudentId && student.studentId === selfStudentId);
```

> The roster's names (`Anika Kabir`, `Tanvir Islam`, `Zara Shirley`, `Nabila Mehzabin`, `Rifat Chowdhury`, `Abrar Zahin`, `Tasnim Bushra`, `Kazi Nabil`) do **not** all appear in `INITIAL_PROFILES` — that file only defines `user-stud-1` … `user-stud-8` (`src/lib/mockData.ts:339, :354, :369, :384, :399, :415, :430, :445`). Do **not** invent a `userId` field or guess at ids that do not exist. Name + `student_id` matching is sufficient and is verifiable with a grep.

**Step D — scope the KPI to the peer roster.**

```tsx
const peerRoster = useMemo(
  () => studentsData.filter((student) => !isSelf(student)),
  [selfName, selfStudentId]
);

const stats = useMemo(() => {
  return {
    total: peerRoster.length,
    active: peerRoster.filter((s) => s.isActive).length,
    sixthSem: peerRoster.filter((s) => s.semester === "6th Sem").length,
    depts: new Set(peerRoster.map((s) => s.department)).size,
  };
}, [peerRoster]);
```

> `depts` was hardcoded to `3`. Deriving it from the roster is correct and must still equal `3` after the fix.
> `peerRoster` is memoized on `[selfName, selfStudentId]` so the `stats` `useMemo` dependency stays honest — **do not** leave a stale-dependency `useMemo`.

Apply it at the **top** of the existing filter chain so both the search results and the KPI are scoped:

```tsx
const filteredStudents = peerRoster.filter((student) => {  const q = searchQuery.toLowerCase().trim();
  const matchesSearch =
    q === "" ||
    student.name.toLowerCase().includes(q) ||
    student.studentId.includes(q) ||
    student.department.toLowerCase().includes(q) ||
    student.section.toLowerCase().includes(q);

  if (!matchesSearch) return false;

  if (activeFilter === "All Peers") return true;
  if (activeFilter === "Computer Science (CSE)") return student.department === "CSE";
  if (activeFilter === "6th Semester") return student.semester === "6th Sem";
  if (activeFilter === "4th Semester") return student.semester === "4th Sem";
  if (activeFilter === "Active Only") return student.isActive;

  return true;
});
```

**Step E — guard the "Message Peer" button.**

Even with the roster filtered, keep a defensive guard so the button can never be dispatched for the reader:

```tsx
{!isSelf(student) && (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new CustomEvent("open-messaging", { detail: { peerName: student.name } }))}
    className="..."
    title={`Send direct message to ${student.name}`}
    aria-label={`Send direct message to ${student.name}`}
  >
    <MessageSquare className="w-3.5 h-3.5" />
    <span>Message Peer</span>
  </button>
)}
```

> **Bonus (recommended, 1 line):** the button currently has **no `aria-label`** and **no `type="button"`. Add both — it is an icon+text control inside a `SpotlightCard`, and `type="button"` prevents accidental form submission.

**Step F — fix the identity dissonance.**

The roster's first row says `Sakib Rahman` / `26039` while every other surface says `Sakib Ahmed` / `211-15-4424`. After the fix the reader is excluded from the list entirely, so the dissonance is no longer visible on `/students` — but the **header chrome** (`Header.tsx:290`) and the **settings page** (`settings/page.tsx:110`) still print `Student ID • 26039`, which contradicts the session's canonical `student_id` of `211-15-4424` from `mockData.ts:348`.

Fix those two sites to read from the session:

```tsx
// src/components/layout/Header.tsx:290
<p className="text-[10px] ...">Student ID • {currentUser?.student_id ?? '—'}</p>

// src/app/settings/page.tsx:110
<p className="text-xs ...">Student ID • {currentUser?.student_id ?? '—'}</p>
```

`Header.tsx` already imports `useAdminAuth` (`Header.tsx:23, :30`). `settings/page.tsx` will need the import added.

> **Do not** change `Header.tsx:304`, `profile/page.tsx:24`, or `settings/page.tsx:109` — those already say `Sakib Ahmed` and are **correct**.

---

### 3.2 — `src/components/common/MessagingDrawer.tsx` (secondary)

The drawer must not open a thread whose title is unrelated to what was clicked.

**Step A — honor the `peerName` payload.**

`AppShell.tsx:112–114` discards `event.detail`. Capture it and pass it down:

```tsx
// src/components/layout/AppShell.tsx
const [messagingPeerName, setMessagingPeerName] = useState<string | null>(null);

function handleOpenMessaging(e: Event) {
  const detail = (e as CustomEvent<{ peerName?: string }>).detail;
  setMessagingPeerName(detail?.peerName ?? null);
  setIsMessagingOpen(true);
}
```

```tsx
{isMessagingOpen ? (
  <MessagingDrawer
    isOpen={isMessagingOpen}
    initialPeerName={messagingPeerName}
    onClose={() => { setIsMessagingOpen(false); setMessagingPeerName(null); }}
  />
) : null}
```

**Step B — select the matching conversation in the drawer.**

```tsx
export function MessagingDrawer({ isOpen, onClose, initialPeerName }: MessagingDrawerProps) {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const baseConversations = isTeacher ? TEACHER_CONVERSATIONS : STUDENT_CONVERSATIONS;

  const resolveInitialId = (peerName?: string | null) => {
    if (peerName) {
      const match = baseConversations.find(
        (c) => c.name.toLowerCase() === peerName.toLowerCase()
      );
      if (match) return match.id;
    }
    return baseConversations[0]?.id ?? "";
  };

  const [conversations, setConversations] = useState<Conversation[]>(baseConversations);
  const [activeConvId, setActiveConvId] = useState<string>(resolveInitialId(initialPeerName));
```

and in the existing `useEffect` that resets on role change:

```tsx
useEffect(() => {
  setConversations(isTeacher ? TEACHER_CONVERSATIONS : STUDENT_CONVERSATIONS);
  setActiveConvId(resolveInitialId(initialPeerName));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isTeacher, initialPeerName]);
```

**Step C — never let the reader message themselves.**

Guard the send handler:

```tsx
const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!inputText.trim() || !activeConv) return;

  // A conversation whose every message was sent by the reader is a self-thread.
  const isSelfThread = activeConv.messages.length > 0
    && activeConv.messages.every((m) => m.sender === "me");
  if (isSelfThread) return;
  ...
};
```

**Step D — extend the prop type.**

```tsx
interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeerName?: string | null;
}
```

> `initialPeerName` must be **optional** so `AppShell`'s other call sites (`Header.tsx:168`, `TeacherHeader.tsx:159` — both dispatch `open-messaging` with **no** `detail`) keep working. Those dispatch a bare event, so `initialPeerName` will be `null` and the drawer falls back to `baseConversations[0]`.

---

## SECTION 4 — Constraints

- **Do not** modify: `src/lib/mockData.ts`, `src/lib/facultyData.ts`, `src/context/AdminAuthContext.tsx`, `src/components/layout/AppShell.tsx`'s student/teacher/admin branch structure, or any `/admin/*` page.
- **Do not** delete the hardcoded roster rows. Add the self-exclusion filter instead — the roster content is the page's data.
- **Do not** change the GitHub-dark palette or the brand indigos listed in Section 0.
- Diff budget: **≤ ~60 lines added** across all files. Prefer small surgical edits over a rewrite.
- Do not introduce a new context, hook, or provider for this fix — `useAdminAuth()` already exists and already exposes `currentUser`.
- Keep `useMemo` dependency arrays honest (`peerRoster` is a new array identity each render, so either memoize `peerRoster` with `useMemo` on `[studentsData, selfName, selfStudentId, currentUser?.id]`, or compute the stats inline without `useMemo`). **Do not** leave a stale-dependency `useMemo`.

---

## SECTION 5 — Completion checklist

Before opening the PR, confirm each of these:

- [ ] `npx tsc --noEmit` passes with no new errors
- [ ] `npm run build` succeeds
- [ ] `AGENTS.md` is **still present** in the diff (do not remove it)
- [ ] `/students` with the student session shows **"Enrolled Peers" = 11** (was 12)
- [ ] `/students` contains **zero** cards for the signed-in student
- [ ] `/students` contains **zero** "Message Peer" buttons for the signed-in student
- [ ] `grep -rn "26039" src/` returns **0** hits (the stale student ID)
- [ ] `grep -rn "Sakib Rahman" src/` returns **0** hits
- [ ] Header chrome and `/settings` both read `Student ID • 211-15-4424`
- [ ] Clicking "Message Peer" on any peer opens **that peer's** conversation (or, if the peer has no thread yet, the drawer still opens without a mismatch)
- [ ] Header bell (`Header.tsx:168`) still opens the messenger on the default conversation
- [ ] Light theme checked on `/students`, `/profile`, `/settings`, `/messages`
- [ ] Dark theme checked on the same list
- [ ] Every changed file diff-reviewed for unintended visual drift
- [ ] No new raw hex introduced outside `src/lib/theme.ts` and `src/app/globals.css`
