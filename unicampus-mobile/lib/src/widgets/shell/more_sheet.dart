import 'package:flutter/material.dart';
import '../../core/models/user_role.dart';
import '../../core/theme.dart';
import '../../features/auth/controllers/auth_controller.dart';
import '../common/uc_card.dart';

/// Draggable 2-column Bento modal bottom sheet for overflow navigation tools,
/// role environment switcher, and instant theme toggle.
class MoreSheet extends StatefulWidget {
  final ValueChanged<String>? onNavigate;

  const MoreSheet({
    super.key,
    this.onNavigate,
  });

  @override
  State<MoreSheet> createState() => _MoreSheetState();
}

class _MoreSheetState extends State<MoreSheet> {
  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final role = AuthController.instance.currentRole;
    final currentThemeMode = AppTheme.currentThemeMode;

    final List<_MoreItem> items;

    if (role == UserRole.student) {
      items = [
        const _MoreItem(
          icon: Icons.chat_bubble_outline,
          title: 'Campus Chat',
          subtitle: 'Peer & study groups',
          route: '/messages',
          badge: 'Messages: 3',
        ),
        const _MoreItem(
          icon: Icons.menu_book_outlined,
          title: 'Course Materials',
          subtitle: 'Lecture notes & PDFs',
          route: '/materials',
        ),
        const _MoreItem(
          icon: Icons.people_outline,
          title: 'Classmates',
          subtitle: 'Student directory',
          route: '/students',
        ),
        const _MoreItem(
          icon: Icons.co_present_outlined,
          title: 'Faculty Directory',
          subtitle: 'Teacher office hours',
          route: '/teachers',
        ),
        const _MoreItem(
          icon: Icons.badge_outlined,
          title: 'Digital ID Badge',
          subtitle: 'RFID & QR identity',
          route: '/profile',
        ),
        const _MoreItem(
          icon: Icons.settings_outlined,
          title: 'Portal Settings',
          subtitle: 'Dark mode & alerts',
          route: '/settings',
        ),
      ];
    } else if (role == UserRole.teacher) {
      items = [
        const _MoreItem(
          icon: Icons.campaign_outlined,
          title: 'Faculty Notices',
          subtitle: 'Publish circulars',
          route: '/teacher/notices',
        ),
        const _MoreItem(
          icon: Icons.upload_file_outlined,
          title: 'Upload Materials',
          subtitle: 'Manage slides & labs',
          route: '/teacher/materials',
        ),
        const _MoreItem(
          icon: Icons.chat_bubble_outline,
          title: 'Faculty Messaging',
          subtitle: 'Student consultations',
          route: '/messages',
          badge: 'Messages: 3',
        ),
        const _MoreItem(
          icon: Icons.people_outline,
          title: 'Department Roster',
          subtitle: 'CSE faculty & staff',
          route: '/teachers',
        ),
        const _MoreItem(
          icon: Icons.badge_outlined,
          title: 'Faculty Profile',
          subtitle: 'Designation & room',
          route: '/profile',
        ),
        const _MoreItem(
          icon: Icons.settings_outlined,
          title: 'Portal Settings',
          subtitle: 'Preferences & theme',
          route: '/settings',
        ),
      ];
    } else {
      items = [
        const _MoreItem(
          icon: Icons.manage_accounts_outlined,
          title: 'Role Approvals',
          subtitle: 'User provisioning',
          route: '/admin/users',
          badge: 'Pending: 7',
        ),
        const _MoreItem(
          icon: Icons.domain_outlined,
          title: 'Departments',
          subtitle: 'Academic governance',
          route: '/admin/departments',
        ),
        const _MoreItem(
          icon: Icons.account_balance_wallet_outlined,
          title: 'Treasury & Finance',
          subtitle: 'Fees & payroll audits',
          route: '/admin/finance',
        ),
        const _MoreItem(
          icon: Icons.analytics_outlined,
          title: 'Campus Analytics',
          subtitle: 'KPIs & performance',
          route: '/admin/analytics',
        ),
        const _MoreItem(
          icon: Icons.security_outlined,
          title: 'System Settings',
          subtitle: 'SuperAdmin controls',
          route: '/settings',
        ),
        const _MoreItem(
          icon: Icons.chat_bubble_outline,
          title: 'Direct Messages',
          subtitle: 'Administrative communications',
          route: '/messages',
          badge: 'Messages: 2',
        ),
      ];
    }

    return Container(
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius:
            const BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg,
            AppSpacing.md,
            AppSpacing.lg,
            AppSpacing.lg,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 36×4dp Drag Handle
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: AppSpacing.md),
                  decoration: BoxDecoration(
                    color: colors.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Title and Active Role Pill
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Campus Hub & Tools',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: colors.brandSoft,
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                      border: Border.all(
                        color: colors.brand.withValues(alpha: 0.2),
                        width: 1.0,
                      ),
                    ),
                    child: Text(
                      role.badgeLabel,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: colors.brand,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Role Switcher Control
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: colors.surface2,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: colors.line, width: 1.0),
                ),
                child: Row(
                  children: UserRole.values.map((r) {
                    final isSelected = r == role;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          AppHaptics.selection();
                          AuthController.instance.switchRole(r);
                          setState(() {});
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? colors.surface : Colors.transparent,
                            borderRadius:
                                BorderRadius.circular(AppRadius.sm + 2),
                            border: isSelected
                                ? Border.all(color: colors.brand, width: 1.0)
                                : null,
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.05),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : null,
                          ),
                          child: Text(
                            r.label,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected
                                  ? FontWeight.w700
                                  : FontWeight.w500,
                              color: isSelected ? colors.brand : colors.fgMuted,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Theme Quick-Toggle Segmented Control
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: colors.surface2,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: colors.line, width: 1.0),
                ),
                child: Row(
                  children: [
                    _ThemeToggleOption(
                      label: 'System',
                      icon: Icons.brightness_auto,
                      isSelected: currentThemeMode == ThemeMode.system,
                      onTap: () {
                        AppHaptics.selection();
                        AppTheme.currentThemeMode = ThemeMode.system;
                        setState(() {});
                      },
                    ),
                    _ThemeToggleOption(
                      label: 'Light',
                      icon: Icons.light_mode,
                      isSelected: currentThemeMode == ThemeMode.light,
                      onTap: () {
                        AppHaptics.selection();
                        AppTheme.currentThemeMode = ThemeMode.light;
                        setState(() {});
                      },
                    ),
                    _ThemeToggleOption(
                      label: 'Dark',
                      icon: Icons.dark_mode,
                      isSelected: currentThemeMode == ThemeMode.dark,
                      onTap: () {
                        AppHaptics.selection();
                        AppTheme.currentThemeMode = ThemeMode.dark;
                        setState(() {});
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Bento 2-column Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: items.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: AppSpacing.md,
                  mainAxisSpacing: AppSpacing.md,
                  childAspectRatio: 1.35,
                ),
                itemBuilder: (context, index) {
                  final item = items[index];
                  return UcCard(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    onTap: () {
                      AppHaptics.light();
                      Navigator.pop(context);
                      if (widget.onNavigate != null) {
                        widget.onNavigate!(item.route);
                      }
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(7),
                              decoration: BoxDecoration(
                                color: colors.brandSoft,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.sm),
                              ),
                              child: Icon(item.icon,
                                  size: 20, color: colors.brand),
                            ),
                            if (item.badge != null)
                              Flexible(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: colors.brand,
                                    borderRadius:
                                        BorderRadius.circular(AppRadius.pill),
                                  ),
                                  child: Text(
                                    item.badge!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: colors.fg,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              item.subtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ThemeToggleOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ThemeToggleOption({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? colors.surface : Colors.transparent,
            borderRadius: BorderRadius.circular(AppRadius.sm + 2),
            border: isSelected
                ? Border.all(color: colors.brand, width: 1.0)
                : null,
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: isSelected ? colors.brand : colors.fgMuted,
              ),
              const SizedBox(width: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight:
                      isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? colors.brand : colors.fgMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MoreItem {
  final IconData icon;
  final String title;
  final String subtitle;
  final String route;
  final String? badge;

  const _MoreItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.route,
    this.badge,
  });
}
