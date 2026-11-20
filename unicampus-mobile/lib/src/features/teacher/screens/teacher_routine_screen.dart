import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_card.dart';

class TeacherRoutineScreen extends StatelessWidget {
  const TeacherRoutineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty Master Routine'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: MockData.todayRoutine.map((slot) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child: UcCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        slot.courseCode,
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: colors.brand,
                        ),
                      ),
                      UcBadge(
                        label: slot.isLab ? 'LAB' : 'THEORY',
                        variant: slot.isLab
                            ? UcBadgeVariant.warning
                            : UcBadgeVariant.neutral,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    slot.courseTitle,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${slot.startTime} – ${slot.endTime} • ${slot.room}',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: colors.fgMuted,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
