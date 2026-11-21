import 'dart:math';
import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  int _selectedSplineIndex = 4; // Sem 5 selected by default

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Academic Progress & Degree Audit'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calculate_outlined),
            tooltip: 'GPA Simulator',
            onPressed: () => _showGpaSimulator(context, colors),
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. CGPA 240° Radial Gauge & Degree Progress Card
                  _buildCgpaGaugeCard(context, colors),

                  const SizedBox(height: AppSpacing.lg),

                  // 2. SGPA Trend Spline Chart Card
                  _buildSgpaTrajectoryCard(context, colors),

                  const SizedBox(height: AppSpacing.xl),

                  // 3. Semester History & Courses Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Semester History & Courses',
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
                      Flexible(
                        child: Text(
                          '5 Semesters Completed',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: colors.fgMuted,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // Semester list items
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
                                Expanded(
                                  child: Text(
                                    semester.semester,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: colors.fg,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.sm),
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
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
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

  Widget _buildCgpaGaugeCard(BuildContext context, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.xl),
      borderRadius: AppRadius.xl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Cumulative GPA',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: colors.fgMuted,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              UcBadge(
                label: 'HONORS STANDING',
                variant: UcBadgeVariant.brand,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // 240° Radial Gauge
          SizedBox(
            width: 220,
            height: 150,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CustomPaint(
                  size: const Size(220, 150),
                  painter: _CgpaRadialGaugePainter(
                    cgpa: 3.84,
                    maxGpa: 4.0,
                    trackColor: colors.surface2,
                    activeColor: colors.brand,
                  ),
                ),
                Positioned(
                  bottom: 12,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
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
                          const SizedBox(width: 4),
                          Text(
                            '/ 4.00',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: colors.fgMuted,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'Cumulative CGPA',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: colors.fgMuted,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(),
          const SizedBox(height: AppSpacing.md),

          // 3-Segment Degree Credit Progress Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Degree Completion',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: colors.fg,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Flexible(
                child: Text(
                  '98.5 of 144 Credits (68.4%)',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
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
          const SizedBox(height: 8),

          // Segmented Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: SizedBox(
              height: 10,
              child: Row(
                children: [
                  Expanded(
                    flex: 985,
                    child: Container(color: colors.brand),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: 150,
                    child: Container(color: colors.warning),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: 305,
                    child: Container(color: colors.surface2),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Legend Row
          Wrap(
            spacing: 12,
            runSpacing: 4,
            children: [
              _buildLegendDot(colors.brand, 'Completed 98.5 Cr', colors),
              _buildLegendDot(colors.warning, 'Active 15.0 Cr', colors),
              _buildLegendDot(colors.fgSubtle, 'Remaining 30.5 Cr', colors),
            ],
          ),

          const SizedBox(height: AppSpacing.lg),
          UcButton(
            label: 'Simulate Next Semester GPA',
            icon: const Icon(Icons.calculate_outlined, size: 18),
            variant: UcButtonVariant.secondary,
            width: double.infinity,
            onPressed: () => _showGpaSimulator(context, colors),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendDot(Color dotColor, String label, AppColors colors) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: dotColor,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: colors.fgMuted,
          ),
        ),
      ],
    );
  }

  Widget _buildSgpaTrajectoryCard(BuildContext context, AppColors colors) {
    final trajectoryData = const [
      _SgpaPoint('Sem 1', 3.75, 19.5),
      _SgpaPoint('Sem 2', 3.80, 20.0),
      _SgpaPoint('Sem 3', 3.78, 19.5),
      _SgpaPoint('Sem 4', 3.85, 20.0),
      _SgpaPoint('Sem 5', 3.88, 19.5),
    ];

    final currentPoint = trajectoryData[_selectedSplineIndex];

    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      borderRadius: AppRadius.xl,
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
                      'SGPA Trajectory',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Semester-wise Grade Point Trend',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12, color: colors.fgMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: colors.successSoft,
                  borderRadius: BorderRadius.circular(AppRadius.pill),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.trending_up, size: 14, color: colors.success),
                    const SizedBox(width: 4),
                    Text(
                      'Peak: 3.88',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: colors.success,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Interactive Tooltip indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: colors.surface2,
              borderRadius: BorderRadius.circular(AppRadius.sm),
              border: Border.all(color: colors.line),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.touch_app_outlined, size: 13, color: colors.brand),
                const SizedBox(width: 5),
                Flexible(
                  child: Text(
                    '${currentPoint.semester} • SGPA ${currentPoint.sgpa.toStringAsFixed(2)} • ${currentPoint.credits} Credits',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: colors.fg,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Spline Chart
          SizedBox(
            height: 150,
            width: double.infinity,
            child: GestureDetector(
              onTapUp: (details) {
                final width = MediaQuery.of(context).size.width - 64;
                final tapX = details.localPosition.dx;
                final segment = width / (trajectoryData.length - 1);
                final index = (tapX / segment).round().clamp(0, trajectoryData.length - 1);
                AppHaptics.selection();
                setState(() => _selectedSplineIndex = index);
              },
              child: CustomPaint(
                painter: _SgpaSplineChartPainter(
                  points: trajectoryData,
                  selectedIndex: _selectedSplineIndex,
                  lineColor: colors.brand,
                  gridColor: colors.line,
                  textColor: colors.fgMuted,
                ),
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
      isScrollControlled: true,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return _GpaSimulatorSheetContent(colors: colors);
      },
    );
  }
}

class _SgpaPoint {
  final String semester;
  final double sgpa;
  final double credits;

  const _SgpaPoint(this.semester, this.sgpa, this.credits);
}

class _CgpaRadialGaugePainter extends CustomPainter {
  final double cgpa;
  final double maxGpa;
  final Color trackColor;
  final Color activeColor;

  _CgpaRadialGaugePainter({
    required this.cgpa,
    required this.maxGpa,
    required this.trackColor,
    required this.activeColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.85);
    final radius = size.width * 0.42;
    const strokeWidth = 14.0;

    // 240 degrees arc: 150 deg to 390 deg
    const startAngle = 150 * (pi / 180.0);
    const totalSweep = 240 * (pi / 180.0);

    // Track
    final trackPaint = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      totalSweep,
      false,
      trackPaint,
    );

    // Active sweep
    final activeSweep = totalSweep * (cgpa / maxGpa).clamp(0.0, 1.0);
    final activePaint = Paint()
      ..color = activeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      activeSweep,
      false,
      activePaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CgpaRadialGaugePainter oldDelegate) {
    return oldDelegate.cgpa != cgpa ||
        oldDelegate.trackColor != trackColor ||
        oldDelegate.activeColor != activeColor;
  }
}

class _SgpaSplineChartPainter extends CustomPainter {
  final List<_SgpaPoint> points;
  final int selectedIndex;
  final Color lineColor;
  final Color gridColor;
  final Color textColor;

  _SgpaSplineChartPainter({
    required this.points,
    required this.selectedIndex,
    required this.lineColor,
    required this.gridColor,
    required this.textColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    const topPad = 15.0;
    const bottomPad = 25.0;
    final chartHeight = size.height - topPad - bottomPad;
    final width = size.width;

    const minGpa = 3.0;
    const maxGpa = 4.0;

    // Horizontal Grid Lines
    final gridPaint = Paint()
      ..color = gridColor
      ..strokeWidth = 1.0;

    for (double g = 3.0; g <= 4.0; g += 0.5) {
      final y = topPad + chartHeight * (1.0 - (g - minGpa) / (maxGpa - minGpa));
      canvas.drawLine(Offset(0, y), Offset(width, y), gridPaint);
    }

    // Calculate node coordinates
    final nodeCoords = <Offset>[];
    for (int i = 0; i < points.length; i++) {
      final x = (i / (points.length - 1)) * width;
      final y = topPad +
          chartHeight *
              (1.0 - (points[i].sgpa - minGpa) / (maxGpa - minGpa));
      nodeCoords.add(Offset(x, y));
    }

    // Build Cubic Bezier Path
    final path = Path();
    path.moveTo(nodeCoords.first.dx, nodeCoords.first.dy);

    for (int i = 0; i < nodeCoords.length - 1; i++) {
      final p0 = nodeCoords[i];
      final p1 = nodeCoords[i + 1];
      final controlX = (p0.dx + p1.dx) / 2;
      path.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
    }

    // Fill Gradient under spline
    final fillPath = Path.from(path)
      ..lineTo(nodeCoords.last.dx, size.height - bottomPad)
      ..lineTo(nodeCoords.first.dx, size.height - bottomPad)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          lineColor.withValues(alpha: 0.22),
          lineColor.withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromLTWH(0, topPad, width, chartHeight));

    canvas.drawPath(fillPath, fillPaint);

    // Stroke spline
    final strokePaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, strokePaint);

    // Draw Nodes and Labels
    final textPainter = TextPainter(textDirection: TextDirection.ltr);

    for (int i = 0; i < nodeCoords.length; i++) {
      final node = nodeCoords[i];
      final isSel = i == selectedIndex;

      // Draw node circle
      if (isSel) {
        canvas.drawCircle(
            node, 6.0, Paint()..color = lineColor.withValues(alpha: 0.3));
        canvas.drawCircle(node, 4.0, Paint()..color = lineColor);
      } else {
        canvas.drawCircle(node, 3.5, Paint()..color = lineColor);
      }

      // Draw Semester Label below
      textPainter.text = TextSpan(
        text: points[i].semester,
        style: TextStyle(
          fontSize: 10,
          fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
          color: isSel ? lineColor : textColor,
        ),
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(node.dx - textPainter.width / 2, size.height - 18),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SgpaSplineChartPainter oldDelegate) {
    return oldDelegate.selectedIndex != selectedIndex ||
        oldDelegate.lineColor != lineColor;
  }
}

class _SimulatedCourse {
  final String code;
  final String title;
  final double credits;
  double gradePoint;

  _SimulatedCourse({
    required this.code,
    required this.title,
    required this.credits,
    required this.gradePoint,
  });
}

class _GpaSimulatorSheetContent extends StatefulWidget {
  final AppColors colors;

  const _GpaSimulatorSheetContent({required this.colors});

  @override
  State<_GpaSimulatorSheetContent> createState() =>
      _GpaSimulatorSheetContentState();
}

class _GpaSimulatorSheetContentState extends State<_GpaSimulatorSheetContent> {
  final double _priorCompletedCredits = 98.5;
  final double _priorCgpa = 3.84;

  late final List<_SimulatedCourse> _courses;

  @override
  void initState() {
    super.initState();
    _courses = [
      _SimulatedCourse(
          code: 'CSE-3101', title: 'Distributed Systems', credits: 3.0, gradePoint: 4.00),
      _SimulatedCourse(
          code: 'CSE-3102', title: 'Database Systems', credits: 3.0, gradePoint: 3.75),
      _SimulatedCourse(
          code: 'CSE-3205', title: 'Software Engineering', credits: 3.0, gradePoint: 3.50),
      _SimulatedCourse(
          code: 'CSE-3103', title: 'Algorithm Theory', credits: 3.0, gradePoint: 4.00),
      _SimulatedCourse(
          code: 'CSE-3104', title: 'Operating Systems Lab', credits: 1.5, gradePoint: 3.75),
    ];
  }

  double get _projectedSgpa {
    final totalCredits = _courses.fold(0.0, (sum, c) => sum + c.credits);
    final totalQualityPoints =
        _courses.fold(0.0, (sum, c) => sum + (c.credits * c.gradePoint));
    return totalCredits > 0 ? totalQualityPoints / totalCredits : 0.0;
  }

  double get _projectedCgpa {
    final priorQualityPoints = _priorCompletedCredits * _priorCgpa;
    final newQualityPoints =
        _courses.fold(0.0, (sum, c) => sum + (c.credits * c.gradePoint));
    final newCredits = _courses.fold(0.0, (sum, c) => sum + c.credits);
    return (priorQualityPoints + newQualityPoints) /
        (_priorCompletedCredits + newCredits);
  }

  @override
  Widget build(BuildContext context) {
    final colors = widget.colors;
    final projectedCgpa = _projectedCgpa;
    final projectedSgpa = _projectedSgpa;
    final delta = projectedCgpa - _priorCgpa;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: SingleChildScrollView(
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
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Adjust planned course grades to predict your future semester and cumulative CGPA.',
                style: TextStyle(fontSize: 13, color: colors.fgMuted),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Live Recalculated Summary Card
              UcCard(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            'Projected SGPA',
                            style: TextStyle(fontSize: 12, color: colors.fgMuted),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            projectedSgpa.toStringAsFixed(2),
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: colors.fg,
                            ),
                          ),
                          Text(
                            'Semester 6',
                            style: TextStyle(fontSize: 11, color: colors.fgSubtle),
                          ),
                        ],
                      ),
                    ),
                    Container(width: 1, height: 44, color: colors.line),
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            'Projected CGPA',
                            style: TextStyle(fontSize: 12, color: colors.fgMuted),
                          ),
                          const SizedBox(height: 4),
                          Wrap(
                            alignment: WrapAlignment.center,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 6,
                            children: [
                              Text(
                                projectedCgpa.toStringAsFixed(2),
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 22,
                                  fontWeight: FontWeight.w800,
                                  color: colors.brand,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: delta >= 0
                                      ? colors.successSoft
                                      : colors.dangerSoft,
                                  borderRadius:
                                      BorderRadius.circular(AppRadius.xs),
                                ),
                                child: Text(
                                  '${delta >= 0 ? '+' : ''}${delta.toStringAsFixed(2)}',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: delta >= 0
                                        ? colors.success
                                        : colors.danger,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Text(
                            'Current: 3.84',
                            style: TextStyle(fontSize: 11, color: colors.fgSubtle),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              Text(
                'Enrolled Semester Courses (13.5 Cr)',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Course Grade Steppers
              ..._courses.map((course) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: colors.surface2,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(color: colors.line),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '${course.code} • ${course.title}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: colors.fg,
                                ),
                              ),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Text(
                              '${course.credits} Cr',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          children: [
                            _buildGradeOption('A+ (4.0)', 4.0, course, colors),
                            _buildGradeOption('A (3.75)', 3.75, course, colors),
                            _buildGradeOption('A- (3.5)', 3.50, course, colors),
                            _buildGradeOption('B+ (3.25)', 3.25, course, colors),
                            _buildGradeOption('B (3.0)', 3.00, course, colors),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: UcButton(
                      label: 'Reset to Actual',
                      variant: UcButtonVariant.secondary,
                      onPressed: () {
                        setState(() {
                          _courses[0].gradePoint = 4.00;
                          _courses[1].gradePoint = 3.75;
                          _courses[2].gradePoint = 3.50;
                          _courses[3].gradePoint = 4.00;
                          _courses[4].gradePoint = 3.75;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: UcButton(
                      label: 'Done',
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGradeOption(String label, double gradePoint,
      _SimulatedCourse course, AppColors colors) {
    final isSelected = course.gradePoint == gradePoint;
    return GestureDetector(
      onTap: () {
        AppHaptics.selection();
        setState(() => course.gradePoint = gradePoint);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? colors.brand : colors.surface,
          borderRadius: BorderRadius.circular(AppRadius.xs),
          border: Border.all(
            color: isSelected ? colors.brand : colors.line,
            width: 1.0,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? Colors.white : colors.fg,
          ),
        ),
      ),
    );
  }
}
