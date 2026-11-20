import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_card.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _pushNotifications = true;
  bool _offlineCache = true;
  bool _biometricUnlock = false;

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
          Text(
            'System Preferences',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                SwitchListTile(
                  title: Text('Push Notifications',
                      style: TextStyle(color: colors.fg, fontWeight: FontWeight.w500)),
                  subtitle: const Text('Exam alerts, class cancellations'),
                  value: _pushNotifications,
                  onChanged: (val) => setState(() => _pushNotifications = val),
                ),
                const Divider(),
                SwitchListTile(
                  title: Text('Offline Routine & Cache',
                      style: TextStyle(color: colors.fg, fontWeight: FontWeight.w500)),
                  subtitle: const Text('Store PDFs and routine locally'),
                  value: _offlineCache,
                  onChanged: (val) => setState(() => _offlineCache = val),
                ),
                const Divider(),
                SwitchListTile(
                  title: Text('Biometric Fingerprint Unlock',
                      style: TextStyle(color: colors.fg, fontWeight: FontWeight.w500)),
                  subtitle: const Text('Fast secure sign-in with fingerprint'),
                  value: _biometricUnlock,
                  onChanged: (val) => setState(() => _biometricUnlock = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Storage & Cache Management',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Cached Course Materials',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: colors.fg)),
                    const SizedBox(height: 2),
                    Text('42.8 MB stored on device',
                        style: TextStyle(fontSize: 12, color: colors.fgMuted)),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Cache cleared successfully')),
                    );
                  },
                  child: Text('Clear Cache',
                      style: TextStyle(color: colors.danger)),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Institutional Information',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('UniCampus Mobile v1.0.0+1 (Stable)',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: colors.fg)),
                const SizedBox(height: 4),
                Text('Dhaka City College Information Systems & IT Division',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
