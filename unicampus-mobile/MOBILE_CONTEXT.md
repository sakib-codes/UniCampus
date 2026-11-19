# UniCampus Mobile — Screen Inventory, Theme & Porting Roadmap

> **Framework:** Flutter 3.47.6 • Dart 3.13.5  
> **Directives:** [`AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/AGENTS.md) • **Master Router:** [`../AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/AGENTS.md)

---

## 1. Current Screen Inventory (Completed)

| Feature / Screen | File Path | Description | Status |
|---|---|---|---|
| **Design System & Theme** | `lib/src/core/theme.dart` | Light/Dark theme definition, custom color palette (`AppColors`), Inter typography | `[x]` |
| **Brand Logo Widget** | `lib/src/widgets/brand_logo.dart` | Gradient squircle with white "U" insignia and frosted outer border | `[x]` |
| **Splash Screen** | `lib/src/features/splash/splash_screen.dart` | Animated splash with light/dark background switching & smooth scale/fade | `[x]` |
| **Onboarding Host & Tour** | `lib/src/features/onboarding/onboarding_screen.dart` | 3-step PageView tour with custom animated vector illustrations | `[x]` |
| **Onboarding Illustrations**| `lib/src/features/onboarding/onboarding_illustrations.dart` | 3D purple orb (Notices), floating cards (Routine), concentric rings (Directory) | `[x]` |
| **Login Screen** | `lib/src/features/auth/login_screen.dart` | Email/password login, password visibility toggle, validation, auth links | `[x]` |
| **Multi-Step Register Wizard** | `lib/src/features/auth/register_screen.dart` | 3-step form (Identity, Academic/Faculty, Security) with role tabs and progress indicator | `[x]` |
| **Forgot Password Screen** | `lib/src/features/auth/forgot_password_screen.dart` | Frosted padlock artwork, email input, reset confirmation feedback | `[x]` |
| **Reset Password Screen** | `lib/src/features/auth/reset_password_screen.dart` | New password input, 3-segment strength meter ("Weak", "Good", "Strong"), success banner | `[x]` |

---

## 2. Porting Roadmap: Web to Mobile

These screens are fully designed in `unicampus-web` and scheduled for porting to Flutter in `unicampus-mobile`:

### Priority 1: Student Core Flow
1. **Student Dashboard (`lib/src/features/dashboard/dashboard_screen.dart`)**:
   - Reference: [`unicampus-web/src/app/dashboard/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/dashboard/page.tsx)
   - Elements: Greeting hero, Live Lecture progress card (DBMS lecture with time bar), pinned priority notice, upcoming timetable preview, quick navigation chips.
2. **Academic Progress & Degree Audit (`lib/src/features/progress/progress_screen.dart`)**:
   - Reference: [`unicampus-web/src/app/dashboard/progress/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/dashboard/progress/page.tsx)
   - Elements: Custom radial arc gauge for CGPA (3.78/4.00), degree completion bar (66%), SGPA trajectory chart, semester courses table, GPA simulator bottom sheet.
3. **Class Routine (`lib/src/features/routine/routine_screen.dart`)**:
   - Reference: [`unicampus-web/src/app/routine/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/routine/page.tsx)
   - Elements: Horizontal weekday pills (`Sat`–`Thu`), vertical lecture cards with room numbers, color-coded badges (Theory blue, SE green, Lab amber).

### Priority 2: Information & Community
4. **Campus Noticeboard (`lib/src/features/notices/notices_screen.dart`)**:
   - Reference: [`unicampus-web/src/app/notices/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/notices/page.tsx)
   - Elements: Search input, category filter chips (Exams, General, Seminars), notice preview cards, notice detail view with attachment downloads.
5. **Student & Faculty Directory (`lib/src/features/directory/`)**:
   - Reference: [`unicampus-web/src/app/students/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/students/page.tsx) & [`unicampus-web/src/app/teachers/page.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/app/teachers/page.tsx)
   - Elements: Searchable cards, batch & department filters, faculty availability chips (*In Office*, *Online*), consultation hours schedule.

### Priority 3: Faculty Operations
6. **Teacher Attendance Scanner (`lib/src/features/attendance/attendance_scanner_screen.dart`)**:
   - Reference: [`unicampus-web/src/components/attendance/AttendanceScannerModal.tsx`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/src/components/attendance/AttendanceScannerModal.tsx)
   - Elements: Camera viewfinder for scanning student QR codes, live verification indicator, attendance session summary.

---

## 3. Theme & Design Tokens (`lib/src/core/theme.dart`)

```dart
class AppColors {
  // Brand
  static const Color primary = Color(0xFF605BFF);
  static const Color primaryDark = Color(0xFF4F46E5);
  static const Color accent = Color(0xFF6B66FF);

  // Backgrounds
  static const Color lightBg = Color(0xFFF7F8FD);
  static const Color darkBg = Color(0xFF0A0815);
  static const Color lightSurface = Colors.white;
  static const Color darkSurface = Color(0xFF161B22);

  // Status
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
}
```

---

## 4. Mobile Verification Protocol
```bash
# 1. Fetch packages
cd unicampus-mobile
flutter pub get

# 2. Static analysis (Must report 0 issues)
flutter analyze

# 3. Run test suite
flutter test
```
