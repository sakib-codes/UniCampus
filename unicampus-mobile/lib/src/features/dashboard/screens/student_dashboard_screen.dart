import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_viewfinder_scanner.dart';
import '../../messages/screens/chat_thread_screen.dart';

class StudentDashboardScreen extends StatefulWidget {
  final ValueChanged<String>? onNavigate;

  const StudentDashboardScreen({super.key, this.onNavigate});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen>
    with SingleTickerProviderStateMixin {
  AnimationController? _radarController;
  Timer? _countdownTimer;
  int _secondsRemaining = 32 * 60; // 32 minutes default
  bool _hasLiveLecture = true;

  @override
  void initState() {
    super.initState();
    // Safety check: Avoid infinite animation/timer in test environments
    if (!UcAvatar.isTestMode && !UcViewfinderScanner.isTestMode) {
      _radarController = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 1400),
      )..repeat(reverse: true);

      _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (!mounted) return;
        setState(() {
          if (_secondsRemaining > 0) {
            _secondsRemaining--;
          } else {
            _hasLiveLecture = false;
            timer.cancel();
          }
        });
      });
    }
  }

  @override
  void dispose() {
    _radarController?.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return RefreshIndicator(
      color: colors.brand,
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 600));
        if (mounted) {
          setState(() {
            _secondsRemaining = 32 * 60;
            _hasLiveLecture = true;
          });
        }
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

                  // 1. Live Hero Card
                  _buildLiveHeroCard(context, colors),

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

  Widget _buildLiveHeroCard(BuildContext context, AppColors colors) {
    if (!_hasLiveLecture) {
      return _buildFallbackHeroCard(context, colors);
    }

    final minutes = _secondsRemaining ~/ 60;
    final progress = 1.0 - (_secondsRemaining / (90 * 60)).clamp(0.0, 1.0);

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
                  _buildRadarPulsingDot(colors),
                  const SizedBox(width: 8),
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
              value: progress.clamp(0.1, 1.0),
              minHeight: 6,
              backgroundColor: colors.surface2,
              valueColor: AlwaysStoppedAnimation<Color>(colors.brand),
            ),
          ),
          const SizedBox(height: 6),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '$minutes min remaining',
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 11,
                color: colors.fgMuted,
                fontFeatures: const [FontFeature.tabularFigures()],
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
                    _openAttendanceScanner(context, colors);
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              UcButton(
                label: 'Slides',
                icon: const Icon(Icons.description_outlined, size: 18),
                variant: UcButtonVariant.secondary,
                onPressed: () {
                  if (widget.onNavigate != null) {
                    widget.onNavigate!('/materials');
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFallbackHeroCard(BuildContext context, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      borderRadius: AppRadius.xl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: colors.brandSoft,
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.schedule, size: 13, color: colors.brand),
                    const SizedBox(width: 5),
                    Text(
                      'NEXT UP',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: colors.brand,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                'Starts at 11:45 AM',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: colors.fgMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'Software Engineering & Design Patterns',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: colors.fg,
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Room 301 • Prof. Kamrul Islam • 11:45 AM – 01:15 PM',
            style: TextStyle(
              fontSize: 13,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: UcButton(
                  label: 'View Course Syllabus',
                  icon: const Icon(Icons.auto_stories_outlined, size: 18),
                  variant: UcButtonVariant.secondary,
                  onPressed: () {
                    if (widget.onNavigate != null) {
                      widget.onNavigate!('/student/routine');
                    }
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              UcButton(
                label: 'Materials',
                icon: const Icon(Icons.folder_open, size: 18),
                variant: UcButtonVariant.secondary,
                onPressed: () {
                  if (widget.onNavigate != null) {
                    widget.onNavigate!('/materials');
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRadarPulsingDot(AppColors colors) {
    if (_radarController == null) {
      return Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          color: colors.success,
          shape: BoxShape.circle,
        ),
      );
    }

    return AnimatedBuilder(
      animation: _radarController!,
      builder: (context, child) {
        final scale = 1.0 + (_radarController!.value * 0.6);
        final alpha = (0.5 * (1.0 - _radarController!.value)).clamp(0.0, 1.0);
        return SizedBox(
          width: 16,
          height: 16,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Transform.scale(
                scale: scale,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: colors.success.withValues(alpha: alpha),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: colors.success,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _openAttendanceScanner(BuildContext context, AppColors colors) {
    AppHaptics.selection();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Scaffold(
        backgroundColor: Colors.transparent,
        body: UcViewfinderScanner(
          title: 'Scan Attendance QR',
          subtitle: 'Align the faculty dynamic QR code within the frame',
          onClose: () => Navigator.pop(ctx),
          onScanned: (payload) {
            Navigator.pop(ctx);
            _showAttendanceConfirmedSheet(context, colors, payload);
          },
        ),
      ),
    );
  }

  void _showAttendanceConfirmedSheet(
      BuildContext context, AppColors colors, String payload) {
    AppHaptics.success();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
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
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: colors.successSoft,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check_circle_rounded,
                    size: 38,
                    color: colors.success,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Attendance Confirmed!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Your presence has been securely verified for today\'s session.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcCard(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Column(
                    children: [
                      _buildDetailRow('Course', 'Distributed Systems (CSE-3101)', colors),
                      const SizedBox(height: 10),
                      _buildDetailRow('Instructor', 'Dr. Rafiqul Islam', colors),
                      const SizedBox(height: 10),
                      _buildDetailRow('Time & Room', '09:00 – 10:30 AM • Room 502', colors),
                      const SizedBox(height: 10),
                      _buildDetailRow('Token Reference', payload, colors, isMono: true),
                      const SizedBox(height: 10),
                      _buildDetailRow('Check-in Status', 'PRESENT (Verified)', colors,
                          isHighlight: true),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                UcButton(
                  label: 'Done',
                  width: double.infinity,
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value, AppColors colors,
      {bool isMono = false, bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 12, color: colors.fgMuted),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontFamily: isMono ? 'monospace' : null,
              fontSize: 12,
              fontWeight: isHighlight ? FontWeight.w700 : FontWeight.w600,
              color: isHighlight ? colors.success : colors.fg,
            ),
          ),
        ),
      ],
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
        separatorBuilder: (context, index) =>
            const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, index) {
          final item = actions[index];
          return Material(
            color: colors.surface2,
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: InkWell(
              borderRadius: BorderRadius.circular(AppRadius.md),
              onTap: () {
                if (widget.onNavigate != null) {
                  widget.onNavigate!(item['route'] as String);
                }
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
                    Icon(item['icon'] as IconData,
                        size: 16, color: colors.brand),
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
                if (widget.onNavigate != null) {
                  widget.onNavigate!('/student/progress');
                }
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
                if (widget.onNavigate != null) {
                  widget.onNavigate!('/student/routine');
                }
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
                              UcBadge(
                                  label: 'LAB',
                                  variant: UcBadgeVariant.warning),
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
                if (widget.onNavigate != null) {
                  widget.onNavigate!('/notices');
                }
              },
              child: Text(
                'See All →',
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
                if (widget.onNavigate != null) {
                  widget.onNavigate!('/notices');
                }
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Wrap(
                          spacing: 6,
                          runSpacing: 4,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            UcBadge(
                              label: notice.category.toUpperCase(),
                              variant: notice.isUrgent
                                  ? UcBadgeVariant.danger
                                  : UcBadgeVariant.brand,
                            ),
                            if (notice.isPinned)
                              UcBadge(
                                label: 'PINNED',
                                variant: UcBadgeVariant.neutral,
                                icon: Icons.push_pin,
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        notice.date,
                        style: TextStyle(fontSize: 11, color: colors.fgSubtle),
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
                    '${notice.author} • Academic Office',
                    style: TextStyle(fontSize: 11, color: colors.fgMuted),
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
                'Recent Conversations',
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
                if (widget.onNavigate != null) {
                  widget.onNavigate!('/messages');
                }
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
}
