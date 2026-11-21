import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unicampus_mobile/src/core/theme.dart';
import 'package:unicampus_mobile/src/features/dashboard/screens/student_dashboard_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/materials_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/notices_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/profile_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/progress_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/routine_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/settings_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/students_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/teachers_screen.dart';
import 'package:unicampus_mobile/src/widgets/common/uc_avatar.dart';
import 'package:unicampus_mobile/src/widgets/common/uc_viewfinder_scanner.dart';

void main() {
  setUpAll(() {
    UcAvatar.isTestMode = true;
    UcViewfinderScanner.isTestMode = true;
  });

  Widget wrapWithTheme(Widget child) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      home: child,
    );
  }

  void configureViewport(WidgetTester tester, {Size size = const Size(390, 844)}) {
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  group('Milestone 2 Interactive Sheets & Components', () {
    testWidgets(
        'Student Dashboard: Scan Attendance QR opens scanner and confirmation sheet',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const StudentDashboardScreen()));
      await tester.pumpAndSettle();

      // Verify Live Hero card
      expect(find.text('LIVE NOW'), findsOneWidget);
      expect(find.text('Live Lecture', skipOffstage: false), findsNothing);

      // Tap Scan Attendance QR button
      final scanBtn = find.text('Scan Attendance QR');
      expect(scanBtn, findsOneWidget);
      await tester.tap(scanBtn);
      await tester.pumpAndSettle();

      // Scanner modal should be visible
      expect(find.byType(UcViewfinderScanner), findsOneWidget);

      // Simulate a scan payload
      final simulateBtn = find.text('Simulate Scan');
      expect(simulateBtn, findsOneWidget);
      await tester.tap(simulateBtn);
      await tester.pumpAndSettle();

      // Attendance Confirmed sheet should now appear
      expect(find.text('Attendance Confirmed!'), findsOneWidget);
      expect(find.text('Distributed Systems (CSE-3101)'), findsOneWidget);
      expect(find.text('PRESENT (Verified)'), findsOneWidget);

      // Dismiss confirmation sheet
      await tester.tap(find.text('Done'));
      await tester.pumpAndSettle();
      expect(find.text('Attendance Confirmed!'), findsNothing);
    });

    testWidgets(
        'Routine Screen: Mode switch and Propose Study Slot sheet',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const RoutineScreen()));
      await tester.pumpAndSettle();

      // Verify Classes mode default
      expect(find.text('Thursday Schedule'), findsOneWidget);
      expect(find.text('Classes'), findsOneWidget);
      expect(find.text('Peer Circles'), findsOneWidget);

      // Switch to Peer Circles mode
      await tester.tap(find.text('Peer Circles'));
      await tester.pumpAndSettle();

      expect(find.text('Peer Study Circles'), findsOneWidget);
      expect(find.text('Organize a Study Session'), findsOneWidget);

      // Open Propose Study Slot sheet
      await tester.tap(find.text('Propose Slot'));
      await tester.pumpAndSettle();

      expect(find.text('Propose Peer Study Circle'), findsOneWidget);
      expect(find.text('Publish Study Circle'), findsOneWidget);

      // Submit new study circle
      await tester.tap(find.text('Publish Study Circle'));
      await tester.pumpAndSettle();
      expect(find.text('Propose Peer Study Circle'), findsNothing);
    });

    testWidgets(
        'Routine Screen: Peer Circles mode renders with zero RenderFlex overflow on 320x568 dp',
        (WidgetTester tester) async {
      configureViewport(tester, size: const Size(320, 568));
      await tester.pumpWidget(wrapWithTheme(const RoutineScreen()));
      await tester.pumpAndSettle();

      // Switch to Peer Circles mode on ultra-compact 320dp viewport
      await tester.tap(find.text('Peer Circles'));
      await tester.pumpAndSettle();

      // Verify CTA banner and study circle items rendered without overflow
      expect(find.text('Peer Study Circles'), findsOneWidget);
      expect(find.text('Organize a Study Session'), findsOneWidget);
      expect(find.text('Propose Slot'), findsOneWidget);

      // Verify first study circle header
      expect(find.text('CSE-3101'), findsOneWidget);

      // Scroll down to layout remaining study circles on ultra-compact screen
      await tester.drag(find.byType(CustomScrollView), const Offset(0, -300));
      await tester.pumpAndSettle();

      expect(find.text('CSE-3205'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets(
        'Progress Screen: GPA Simulator interactive sheet with live recalculation',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const ProgressScreen()));
      await tester.pumpAndSettle();

      // Verify gauge and historical items
      expect(find.text('Cumulative GPA'), findsOneWidget);
      expect(find.text('3.84'), findsOneWidget);
      expect(find.text('SGPA Trajectory'), findsOneWidget);

      // Open Simulator Sheet
      await tester.tap(find.text('Simulate Next Semester GPA'));
      await tester.pumpAndSettle();

      expect(find.text('GPA Target Simulator'), findsOneWidget);
      expect(find.text('Projected SGPA'), findsOneWidget);
      expect(find.text('Projected CGPA'), findsOneWidget);

      // Tap grade option A (3.75) for first course
      final gradeChips = find.text('A (3.75)');
      expect(gradeChips, findsWidgets);
      await tester.tap(gradeChips.first);
      await tester.pumpAndSettle();

      // Scroll to reveal Done button
      await tester.drag(
          find.byType(SingleChildScrollView).last, const Offset(0, -300));
      await tester.pumpAndSettle();

      // Close Simulator Sheet
      await tester.tap(find.text('Done'));
      await tester.pumpAndSettle();
      expect(find.text('GPA Target Simulator'), findsNothing);
    });

    testWidgets(
        'Profile Screen: 3D Flip Card animation toggles front and back',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const ProfileScreen()));
      await tester.pumpAndSettle();

      // Starts on Front
      expect(find.text('STUDENT ID: 2023-1-60-042'), findsOneWidget);
      expect(find.text('DHAKA CITY COLLEGE'), findsOneWidget);

      // Tap Flip ID Card AppBar button
      await tester.tap(find.byIcon(Icons.flip_camera_android_outlined));
      await tester.pumpAndSettle();

      // Back of card should be visible
      expect(find.text('*LIB-2023-1-60-042*'), findsOneWidget);
      expect(find.text('VALID THRU 2026'), findsOneWidget);

      // Tap Flip button again to return to Front
      await tester.tap(find.byIcon(Icons.flip_camera_android_outlined));
      await tester.pumpAndSettle();

      expect(find.text('STUDENT ID: 2023-1-60-042'), findsOneWidget);
    });

    testWidgets(
        'Notices Screen: Pinned banner and in-app attachment preview sheet',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const NoticesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('PINNED ANNOUNCEMENT'), findsOneWidget);

      // Tap attachment pill to preview attachment
      final attachmentPill =
          find.text('Final_Exam_Routine_Fall2026.pdf (2.4 MB)');
      expect(attachmentPill, findsOneWidget);
      await tester.tap(attachmentPill);
      await tester.pumpAndSettle();

      expect(find.text('Download PDF'), findsOneWidget);

      // Dismiss preview
      await tester.tap(find.text('Share'));
      await tester.pumpAndSettle();
    });

    testWidgets(
        'Materials Screen: Resource vault and in-app preview sheet',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const MaterialsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Course Materials & Vault'), findsOneWidget);

      // Tap first material card
      final firstCard =
          find.text('Lecture 08: Raft Consensus & Byzantine Fault Tolerance');
      expect(firstCard, findsOneWidget);
      await tester.tap(firstCard);
      await tester.pumpAndSettle();

      expect(find.text('Download Offline'), findsOneWidget);
      expect(find.text('DOCUMENT PREVIEW • PDF'), findsOneWidget);

      await tester.tap(find.text('Share'));
      await tester.pumpAndSettle();
    });

    testWidgets(
        'Students Screen: student detail sheet opens with copyable details',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const StudentsScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Sadia Afrin'));
      await tester.pumpAndSettle();

      expect(find.text('Send Direct Message'), findsOneWidget);
      expect(find.text('sadia.afrin@student.dcc.edu.bd'), findsOneWidget);

      await tester.tap(find.text('Send Direct Message'));
      await tester.pumpAndSettle();
    });

    testWidgets(
        'Teachers Screen: office hours sheet opens and displays consultation schedule',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const TeachersScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Dr. Rafiqul Islam'), findsOneWidget);

      final officeHoursBtns = find.text('Office Hours');
      expect(officeHoursBtns, findsWidgets);
      await tester.tap(officeHoursBtns.first);
      await tester.pumpAndSettle();

      expect(find.text('Office & Advising Hours'), findsOneWidget);
      expect(find.text('Send Consultation Message'), findsOneWidget);
      expect(find.text('Sun, Tue, Thu: 2:00 PM - 4:00 PM'), findsOneWidget);
    });

    testWidgets(
        'Settings Screen: Cache size breakdown and clear cache action',
        (WidgetTester tester) async {
      configureViewport(tester);
      await tester.pumpWidget(wrapWithTheme(const SettingsScreen()));
      await tester.pumpAndSettle();

      // Scroll down to reveal Storage section
      await tester.drag(find.byType(ListView), const Offset(0, -500));
      await tester.pumpAndSettle();

      expect(find.text('42.8 MB stored on device'), findsOneWidget);

      // Clear cache
      await tester.tap(find.text('Clear Cache'));
      await tester.pumpAndSettle();

      expect(find.text('0.0 KB stored on device'), findsOneWidget);
      expect(find.text('Cleared'), findsOneWidget);
    });

    group('Multi-Viewport Responsive Breakpoints (Mobile & Landscape)', () {
      final viewports = [
        const Size(320, 568), // Ultra-compact portrait (iPhone SE 1st gen)
        const Size(360, 780), // Standard Android compact portrait
        const Size(390, 844), // Standard iPhone portrait
        const Size(412, 915), // Standard large Android portrait
        const Size(640, 360), // Compact landscape
        const Size(844, 390), // Standard landscape
        const Size(800, 1400), // Tablet portrait
      ];

      for (final vp in viewports) {
        testWidgets(
            'Render all screens cleanly without overflows on ${vp.width.toInt()}x${vp.height.toInt()}',
            (WidgetTester tester) async {
          configureViewport(tester, size: vp);

          final screens = [
            const StudentDashboardScreen(),
            const RoutineScreen(),
            const ProgressScreen(),
            const ProfileScreen(),
            const NoticesScreen(),
            const MaterialsScreen(),
            const StudentsScreen(),
            const TeachersScreen(),
            const SettingsScreen(),
          ];

          for (final screen in screens) {
            await tester.pumpWidget(wrapWithTheme(screen));
            await tester.pumpAndSettle();
            if (screen is RoutineScreen) {
              await tester.tap(find.text('Peer Circles'));
              await tester.pumpAndSettle();
            }
          }
        });
      }

      final landscapeViewports = [
        const Size(568, 320),
        const Size(640, 360),
        const Size(844, 390),
      ];

      for (final vp in landscapeViewports) {
        testWidgets(
            'Interactive bottom sheets render without overflow on landscape ${vp.width.toInt()}x${vp.height.toInt()}',
            (WidgetTester tester) async {
          configureViewport(tester, size: vp);

          // 1. Dashboard Attendance Confirmed Sheet
          await tester
              .pumpWidget(wrapWithTheme(const StudentDashboardScreen()));
          await tester.pumpAndSettle();
          await tester.tap(find.text('Scan Attendance QR'));
          await tester.pumpAndSettle();
          await tester.tap(find.text('Simulate Scan'));
          await tester.pumpAndSettle();
          expect(find.text('Attendance Confirmed!'), findsOneWidget);
          Navigator.of(tester.element(find.text('Attendance Confirmed!'))).pop();
          await tester.pumpAndSettle();

          // 2. Notices Attachment Preview Sheet
          await tester.pumpWidget(wrapWithTheme(const NoticesScreen()));
          await tester.pumpAndSettle();
          await tester
              .tap(find.text('Final_Exam_Routine_Fall2026.pdf (2.4 MB)'));
          await tester.pumpAndSettle();
          expect(find.text('Download PDF'), findsOneWidget);
          Navigator.of(tester.element(find.text('Download PDF'))).pop();
          await tester.pumpAndSettle();

          // 3. Materials Preview Sheet
          await tester.pumpWidget(wrapWithTheme(const MaterialsScreen()));
          await tester.pumpAndSettle();
          await tester.tap(find.text(
              'Lecture 08: Raft Consensus & Byzantine Fault Tolerance'));
          await tester.pumpAndSettle();
          expect(find.text('Download Offline'), findsOneWidget);
          Navigator.of(tester.element(find.text('Download Offline'))).pop();
          await tester.pumpAndSettle();

          // 4. Students Detail Sheet
          await tester.pumpWidget(wrapWithTheme(const StudentsScreen()));
          await tester.pumpAndSettle();
          await tester.tap(find.text('Sadia Afrin'));
          await tester.pumpAndSettle();
          expect(find.text('Send Direct Message'), findsOneWidget);
          Navigator.of(tester.element(find.text('Send Direct Message'))).pop();
          await tester.pumpAndSettle();
        });
      }
    });
  });
}
