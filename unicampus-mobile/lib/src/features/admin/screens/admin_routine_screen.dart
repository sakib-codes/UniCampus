import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class AdminRoutineScreen extends StatelessWidget {
  const AdminRoutineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Master Routine & Room Allocation'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Campus Room Allocation Engine',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Detect room conflicts and schedule audits across all 6 departments',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: UcButton(
                        label: 'Audit Routine Conflicts',
                        icon: const Icon(Icons.check_circle_outline, size: 16),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Audit complete: 0 room collisions detected')),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Active Classrooms (Academic Bldg 1)',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ...['Room 402 (CSE)', 'Room 501 (Faculty Office)', 'Room 502 (CSE-3101)', 'Software Lab 3'].map((room) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: UcCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(room, style: TextStyle(fontWeight: FontWeight.w600, color: colors.fg)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: colors.successSoft,
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: Text('OCCUPIED',
                          style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: colors.success)),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
