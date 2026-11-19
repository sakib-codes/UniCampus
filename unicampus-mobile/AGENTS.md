# UniCampus Mobile — Flutter Agent Operating Directive

> **Framework:** Flutter 3.47.6 • Dart 3.13.5 • `flutter_lints` 6.0  
> **Master Router:** [`../AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/AGENTS.md) • **Mobile Architecture Context:** [`MOBILE_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/MOBILE_CONTEXT.md)

---

## 1. Mobile Fast Rules (Token-Efficient Reference)

1. **Architecture & Folder Conventions**:
   - Feature-first structure under `lib/src/features/<feature_name>/`:
     - `screens/` (or `<feature>_screen.dart`)
     - `widgets/` (feature-specific sub-widgets)
     - `models/` (data models)
     - `controllers/` or `services/` (state & API communication)
   - Shared reusable UI lives in `lib/src/widgets/` (e.g. `brand_logo.dart`).
   - Theme and global design tokens live in `lib/src/core/theme.dart`.

2. **Styling & Theme Strict Rules**:
   - Always reference theme colors via `Theme.of(context)` or canonical constants:
     - **Brand Primary Indigo**: `Color(0xFF605BFF)`
     - **Dark Canvas**: `Color(0xFF0A0815)`
     - **Light Canvas**: `Color(0xFFF7F8FD)` or `Color(0xFFEAEBF6)`
     - **Light Surface**: `Colors.white`
     - **Dark Surface**: `Color(0xFF161B22)` / `Color(0xFF120E28)`
   - Always use **Google Fonts Inter** (`GoogleFonts.inter(...)`).
   - Cards should use rounded borders: `BorderRadius.circular(24)` or `BorderRadius.circular(32)`.

3. **Platform Constraints**:
   - Supported targets: **Android, iOS, Windows, Linux**.
   - **Web target is explicitly excluded** from `unicampus-mobile` (handled by `unicampus-web`).
   - Safe Area: Always wrap top-level scaffold bodies in `SafeArea`.
   - Touch Target: Ensure interactive buttons have a minimum tap target of 48×48 dp.

4. **Zero-Warning Linter Policy**:
   - Every file must pass `flutter_lints` 6.0 standards:
     - Always use `const` constructors where applicable.
     - Never ignore linter warnings without strong justification.
     - Prefer single quotes for string literals.

---

## 2. Pre-Flight & Post-Flight Checklist for Mobile Agents

### Pre-Flight:
1. Review [`MOBILE_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/MOBILE_CONTEXT.md) to understand existing screens, assets, and the porting roadmap.
2. Check [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) Mobile Feature Matrix to avoid rebuilding completed screens.
3. Check [`../BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md) for mobile issues or dependency constraints.

### Post-Flight:
1. Run static analysis: `flutter analyze`. Must exit with `No issues found!`.
2. Run test suite: `flutter test`.
3. Update [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) Mobile Section to mark items `[x]`.
4. Document newly added files in `MOBILE_CONTEXT.md`.
