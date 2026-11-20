import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // CGPA Summary Hero Card
                  UcCard(
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    borderRadius: AppRadius.xl,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Cumulative GPA',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: colors.fgMuted,
                              ),
                            ),
                            UcBadge(
                              label: 'HONORS STANDING',
                              variant: UcBadgeVariant.brand,
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              '3.84',
                              style: TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.w800,
                                color: colors.fg,
                                letterSpacing: -1.0,
                                fontFeatures: const [
                                  FontFeature.tabularFigures()
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '/ 4.00',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Degree Completion',
                                style: TextStyle(
                                    fontSize: 12, color: colors.fgMuted)),
                            Text('98.5 of 144 Credits (68%)',
                                style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: colors.fg)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(3),
                          child: LinearProgressIndicator(
                            value: 98.5 / 144.0,
                            minHeight: 6,
                            backgroundColor: colors.surface2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(colors.brand),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        UcButton(
                          label: 'Simulate Next Semester GPA',
                          icon: const Icon(Icons.calculate_outlined, size: 18),
                          variant: UcButtonVariant.secondary,
                          width: double.infinity,
                          onPressed: () {
                            _showGpaSimulator(context, colors);
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  Text(
                    'Semester History & Courses',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ...MockData.academicHistory.map((semester) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
                      child: UcCard(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment:
                                  MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  semester.semester,
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
                                    color: colors.fg,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: colors.brandSoft,
                                    borderRadius:
                                        BorderRadius.circular(AppRadius.xs),
                                  ),
                                  child: Text(
                                    'GPA ${semester.gpa}',
                                    style: TextStyle(
                                      fontFamily: 'monospace',
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: colors.brand,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.md),
                            const Divider(),
                            const SizedBox(height: AppSpacing.sm),
                            ...semester.courses.map((course) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                    vertical: AppSpacing.xs),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            course.code,
                                            style: TextStyle(
                                              fontFamily: 'monospace',
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: colors.brand,
                                            ),
                                          ),
                                          Text(
                                            course.title,
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                              color: colors.fg,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      '${course.credits} Cr',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: colors.fgMuted,
                                      ),
                                    ),
                                    const SizedBox(width: AppSpacing.md),
                                    Container(
                                      width: 34,
                                      alignment: Alignment.center,
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 3),
                                      decoration: BoxDecoration(
                                        color: colors.surface2,
                                        borderRadius: BorderRadius.circular(
                                            AppRadius.xs),
                                        border: Border.all(
                                            color: colors.line, width: 1.0),
                                      ),
                                      child: Text(
                                        course.grade,
                                        style: TextStyle(
                                          fontFamily: 'monospace',
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: colors.fg,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showGpaSimulator(BuildContext context, AppColors colors) {
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
                  'GPA Target Simulator',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Predict your required semester grades to graduate with Summa Cum Laude (>= 3.85)',
                  style: TextStyle(fontSize: 13, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Target Semester GPA:',
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: colors.fg)),
                      Text('3.90',
                          style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: colors.brand)),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcButton(
                  label: 'Calculate Required Grades',
                  onPressed: () => Navigator.pop(ctx),
                  width: double.infinity,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
