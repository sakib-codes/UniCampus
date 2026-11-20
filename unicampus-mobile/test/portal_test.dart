import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unicampus_mobile/src/core/models/user_role.dart';
import 'package:unicampus_mobile/src/core/theme.dart';
import 'package:unicampus_mobile/src/features/auth/controllers/auth_controller.dart';
import 'package:unicampus_mobile/src/widgets/shell/adaptive_portal_shell.dart';

import 'package:unicampus_mobile/src/widgets/common/uc_avatar.dart';

void main() {
  setUpAll(() {
    UcAvatar.isTestMode = true;
  });
  Widget createTestWidget(Widget child) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: child,
    );
  }

  testWidgets('AdaptivePortalShell renders Student Portal by default',
      (WidgetTester tester) async {
    AuthController.instance.switchRole(UserRole.student);

    await tester.pumpWidget(createTestWidget(const AdaptivePortalShell()));
    await tester.pumpAndSettle();

    // Verify AppBar title and role badge
    expect(find.text('Student Portal'), findsOneWidget);
    expect(find.text('STUDENT'), findsOneWidget);

    // Verify Student Dashboard metrics
    expect(find.text('Cumulative CGPA'), findsOneWidget);
    expect(find.text('Attendance Rate'), findsOneWidget);
    expect(find.text('Live Lecture', skipOffstage: false), findsNothing);
    expect(find.text('LIVE NOW'), findsOneWidget);
  });

  testWidgets('AdaptivePortalShell switches dynamically to Faculty Portal',
      (WidgetTester tester) async {
    AuthController.instance.switchRole(UserRole.teacher);

    await tester.pumpWidget(createTestWidget(const AdaptivePortalShell()));
    await tester.pumpAndSettle();

    expect(find.text('Faculty Portal'), findsOneWidget);
    expect(find.text('FACULTY'), findsOneWidget);
    expect(find.text('Classes Today'), findsOneWidget);
  });

  testWidgets('AdaptivePortalShell switches dynamically to Campus Admin Console',
      (WidgetTester tester) async {
    AuthController.instance.switchRole(UserRole.admin);

    await tester.pumpWidget(createTestWidget(const AdaptivePortalShell()));
    await tester.pumpAndSettle();

    expect(find.text('Campus Command Overview'), findsOneWidget);
    expect(find.text('CAMPUS ADMIN'), findsOneWidget);
    expect(find.text('Total Students'), findsOneWidget);
  });
}
