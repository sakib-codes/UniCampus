import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unicampus_mobile/src/core/models/mock_data.dart';
import 'package:unicampus_mobile/src/core/theme.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_analytics_screen.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_departments_screen.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_finance_screen.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_notices_screen.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_routine_screen.dart';
import 'package:unicampus_mobile/src/features/admin/screens/admin_users_screen.dart';
import 'package:unicampus_mobile/src/features/messages/screens/chat_thread_screen.dart';
import 'package:unicampus_mobile/src/features/messages/screens/messages_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/materials_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/notice_detail_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/notices_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/profile_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/progress_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/routine_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/settings_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/students_screen.dart';
import 'package:unicampus_mobile/src/features/student/screens/teachers_screen.dart';
import 'package:unicampus_mobile/src/features/teacher/screens/attendance_hub_screen.dart';
import 'package:unicampus_mobile/src/features/teacher/screens/gradebook_screen.dart';
import 'package:unicampus_mobile/src/features/teacher/screens/teacher_materials_screen.dart';
import 'package:unicampus_mobile/src/features/teacher/screens/teacher_notices_screen.dart';
import 'package:unicampus_mobile/src/features/teacher/screens/teacher_routine_screen.dart';

import 'package:unicampus_mobile/src/widgets/common/uc_avatar.dart';

void main() {
  setUpAll(() {
    UcAvatar.isTestMode = true;
  });
  Widget wrapWithTheme(Widget child) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      home: child,
    );
  }

  group('Student Screens Verification', () {
    testWidgets('RoutineScreen renders schedules and day chips', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const RoutineScreen()));
      await tester.pump();
      expect(find.text('Thursday Schedule'), findsOneWidget);
      expect(find.text('CSE-3101'), findsOneWidget);
    });

    testWidgets('ProgressScreen renders CGPA and semester history', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const ProgressScreen()));
      await tester.pump();
      expect(find.text('Cumulative GPA'), findsOneWidget);
      expect(find.text('3.84'), findsOneWidget);
      expect(find.text('Semester 5 (Current)'), findsOneWidget);
    });

    testWidgets('NoticesScreen & NoticeDetailScreen render feed and full content', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const NoticesScreen()));
      await tester.pump();
      expect(find.text('Fall 2026 Semester Final Examination Schedule Published'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(NoticeDetailScreen(notice: MockData.notices[0])));
      await tester.pump();
      expect(find.text('Official Attachment'), findsOneWidget);
      expect(find.text('Final_Exam_Routine_Fall2026.pdf'), findsOneWidget);
    });

    testWidgets('MaterialsScreen renders vault and file cards', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const MaterialsScreen()));
      await tester.pump();
      expect(find.text('Course Materials & Vault'), findsOneWidget);
      expect(find.text('CSE-3101'), findsWidgets);
    });

    testWidgets('StudentsScreen and TeachersScreen render directories', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const StudentsScreen()));
      await tester.pump();
      expect(find.text('Sadia Afrin'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const TeachersScreen()));
      await tester.pump();
      expect(find.text('Dr. Rafiqul Islam'), findsOneWidget);
    });

    testWidgets('ProfileScreen and SettingsScreen render ID card and toggles', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const ProfileScreen()));
      await tester.pump();
      expect(find.text('DHAKA CITY COLLEGE'), findsOneWidget);
      expect(find.text('STUDENT ID: 2023-1-60-042'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const SettingsScreen()));
      await tester.pump();
      expect(find.text('Push Notifications'), findsOneWidget);
      expect(find.text('Offline Routine & Cache'), findsOneWidget);
    });
  });

  group('Messaging Screens Verification', () {
    testWidgets('MessagesScreen and ChatThreadScreen render chat channels', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const MessagesScreen()));
      await tester.pump();
      expect(find.text('Campus Messages'), findsOneWidget);
      expect(find.text('CSE-42 Study Circle'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(ChatThreadScreen(conversation: MockData.conversations[0])));
      await tester.pump();
      expect(find.text('CSE-42 Study Circle'), findsOneWidget);
      expect(find.text('Good morning Tanvir. Have you reviewed the distributed consensus paper I sent?'), findsOneWidget);
    });
  });

  group('Teacher Screens Verification', () {
    testWidgets('Teacher screens render attendance, gradebook, routine, and materials', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const AttendanceHubScreen()));
      await tester.pump();
      expect(find.text('Dynamic QR Hub'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const GradebookScreen()));
      await tester.pump();
      expect(find.text('Faculty Gradebook Studio'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const TeacherRoutineScreen()));
      await tester.pump();
      expect(find.text('Faculty Master Routine'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const TeacherMaterialsScreen()));
      await tester.pump();
      expect(find.text('Faculty Course Materials Manager'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const TeacherNoticesScreen()));
      await tester.pump();
      expect(find.text('Faculty Notice Publisher'), findsOneWidget);
    });
  });

  group('Admin Screens Verification', () {
    testWidgets('Admin screens render users, depts, routine, notices, finance, and analytics', (tester) async {
      await tester.pumpWidget(wrapWithTheme(const AdminUsersScreen()));
      await tester.pump();
      expect(find.text('Campus User Accounts & Roles'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const AdminDepartmentsScreen()));
      await tester.pump();
      expect(find.text('Academic Departments'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const AdminRoutineScreen()));
      await tester.pump();
      expect(find.text('Master Routine & Room Allocation'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const AdminNoticesScreen()));
      await tester.pump();
      expect(find.text('Campus Broadcast Manager'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const AdminFinanceScreen()));
      await tester.pump();
      expect(find.text('Campus Treasury & Finance'), findsOneWidget);

      await tester.pumpWidget(wrapWithTheme(const AdminAnalyticsScreen()));
      await tester.pump();
      expect(find.text('Institutional Campus Analytics'), findsOneWidget);
    });
  });
}
