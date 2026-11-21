import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_card.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // Notification preferences
  bool _pushNotifications = true;
  bool _offlineCache = true;
  bool _urgentNotices = true;
  bool _routineReminders = true;
  bool _messageAlerts = true;

  // Security preferences
  bool _biometricUnlock = false;

  // Appearance
  int _themeSelection = 0; // 0 = System, 1 = Light, 2 = Dark

  // Cache state
  bool _cacheCleared = false;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Portal Settings & Preferences'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // Section 1: General & Appearance
          _buildSectionHeader('General & Appearance', colors),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Appearance Theme',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: colors.fg,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Select app color interface mode',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 12, color: colors.fgMuted),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      _buildThemeSelector(colors),
                    ],
                  ),
                ),
                const Divider(),
                ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md, vertical: 2),
                  leading: Icon(Icons.person_outline, color: colors.brand),
                  title: Text(
                    'Profile Account',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Tanvir Ahmed • ID: 2023-1-60-042',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  trailing: Icon(Icons.chevron_right, color: colors.fgMuted),
                  onTap: () {
                    AppHaptics.light();
                  },
                ),
                const Divider(),
                ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md, vertical: 2),
                  leading: Icon(Icons.language_outlined, color: colors.brand),
                  title: Text(
                    'Language & Regional',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'English (BD) • Asia/Dhaka (UTC+6)',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  trailing: Icon(Icons.chevron_right, color: colors.fgMuted),
                  onTap: () {
                    AppHaptics.light();
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Section 2: Notifications & Alerts
          _buildSectionHeader('Notifications & Alerts', colors),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                SwitchListTile(
                  title: Text(
                    'Push Notifications',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Master alert trigger for exams and schedules',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _pushNotifications,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _pushNotifications = val);
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: Text(
                    'Offline Routine & Cache',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Store PDFs, notices, and routine locally',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _offlineCache,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _offlineCache = val);
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: Text(
                    'Urgent Campus Notices',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Emergency announcements from Registrar',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _urgentNotices,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _urgentNotices = val);
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: Text(
                    'Class Routine Reminders',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    '15 minutes before scheduled lectures',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _routineReminders,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _routineReminders = val);
                  },
                ),
                const Divider(),
                SwitchListTile(
                  title: Text(
                    'Direct Messages & Mentions',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Real-time chat messages from peers and faculty',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _messageAlerts,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _messageAlerts = val);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Section 3: Storage & Security
          _buildSectionHeader('Storage & Security', colors),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                SwitchListTile(
                  title: Text(
                    'Biometric Fingerprint Unlock',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                  subtitle: Text(
                    'Fast secure biometric app authentication',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  value: _biometricUnlock,
                  activeThumbColor: colors.brand,
                  onChanged: (val) {
                    AppHaptics.selection();
                    setState(() => _biometricUnlock = val);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(val
                            ? 'Biometric app lock enabled'
                            : 'Biometric app lock disabled'),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                ),
                const Divider(),
                // Cache Size Breakdown
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Local Storage Cache',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: colors.fg,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _cacheCleared
                                      ? '0.0 KB stored on device'
                                      : '42.8 MB stored on device',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 12,
                                    color: colors.fgMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          TextButton(
                            onPressed: _cacheCleared
                                ? null
                                : () {
                                    AppHaptics.success();
                                    setState(() => _cacheCleared = true);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                            'Cache cleared successfully (42.8 MB freed)'),
                                      ),
                                    );
                                  },
                            child: Text(
                              _cacheCleared ? 'Cleared' : 'Clear Cache',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: _cacheCleared
                                    ? colors.fgSubtle
                                    : colors.danger,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      // Cache breakdown bar
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: colors.surface2,
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                          border: Border.all(color: colors.line),
                        ),
                        child: Column(
                          children: [
                            _buildCacheRow('PDFs & Slides',
                                _cacheCleared ? '0.0 KB' : '28.4 MB', colors),
                            const SizedBox(height: 4),
                            _buildCacheRow('Routine & Notices',
                                _cacheCleared ? '0.0 KB' : '6.2 MB', colors),
                            const SizedBox(height: 4),
                            _buildCacheRow('Avatars & Media',
                                _cacheCleared ? '0.0 KB' : '8.2 MB', colors),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Institutional Information
          _buildSectionHeader('Institutional Information', colors),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'UniCampus Mobile',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: colors.brandSoft,
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: Text(
                        'v1.0.0+1 Stable',
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: colors.brand,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Dhaka City College Information Systems & IT Division',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
                const SizedBox(height: 2),
                Text(
                  'Calm Campus Option A Indigo Design System',
                  style: TextStyle(fontSize: 11, color: colors.fgSubtle),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, AppColors colors) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w700,
        color: colors.fgMuted,
        letterSpacing: 0.2,
      ),
    );
  }

  Widget _buildThemeSelector(AppColors colors) {
    final themeLabels = ['System', 'Light', 'Dark'];

    return Container(
      height: 32,
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: colors.line),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(themeLabels.length, (idx) {
          final isSelected = _themeSelection == idx;
          return GestureDetector(
            onTap: () {
              AppHaptics.selection();
              setState(() => _themeSelection = idx);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isSelected ? colors.surface : Colors.transparent,
                borderRadius: BorderRadius.circular(AppRadius.xs),
                border: isSelected
                    ? Border.all(color: colors.line, width: 1.0)
                    : null,
              ),
              child: Text(
                themeLabels[idx],
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? colors.fg : colors.fgMuted,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildCacheRow(String label, String size, AppColors colors) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 11, color: colors.fgMuted),
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Text(
          size,
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: colors.fg,
          ),
        ),
      ],
    );
  }
}
