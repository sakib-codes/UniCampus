import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import '../../core/models/user_role.dart';
import '../../core/theme.dart';
import '../../features/admin/screens/admin_analytics_screen.dart';
import '../../features/admin/screens/admin_dashboard_screen.dart';
import '../../features/admin/screens/admin_departments_screen.dart';
import '../../features/admin/screens/admin_finance_screen.dart';
import '../../features/admin/screens/admin_notices_screen.dart';
import '../../features/admin/screens/admin_routine_screen.dart';
import '../../features/admin/screens/admin_users_screen.dart';
import '../../features/auth/controllers/auth_controller.dart';
import '../../features/dashboard/screens/student_dashboard_screen.dart';
import '../../features/messages/screens/messages_screen.dart';
import '../../features/student/screens/materials_screen.dart';
import '../../features/student/screens/notices_screen.dart';
import '../../features/student/screens/profile_screen.dart';
import '../../features/student/screens/progress_screen.dart';
import '../../features/student/screens/routine_screen.dart';
import '../../features/student/screens/settings_screen.dart';
import '../../features/student/screens/students_screen.dart';
import '../../features/student/screens/teachers_screen.dart';
import '../../features/teacher/screens/attendance_hub_screen.dart';
import '../../features/teacher/screens/gradebook_screen.dart';
import '../../features/teacher/screens/teacher_dashboard_screen.dart';
import '../../features/teacher/screens/teacher_materials_screen.dart';
import '../../features/teacher/screens/teacher_notices_screen.dart';
import '../../features/teacher/screens/teacher_routine_screen.dart';
import '../brand_logo.dart';
import 'bottom_nav_bar.dart';
import 'more_sheet.dart';
import 'top_app_bar.dart';

/// Responsive role-aware navigation shell for UniCampus Mobile.
///
/// Adapts dynamically across form factors:
/// - Compact phones (<600dp): 5-tab [BottomNavBar] with smooth [PageTransitionSwitcher].
/// - Medium tablets (600–839dp): 72dp compact [NavigationRail].
/// - Expanded tablets (>=840dp): 228dp extended [NavigationRail] with labels.
class AdaptivePortalShell extends StatefulWidget {
  const AdaptivePortalShell({super.key});

  @override
  State<AdaptivePortalShell> createState() => _AdaptivePortalShellState();
}

class _AdaptivePortalShellState extends State<AdaptivePortalShell> {
  int _currentTabIndex = 0;

  /// Global notification badge counts for real-time shell indicators.
  static final ValueNotifier<Map<String, int>> notificationBadges =
      ValueNotifier<Map<String, int>>({
    'notices': 3,
    'messages': 2,
    'pending_users': 7,
    'live_attendance': 1,
  });

  void _onTabSelected(int index) {
    AppHaptics.selection();
    if (index == 4) {
      _showMoreSheet();
    } else {
      setState(() => _currentTabIndex = index);
    }
  }

  void _showMoreSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => MoreSheet(
        onNavigate: _navigateToRoute,
      ),
    );
  }

  void _navigateToRoute(String route) {
    Widget target;
    switch (route) {
      case '/student/dashboard':
        setState(() => _currentTabIndex = 0);
        return;
      case '/student/routine':
        setState(() => _currentTabIndex = 1);
        return;
      case '/student/progress':
        setState(() => _currentTabIndex = 2);
        return;
      case '/student/notices':
        setState(() => _currentTabIndex = 3);
        return;
      case '/teacher/dashboard':
        setState(() => _currentTabIndex = 0);
        return;
      case '/teacher/attendance':
        setState(() => _currentTabIndex = 1);
        return;
      case '/teacher/grades':
        setState(() => _currentTabIndex = 2);
        return;
      case '/teacher/routine':
        setState(() => _currentTabIndex = 3);
        return;
      case '/admin/dashboard':
        setState(() => _currentTabIndex = 0);
        return;
      case '/admin/users':
        setState(() => _currentTabIndex = 1);
        return;
      case '/admin/routine':
        setState(() => _currentTabIndex = 2);
        return;
      case '/admin/notices':
        setState(() => _currentTabIndex = 3);
        return;
      case '/messages':
        target = const MessagesScreen();
        break;
      case '/materials':
        target = const MaterialsScreen();
        break;
      case '/students':
        target = const StudentsScreen();
        break;
      case '/teachers':
        target = const TeachersScreen();
        break;
      case '/profile':
        target = const ProfileScreen();
        break;
      case '/settings':
        target = const SettingsScreen();
        break;
      case '/teacher/materials':
        target = const TeacherMaterialsScreen();
        break;
      case '/teacher/notices':
        target = const TeacherNoticesScreen();
        break;
      case '/admin/departments':
        target = const AdminDepartmentsScreen();
        break;
      case '/admin/finance':
        target = const AdminFinanceScreen();
        break;
      case '/admin/analytics':
        target = const AdminAnalyticsScreen();
        break;
      default:
        return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => target),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isTablet = screenWidth >= 600;
    final isExtended = screenWidth >= 840;

    return ListenableBuilder(
      listenable: AuthController.instance,
      builder: (context, _) {
        final role = AuthController.instance.currentRole;

        String appTitle;
        List<Widget> tabScreens;

        switch (role) {
          case UserRole.student:
            appTitle = 'Student Portal';
            tabScreens = [
              StudentDashboardScreen(onNavigate: _navigateToRoute),
              const RoutineScreen(),
              const ProgressScreen(),
              const NoticesScreen(),
            ];
            break;

          case UserRole.teacher:
            appTitle = 'Faculty Portal';
            tabScreens = [
              TeacherDashboardScreen(onNavigate: _navigateToRoute),
              const AttendanceHubScreen(),
              const GradebookScreen(),
              const TeacherRoutineScreen(),
            ];
            break;

          case UserRole.admin:
            appTitle = 'Campus Admin Console';
            tabScreens = [
              AdminDashboardScreen(onNavigate: _navigateToRoute),
              const AdminUsersScreen(),
              const AdminRoutineScreen(),
              const AdminNoticesScreen(),
            ];
            break;
        }

        final activeIndex =
            _currentTabIndex >= tabScreens.length ? 0 : _currentTabIndex;

        final bodyContent = PageTransitionSwitcher(
          duration: const Duration(milliseconds: 250),
          transitionBuilder: (child, primaryAnimation, secondaryAnimation) {
            return FadeThroughTransition(
              animation: primaryAnimation,
              secondaryAnimation: secondaryAnimation,
              child: child,
            );
          },
          child: KeyedSubtree(
            key: ValueKey<String>('${role.name}_$activeIndex'),
            child: tabScreens[activeIndex],
          ),
        );

        if (isTablet) {
          return Scaffold(
            backgroundColor: colors.canvas,
            body: Row(
              children: [
                ValueListenableBuilder<Map<String, int>>(
                  valueListenable: notificationBadges,
                  builder: (context, badges, _) {
                    return NavigationRail(
                      selectedIndex: activeIndex,
                      onDestinationSelected: _onTabSelected,
                      extended: isExtended,
                      minWidth: 72.0,
                      minExtendedWidth: 228.0,
                      backgroundColor: colors.surface,
                      selectedIconTheme: IconThemeData(color: colors.brand),
                      unselectedIconTheme: IconThemeData(color: colors.fgMuted),
                      selectedLabelTextStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: colors.brand,
                      ),
                      unselectedLabelTextStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: colors.fgMuted,
                      ),
                      leading: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: colors.surface2,
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                            border: Border.all(color: colors.line, width: 1.0),
                          ),
                          alignment: Alignment.center,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                            child: const BrandLogo(size: 28),
                          ),
                        ),
                      ),
                      trailing: Expanded(
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: IconButton(
                              icon: const Icon(Icons.tune),
                              tooltip: 'Campus Hub & Settings',
                              onPressed: _showMoreSheet,
                            ),
                          ),
                        ),
                      ),
                      destinations: _buildRailDestinations(role, badges, colors),
                    );
                  },
                ),
                VerticalDivider(thickness: 1, width: 1, color: colors.line),
                Expanded(
                  child: Scaffold(
                    backgroundColor: colors.canvas,
                    appBar: TopAppBar(
                      title: appTitle,
                      onAvatarTap: () => _navigateToRoute('/profile'),
                    ),
                    body: bodyContent,
                  ),
                ),
              ],
            ),
          );
        }

        return Scaffold(
          backgroundColor: colors.canvas,
          appBar: TopAppBar(
            title: appTitle,
            onAvatarTap: () => _navigateToRoute('/profile'),
          ),
          body: bodyContent,
          bottomNavigationBar: BottomNavBar(
            selectedIndex: activeIndex,
            onTabSelected: _onTabSelected,
          ),
        );
      },
    );
  }

  List<NavigationRailDestination> _buildRailDestinations(
    UserRole role,
    Map<String, int> badges,
    AppColors colors,
  ) {
    switch (role) {
      case UserRole.student:
        return [
          const NavigationRailDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: Text('Home'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month),
            label: Text('Routine'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.insights_outlined),
            selectedIcon: Icon(Icons.insights),
            label: Text('Progress'),
          ),
          NavigationRailDestination(
            icon: Badge(
              label: Text('${badges['notices'] ?? 3}'),
              child: const Icon(Icons.campaign_outlined),
            ),
            selectedIcon: Badge(
              label: Text('${badges['notices'] ?? 3}'),
              child: const Icon(Icons.campaign),
            ),
            label: const Text('Notices'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view),
            label: Text('More'),
          ),
        ];

      case UserRole.teacher:
        return [
          const NavigationRailDestination(
            icon: Icon(Icons.space_dashboard_outlined),
            selectedIcon: Icon(Icons.space_dashboard),
            label: Text('Home'),
          ),
          NavigationRailDestination(
            icon: Badge(
              backgroundColor: colors.success,
              smallSize: 8,
              child: const Icon(Icons.qr_code_scanner_outlined),
            ),
            selectedIcon: Badge(
              backgroundColor: colors.success,
              smallSize: 8,
              child: const Icon(Icons.qr_code_scanner),
            ),
            label: const Text('Attendance'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.fact_check_outlined),
            selectedIcon: Icon(Icons.fact_check),
            label: Text('Grades'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.schedule_outlined),
            selectedIcon: Icon(Icons.schedule),
            label: Text('Routine'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view),
            label: Text('More'),
          ),
        ];

      case UserRole.admin:
        return [
          const NavigationRailDestination(
            icon: Icon(Icons.admin_panel_settings_outlined),
            selectedIcon: Icon(Icons.admin_panel_settings),
            label: Text('Overview'),
          ),
          NavigationRailDestination(
            icon: Badge(
              backgroundColor: colors.danger,
              label: Text('${badges['pending_users'] ?? 7}'),
              child: const Icon(Icons.manage_accounts_outlined),
            ),
            selectedIcon: Badge(
              backgroundColor: colors.danger,
              label: Text('${badges['pending_users'] ?? 7}'),
              child: const Icon(Icons.manage_accounts),
            ),
            label: const Text('Users'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today),
            label: Text('Routine'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.broadcast_on_personal_outlined),
            selectedIcon: Icon(Icons.broadcast_on_personal),
            label: Text('Broadcasts'),
          ),
          const NavigationRailDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view),
            label: Text('More'),
          ),
        ];
    }
  }
}
