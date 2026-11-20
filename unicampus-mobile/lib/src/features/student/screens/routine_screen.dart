import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';

class RoutineScreen extends StatefulWidget {
  const RoutineScreen({super.key});

  @override
  State<RoutineScreen> createState() => _RoutineScreenState();
}

class _RoutineScreenState extends State<RoutineScreen> {
  int _selectedDayIndex = 4; // Thursday
  final List<String> _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.md),
                // Days Filter Strip
                UcChipBar(
                  chips: _days,
                  selectedIndex: _selectedDayIndex,
                  onSelected: (idx) {
                    setState(() => _selectedDayIndex = idx);
                  },
                ),
                const SizedBox(height: AppSpacing.md),
                // Summary header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${_days[_selectedDayIndex]} Schedule',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                        ),
                      ),
                      Text(
                        '3 Classes • 6.0 Hours',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: colors.fgMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final slot = MockData.todayRoutine[index % MockData.todayRoutine.length];
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
                              Row(
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
                                  const SizedBox(width: AppSpacing.sm),
                                  UcBadge(
                                    label: slot.isLab ? 'PRACTICAL LAB' : 'THEORY',
                                    variant: slot.isLab
                                        ? UcBadgeVariant.warning
                                        : UcBadgeVariant.neutral,
                                  ),
                                ],
                              ),
                              const SizedBox(width: 8),
                              Flexible(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: colors.surface2,
                                    borderRadius:
                                        BorderRadius.circular(AppRadius.xs),
                                    border: Border.all(
                                        color: colors.line, width: 1.0),
                                  ),
                                  child: Text(
                                    slot.room,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: colors.fg,
                                    ),
                                  ),
                                ),
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
                              letterSpacing: -0.2,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Row(
                            children: [
                              Icon(Icons.schedule,
                                  size: 15, color: colors.fgMuted),
                              const SizedBox(width: 5),
                              Text(
                                '${slot.startTime} – ${slot.endTime}',
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: colors.fgMuted,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.lg),
                              Icon(Icons.person_outline,
                                  size: 15, color: colors.fgMuted),
                              const SizedBox(width: 5),
                              Expanded(
                                child: Text(
                                  slot.teacher,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: colors.fgMuted,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
                childCount: MockData.todayRoutine.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
