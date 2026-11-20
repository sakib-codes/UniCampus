import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../messages/screens/chat_thread_screen.dart';

class StudentDashboardScreen extends StatelessWidget {
  final ValueChanged<String>? onNavigate;

  const StudentDashboardScreen({super.key, this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return RefreshIndicator(
      color: colors.brand,
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 600));
      },
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: AppSpacing.lg),
                  // Greeting & Program Meta
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Good Morning, Tanvir',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: colors.fg,
                                letterSpacing: -0.4,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              'CSE • 6th Semester • Fall 2026',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: colors.successSoft,
                          borderRadius: BorderRadius.circular(AppRadius.pill),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: colors.success,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Text(
                              'ENROLLED',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: colors.success,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // 1. Live Lecture Hero Card
                  _buildLiveLectureHeroCard(context, colors),

                  const SizedBox(height: AppSpacing.lg),

                  // 2. Quick Action Strip
                  _buildQuickActionStrip(context, colors),

                  const SizedBox(height: AppSpacing.xl),

                  // 3. 2x2 Bento KPI Grid
                  _buildKpiBentoGrid(context, colors),

                  const SizedBox(height: AppSpacing.xxl),

                  // 4. Today's Routine Preview
                  _buildTodayRoutineSection(context, colors),

                  const SizedBox(height: AppSpacing.xxl),

                  // 5. Pinned Campus Notices Preview
                  _buildNoticesPreview(context, colors),

                  const SizedBox(height: AppSpacing.xxl),

                  // 6. Direct Messages Preview
                  _buildRecentMessagesSection(context, colors),

                  const SizedBox(height: AppSpacing.xxxl),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveLectureHeroCard(BuildContext context, AppColors colors) {
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
                    'LIVE NOW',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: colors.success,
                      letterSpacing: 0.4,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: colors.brandSoft,
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  'CSE-3101',
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
          const SizedBox(height: AppSpacing.md),
          Text(
            'Distributed Systems & Consensus',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: colors.fg,
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Room 502 • Dr. Rafiqul Islam • 09:00 – 10:30 AM',
            style: TextStyle(
              fontSize: 13,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: 0.65,
              minHeight: 6,
              backgroundColor: colors.surface2,
              valueColor: AlwaysStoppedAnimation<Color>(colors.brand),
            ),
          ),
          const SizedBox(height: 6),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '32 min remaining',
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 11,
                color: colors.fgMuted,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: UcButton(
                  label: 'Scan Attendance QR',
                  icon: const Icon(Icons.qr_code_scanner, size: 18),
                  onPressed: () {
                    _showScanDialog(context, colors);
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              UcButton(
                label: 'Slides',
                icon: const Icon(Icons.description_outlined, size: 18),
                variant: UcButtonVariant.secondary,
                onPressed: () {
                  if (onNavigate != null) onNavigate!('/materials');
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
      {'icon': Icons.insights, 'label': 'Progress', 'route': '/student/progress'},
      {'icon': Icons.menu_book, 'label': 'Materials', 'route': '/materials'},
      {'icon': Icons.groups, 'label': 'Classmates', 'route': '/students'},
      {'icon': Icons.co_present, 'label': 'Faculty', 'route': '/teachers'},
      {'icon': Icons.badge, 'label': 'Digital ID', 'route': '/profile'},
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

  Widget _buildKpiBentoGrid(BuildContext context, AppColors colors) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 600;
        final crossAxisCount = isWide ? 4 : 2;

        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: AppSpacing.md,
          mainAxisSpacing: AppSpacing.md,
          childAspectRatio: isWide ? 0.95 : 1.05,
          children: [
            // KPI 1: CGPA
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              onTap: () {
                if (onNavigate != null) onNavigate!('/student/progress');
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Cumulative CGPA',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          '3.84',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                            fontFeatures: const [FontFeature.tabularFigures()],
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: UcBadge(
                            label: '+0.04',
                            variant: UcBadgeVariant.success,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'Dean\'s Honor Roll',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: colors.brand,
                    ),
                  ),
                ],
              ),
            ),

            // KPI 2: Attendance
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Attendance Rate',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          '94%',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                            fontFeatures: const [FontFeature.tabularFigures()],
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: UcBadge(
                            label: 'Safe >75%',
                            variant: UcBadgeVariant.success,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '38 of 40 Sessions',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 11, color: colors.fgMuted),
                  ),
                ],
              ),
            ),

            // KPI 3: Credits Completed
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Credits Earned',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  Text(
                    '98.5 / 144',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: 98.5 / 144.0,
                      minHeight: 4,
                      backgroundColor: colors.surface2,
                      valueColor: AlwaysStoppedAnimation<Color>(colors.brand),
                    ),
                  ),
                ],
              ),
            ),

            // KPI 4: Active Courses
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Current Courses',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  Text(
                    '6 Subjects',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  Text(
                    '19.5 Credit Hours',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 11, color: colors.fgMuted),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildTodayRoutineSection(BuildContext context, AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Today\'s Routine',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            GestureDetector(
              onTap: () {
                if (onNavigate != null) onNavigate!('/student/routine');
              },
              child: Text(
                'Full Schedule →',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: colors.brand,
                ),
              ),
            ),
          ],
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          slot.startTime,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                          ),
                        ),
                        Text(
                          slot.endTime,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: colors.fgMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 3,
                    height: 38,
                    decoration: BoxDecoration(
                      color: slot.isLab ? colors.warning : colors.brand,
                      borderRadius: BorderRadius.circular(1.5),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              slot.courseCode,
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: colors.brand,
                              ),
                            ),
                            if (slot.isLab) ...[
                              const SizedBox(width: 6),
                              UcBadge(label: 'LAB', variant: UcBadgeVariant.warning),
                            ],
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          slot.courseTitle,
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
                          '${slot.room} • ${slot.teacher}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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

  Widget _buildNoticesPreview(BuildContext context, AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Campus Notices',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            GestureDetector(
              onTap: () {
                if (onNavigate != null) onNavigate!('/student/notices');
              },
              child: Text(
                'View All →',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: colors.brand,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        ...MockData.notices.take(2).map((notice) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              onTap: () {
                if (onNavigate != null) onNavigate!('/student/notices');
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: UcBadge(
                            label: notice.category.toUpperCase(),
                            variant: notice.isUrgent
                                ? UcBadgeVariant.danger
                                : UcBadgeVariant.brand,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        notice.date,
                        style: TextStyle(fontSize: 11, color: colors.fgMuted),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    notice.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${notice.author} • ${notice.authorRole}',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildRecentMessagesSection(BuildContext context, AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Direct Messages',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            GestureDetector(
              onTap: () {
                if (onNavigate != null) onNavigate!('/messages');
              },
              child: Text(
                'Open Inbox →',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: colors.brand,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        UcCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: MockData.conversations.take(2).map((conv) {
              return ListTile(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ChatThreadScreen(
                        conversation: conv,
                      ),
                    ),
                  );
                },
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md, vertical: 4),
                leading: UcAvatar(
                  name: conv.peerName,
                  size: 44,
                  showOnlineDot: true,
                  isOnline: conv.isOnline,
                ),
                title: Text(
                  conv.peerName,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.fg,
                  ),
                ),
                subtitle: Text(
                  conv.lastMessage,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
                trailing: Text(
                  conv.timestamp,
                  style: TextStyle(fontSize: 11, color: colors.fgSubtle),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  void _showScanDialog(BuildContext context, AppColors colors) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: colors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        title: Text(
          'Dynamic Attendance Scanner',
          style: TextStyle(color: colors.fg, fontWeight: FontWeight.w700),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                color: colors.surface2,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: colors.line),
              ),
              child: Center(
                child: Icon(Icons.qr_code_2, size: 100, color: colors.brand),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Align the faculty dynamic QR code within frame. Refresh rate: 5s.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: colors.fgMuted),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Close', style: TextStyle(color: colors.brand)),
          ),
        ],
      ),
    );
  }
}
