import 'package:flutter/material.dart';
import '../../core/models/user_role.dart';
import '../../core/theme.dart';
import '../../features/auth/controllers/auth_controller.dart';
import '../brand_logo.dart';
import '../common/uc_avatar.dart';

/// Production YouTube-style responsive TopAppBar for UniCampus Mobile.
///
/// Implements [PreferredSizeWidget] for standard [Scaffold.appBar] usage
/// and provides [TopAppBar.sliver] and [TopSliverAppBar] for collapsible
/// scrolling in [CustomScrollView].
class TopAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onSearchTap;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onAvatarTap;
  final bool showBrandLogo;

  const TopAppBar({
    super.key,
    required this.title,
    this.onSearchTap,
    this.onNotificationTap,
    this.onAvatarTap,
    this.showBrandLogo = true,
  });

  @override
  Size get preferredSize => const Size.fromHeight(60.0);

  /// Factory helper to instantiate a collapsible [TopSliverAppBar].
  static Widget sliver({
    Key? key,
    required String title,
    VoidCallback? onSearchTap,
    VoidCallback? onNotificationTap,
    VoidCallback? onAvatarTap,
    bool showBrandLogo = true,
    bool floating = true,
    bool snap = true,
    bool pinned = false,
  }) {
    return TopSliverAppBar(
      key: key,
      title: title,
      onSearchTap: onSearchTap,
      onNotificationTap: onNotificationTap,
      onAvatarTap: onAvatarTap,
      showBrandLogo: showBrandLogo,
      floating: floating,
      snap: snap,
      pinned: pinned,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return AppBar(
      elevation: 0,
      backgroundColor: colors.surface,
      surfaceTintColor: Colors.transparent,
      titleSpacing: AppSpacing.lg,
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1.0),
        child: Container(color: colors.line, height: 1.0),
      ),
      title: _TopBarTitleContent(
        title: title,
        showBrandLogo: showBrandLogo,
      ),
      actions: _buildActions(
        context,
        colors,
        onSearchTap: onSearchTap,
        onNotificationTap: onNotificationTap,
        onAvatarTap: onAvatarTap,
      ),
    );
  }

  static List<Widget> _buildActions(
    BuildContext context,
    AppColors colors, {
    VoidCallback? onSearchTap,
    VoidCallback? onNotificationTap,
    VoidCallback? onAvatarTap,
  }) {
    final controller = AuthController.instance;

    return [
      // Search action
      IconButton(
        icon: Icon(Icons.search, size: 22, color: colors.fg),
        tooltip: 'Search',
        splashRadius: 24,
        onPressed: onSearchTap ?? () => _showSearchModal(context),
      ),
      // Notifications action with animated unread badge
      Stack(
        alignment: Alignment.center,
        children: [
          IconButton(
            icon: Icon(Icons.notifications_none_outlined,
                size: 22, color: colors.fg),
            tooltip: 'Notifications',
            splashRadius: 24,
            onPressed: onNotificationTap ?? () => _showNotificationsModal(context),
          ),
          Positioned(
            top: 13,
            right: 12,
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0.5, end: 1.0),
              duration: const Duration(milliseconds: 350),
              curve: Curves.easeOutBack,
              builder: (context, scale, child) {
                return Transform.scale(
                  scale: scale,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: colors.danger,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: colors.danger.withValues(alpha: 0.4),
                          blurRadius: 4,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      // Avatar with brand ring
      Padding(
        padding: const EdgeInsets.only(right: AppSpacing.lg, left: 4),
        child: GestureDetector(
          onTap: onAvatarTap ?? () => _showAccountQuickSheet(context),
          child: Container(
            padding: const EdgeInsets.all(1.5),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: colors.brand, width: 1.5),
            ),
            child: UcAvatar(
              name: controller.user.name,
              imageUrl: controller.user.avatarUrl,
              size: 28,
            ),
          ),
        ),
      ),
    ];
  }

  static void _showRoleSwitcher(BuildContext context) {
    final colors = context.appColors;
    final controller = AuthController.instance;

    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: colors.line,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text(
                  'Switch Active Role Environment',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Instant role switching for multi-perspective campus access',
                  style: TextStyle(fontSize: 13, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.lg),
                ...UserRole.values.map((role) {
                  final isSelected = controller.currentRole == role;
                  return ListTile(
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    tileColor:
                        isSelected ? colors.brandSoft : Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      side: BorderSide(
                        color: isSelected ? colors.brand : colors.line,
                        width: 1.0,
                      ),
                    ),
                    leading: Icon(
                      role == UserRole.student
                          ? Icons.school
                          : role == UserRole.teacher
                              ? Icons.co_present
                              : Icons.admin_panel_settings,
                      color: isSelected ? colors.brand : colors.fgMuted,
                    ),
                    title: Text(
                      role.label,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: isSelected ? colors.brand : colors.fg,
                      ),
                    ),
                    subtitle: Text(
                      role == UserRole.student
                          ? 'Class routine, CGPA, notices, peer chat'
                          : role == UserRole.teacher
                              ? 'Attendance QR hub, gradebook, faculty notices'
                              : 'System governance, approvals, finance, routine',
                      style: TextStyle(fontSize: 12, color: colors.fgMuted),
                    ),
                    trailing: isSelected
                        ? Icon(Icons.check_circle, color: colors.brand)
                        : null,
                    onTap: () {
                      AppHaptics.selection();
                      controller.switchRole(role);
                      Navigator.pop(ctx);
                    },
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  static void _showSearchModal(BuildContext context) {
    final colors = context.appColors;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.75,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (_, scrollCtrl) {
            return Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                children: [
                  Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: colors.line,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  TextField(
                    autofocus: true,
                    style: TextStyle(fontSize: 15, color: colors.fg),
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.search, color: colors.brand),
                      hintText: 'Search campus notices, courses, teachers...',
                      hintStyle: TextStyle(color: colors.fgSubtle),
                      filled: true,
                      fillColor: colors.surface2,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        borderSide: BorderSide(color: colors.line),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        borderSide: BorderSide(color: colors.line),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Expanded(
                    child: ListView(
                      controller: scrollCtrl,
                      children: [
                        Text('Recent Searches',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: colors.fgMuted)),
                        const SizedBox(height: AppSpacing.sm),
                        ListTile(
                          dense: true,
                          leading: Icon(Icons.history, color: colors.fgSubtle),
                          title: Text('CSE-3101 Distributed Systems',
                              style: TextStyle(color: colors.fg)),
                          trailing: Icon(Icons.north_west,
                              size: 16, color: colors.fgSubtle),
                        ),
                        ListTile(
                          dense: true,
                          leading: Icon(Icons.history, color: colors.fgSubtle),
                          title: Text('Dr. Rafiqul Islam Office Hours',
                              style: TextStyle(color: colors.fg)),
                          trailing: Icon(Icons.north_west,
                              size: 16, color: colors.fgSubtle),
                        ),
                        ListTile(
                          dense: true,
                          leading: Icon(Icons.history, color: colors.fgSubtle),
                          title: Text('Fall 2026 Examination Schedule',
                              style: TextStyle(color: colors.fg)),
                          trailing: Icon(Icons.north_west,
                              size: 16, color: colors.fgSubtle),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  static void _showNotificationsModal(BuildContext context) {
    final colors = context.appColors;
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: colors.line,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Campus Alerts',
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: colors.fg)),
                    GestureDetector(
                      onTap: () {
                        AppHaptics.light();
                        Navigator.pop(ctx);
                      },
                      child: Text('Mark all read',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: colors.brand)),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: colors.dangerSoft,
                      shape: BoxShape.circle,
                    ),
                    child:
                        Icon(Icons.priority_high, color: colors.danger, size: 20),
                  ),
                  title: Text('Fall 2026 Exam Routine Published',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: colors.fg)),
                  subtitle: Text('Admit cards available from Dec 05 • 10m ago',
                      style: TextStyle(fontSize: 12, color: colors.fgMuted)),
                ),
                const Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: colors.brandSoft,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.assignment, color: colors.brand, size: 20),
                  ),
                  title: Text('Lab 04 Deadline Extended',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: colors.fg)),
                  subtitle: Text('Dr. Rafiqul extended to Friday • 2h ago',
                      style: TextStyle(fontSize: 12, color: colors.fgMuted)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  static void _showAccountQuickSheet(BuildContext context) {
    final colors = context.appColors;
    final controller = AuthController.instance;

    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcAvatar(
                  name: controller.user.name,
                  imageUrl: controller.user.avatarUrl,
                  size: 64,
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  controller.user.name,
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                Text(
                  controller.user.email,
                  style: TextStyle(fontSize: 13, color: colors.fgMuted),
                ),
                const SizedBox(height: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: colors.brandSoft,
                    borderRadius: BorderRadius.circular(AppRadius.pill),
                  ),
                  child: Text(
                    'ID: ${controller.user.campusId}',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: colors.brand,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                ListTile(
                  leading: Icon(Icons.badge_outlined, color: colors.fg),
                  title: Text('Digital Student ID Badge',
                      style: TextStyle(
                          color: colors.fg, fontWeight: FontWeight.w500)),
                  trailing: Icon(Icons.chevron_right, color: colors.fgMuted),
                  onTap: () => Navigator.pop(ctx),
                ),
                ListTile(
                  leading: Icon(Icons.settings_outlined, color: colors.fg),
                  title: Text('Portal Settings & Appearance',
                      style: TextStyle(
                          color: colors.fg, fontWeight: FontWeight.w500)),
                  trailing: Icon(Icons.chevron_right, color: colors.fgMuted),
                  onTap: () => Navigator.pop(ctx),
                ),
                ListTile(
                  leading: Icon(Icons.logout, color: colors.danger),
                  title: Text('Log Out',
                      style: TextStyle(
                          color: colors.danger, fontWeight: FontWeight.w600)),
                  onTap: () {
                    AppHaptics.medium();
                    controller.logout();
                    Navigator.pop(ctx);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

/// Collapsible SliverAppBar mode for YouTube-style responsive headers.
class TopSliverAppBar extends StatelessWidget {
  final String title;
  final VoidCallback? onSearchTap;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onAvatarTap;
  final bool showBrandLogo;
  final bool floating;
  final bool snap;
  final bool pinned;

  const TopSliverAppBar({
    super.key,
    required this.title,
    this.onSearchTap,
    this.onNotificationTap,
    this.onAvatarTap,
    this.showBrandLogo = true,
    this.floating = true,
    this.snap = true,
    this.pinned = false,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return SliverAppBar(
      floating: floating,
      snap: snap,
      pinned: pinned,
      elevation: 0,
      backgroundColor: colors.surface,
      surfaceTintColor: Colors.transparent,
      titleSpacing: AppSpacing.lg,
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1.0),
        child: Container(color: colors.line, height: 1.0),
      ),
      title: _TopBarTitleContent(
        title: title,
        showBrandLogo: showBrandLogo,
      ),
      actions: TopAppBar._buildActions(
        context,
        colors,
        onSearchTap: onSearchTap,
        onNotificationTap: onNotificationTap,
        onAvatarTap: onAvatarTap,
      ),
    );
  }
}

class _TopBarTitleContent extends StatelessWidget {
  final String title;
  final bool showBrandLogo;

  const _TopBarTitleContent({
    required this.title,
    required this.showBrandLogo,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final controller = AuthController.instance;

    return LayoutBuilder(
      builder: (context, constraints) {
        final availableWidth = constraints.hasBoundedWidth && constraints.maxWidth.isFinite
            ? constraints.maxWidth
            : 360.0;
        final isCompact = availableWidth < 220;
        final isUltraCompact = availableWidth < 140;
        final displayLogo = showBrandLogo && (!isUltraCompact || availableWidth >= 120);
        final logoSize = isCompact ? 22.0 : 28.0;
        final brandSize = isCompact ? 16.0 : 20.0;
        final logoSpacing = isCompact ? 4.0 : AppSpacing.sm;
        final pillSpacing = isCompact ? 6.0 : AppSpacing.md;
        final pillPaddingH = isCompact ? 6.0 : 10.0;

        return Row(
          children: [
            // DCC crest squircle badge
            if (displayLogo) ...[
              Container(
                width: logoSize,
                height: logoSize,
                decoration: BoxDecoration(
                  color: colors.surface2,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  border: Border.all(color: colors.line, width: 1.0),
                ),
                alignment: Alignment.center,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  child: BrandLogo(size: brandSize),
                ),
              ),
              SizedBox(width: logoSpacing),
            ],

            // Role switch pill
            Flexible(
              flex: 2,
              fit: FlexFit.loose,
              child: GestureDetector(
                onTap: () {
                  AppHaptics.light();
                  TopAppBar._showRoleSwitcher(context);
                },
                child: Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: pillPaddingH,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: colors.brandSoft,
                    borderRadius: BorderRadius.circular(AppRadius.pill),
                    border: Border.all(
                      color: colors.brand.withValues(alpha: 0.2),
                      width: 1.0,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          controller.currentRole.badgeLabel,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: isCompact ? 10 : 11,
                            fontWeight: FontWeight.w700,
                            color: colors.brand,
                            letterSpacing: isCompact ? 0.2 : 0.4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 2),
                      Icon(
                        Icons.arrow_drop_down,
                        size: isCompact ? 14 : 16,
                        color: colors.brand,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SizedBox(width: pillSpacing),

            // Screen title
            Expanded(
              flex: 3,
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: isCompact ? 15 : 17,
                  fontWeight: FontWeight.w600,
                  color: colors.fg,
                  letterSpacing: -0.3,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
