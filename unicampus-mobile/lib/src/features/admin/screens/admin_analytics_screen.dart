import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_card.dart';

class AdminAnalyticsScreen extends StatelessWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Institutional Campus Analytics'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Real-time Campus Attendance Average',
                    style: TextStyle(fontSize: 13, color: colors.fgMuted)),
                const SizedBox(height: 4),
                Text('90.8%',
                    style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        color: colors.fg)),
                const SizedBox(height: AppSpacing.md),
                Text('Highest: CSE (92%) • Lowest: ENG (86%)',
                    style: TextStyle(fontSize: 12, color: colors.brand)),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Portal Daily Active Users (DAU)',
                    style: TextStyle(fontSize: 13, color: colors.fgMuted)),
                const SizedBox(height: 4),
                Text('2,840 Users / Day',
                    style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: colors.fg)),
                const SizedBox(height: 4),
                Text('83% Student Engagement Rate',
                    style: TextStyle(fontSize: 12, color: colors.success)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
