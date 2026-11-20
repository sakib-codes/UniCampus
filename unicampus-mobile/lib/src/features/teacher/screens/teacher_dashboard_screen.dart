import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class TeacherDashboardScreen extends StatelessWidget {
  final ValueChanged<String>? onNavigate;

  const TeacherDashboardScreen({super.key, this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return RefreshIndicator(
      color: colors.brand,
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 600));
      },
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: AppSpacing.lg),
                  // Faculty Greeting
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Dr. Rafiqul Islam',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'Head of CSE • Associate Professor',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: colors.fgMuted,
                            ),
                          ),
                        ],
                      ),
                      UcBadge(
                        label: 'IN OFFICE',
                        variant: UcBadgeVariant.success,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // 1. Active Class Command Card
                  _buildActiveClassCard(context, colors),

                  const SizedBox(height: AppSpacing.lg),

                  // 2. Quick Action Strip
                  _buildQuickActionStrip(context, colors),

                  const SizedBox(height: AppSpacing.xl),

                  // 3. 2x2 Faculty Bento KPI Grid
                  _buildFacultyKpiGrid(context, colors),

                  const SizedBox(height: AppSpacing.xxl),

                  // 4. Today's Teaching Schedule
                  _buildTeachingSchedule(context, colors),

                  const SizedBox(height: AppSpacing.xxxl),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveClassCard(BuildContext context, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      borderRadius: AppRadius.xl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: colors.success,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'SESSION ACTIVE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: colors.success,
                      letterSpacing: 0.4,
                    ),
                  ),
                ],
              ),
              Text(
                'CSE-3101 • Section A',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: colors.brand,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'Distributed Systems & Consensus',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Room 502 • 52 Enrolled Students • 09:00 – 10:30 AM',
            style: TextStyle(fontSize: 13, color: colors.fgMuted),
          ),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              Expanded(
                child: UcButton(
                  label: 'Launch Attendance QR',
                  icon: const Icon(Icons.qr_code_2, size: 20),
                  onPressed: () {
                    if (onNavigate != null) {
                      onNavigate!('/teacher/attendance');
                    }
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              UcButton(
                label: 'Roster (52)',
                icon: const Icon(Icons.people_outline, size: 18),
                variant: UcButtonVariant.secondary,
                onPressed: () {
                  if (onNavigate != null) {
                    onNavigate!('/teacher/attendance');
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionStrip(BuildContext context, AppColors colors) {
    final actions = [
      {'icon': Icons.qr_code_scanner, 'label': 'Attendance', 'route': '/teacher/attendance'},
      {'icon': Icons.fact_check, 'label': 'Gradebook', 'route': '/teacher/grades'},
      {'icon': Icons.campaign, 'label': 'Post Notice', 'route': '/teacher/notices'},
      {'icon': Icons.upload_file, 'label': 'Upload Material', 'route': '/teacher/materials'},
      {'icon': Icons.calendar_today, 'label': 'Routine', 'route': '/teacher/routine'},
    ];

    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: actions.length,
        separatorBuilder: (context, index) => const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, index) {
          final item = actions[index];
          return Material(
            color: colors.surface2,
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: InkWell(
              borderRadius: BorderRadius.circular(AppRadius.md),
              onTap: () {
                if (onNavigate != null) onNavigate!(item['route'] as String);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: colors.line, width: 1.0),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(item['icon'] as IconData, size: 16, color: colors.brand),
                    const SizedBox(width: 6),
                    Text(
                      item['label'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colors.fg,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFacultyKpiGrid(BuildContext context, AppColors colors) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: AppSpacing.md,
      mainAxisSpacing: AppSpacing.md,
      childAspectRatio: 1.25,
      children: [
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Classes Today',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Text('3 Lectures',
                  style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.fg)),
              Text('1 Completed • 2 Remaining',
                  style: TextStyle(fontSize: 11, color: colors.brand)),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Avg Attendance',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('91.2%',
                      style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: colors.fg)),
                  UcBadge(label: '+2.4%', variant: UcBadgeVariant.success),
                ],
              ),
              Text('Across 3 Course Sections',
                  style: TextStyle(fontSize: 11, color: colors.fgMuted)),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          onTap: () {
            if (onNavigate != null) onNavigate!('/teacher/grades');
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Pending Grades',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Text('18 Submissions',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: colors.fg)),
                  ),
                  const SizedBox(width: 4),
                  UcBadge(label: 'DUE', variant: UcBadgeVariant.warning),
                ],
              ),
              Text('Lab 04 Raft Consensus',
                  style: TextStyle(fontSize: 11, color: colors.fgMuted)),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          onTap: () {
            if (onNavigate != null) onNavigate!('/messages');
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Student Inquiries',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('4 Unread',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: colors.fg)),
                  UcBadge(label: 'NEW', variant: UcBadgeVariant.brand),
                ],
              ),
              Text('Thesis & Office Hours',
                  style: TextStyle(fontSize: 11, color: colors.fgMuted)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTeachingSchedule(BuildContext context, AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Teaching Routine for Today',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: colors.fg,
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        ...MockData.todayRoutine.map((slot) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  SizedBox(
                    width: 72,
                    child: Text(
                      slot.startTime,
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                      ),
                    ),
                  ),
                  Container(
                    width: 3,
                    height: 34,
                    decoration: BoxDecoration(
                      color: colors.brand,
                      borderRadius: BorderRadius.circular(1.5),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${slot.courseCode} • ${slot.courseTitle}',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: colors.fg,
                          ),
                        ),
                        Text(
                          '${slot.room} • Batch 2023',
                          style: TextStyle(fontSize: 12, color: colors.fgMuted),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
