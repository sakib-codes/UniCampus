import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class AttendanceHubScreen extends StatefulWidget {
  const AttendanceHubScreen({super.key});

  @override
  State<AttendanceHubScreen> createState() => _AttendanceHubScreenState();
}

class _AttendanceHubScreenState extends State<AttendanceHubScreen> {
  bool _isGeneratingQr = true;
  final int _presentCount = 42;
  final int _totalStudents = 48;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty Attendance Hub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            // Session Selector Card
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'ACTIVE COURSE SESSION',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: colors.brand,
                          letterSpacing: 0.5,
                        ),
                      ),
                      UcBadge(label: 'LIVE', variant: UcBadgeVariant.success),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'CSE-3101: Distributed Systems',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  Text(
                    'Room 502 • Section A • Lecture 18',
                    style: TextStyle(fontSize: 13, color: colors.fgMuted),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() => _isGeneratingQr = true);
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor:
                                _isGeneratingQr ? colors.brandSoft : null,
                            side: BorderSide(
                              color: _isGeneratingQr ? colors.brand : colors.line,
                            ),
                          ),
                          child: Text(
                            'Dynamic QR Hub',
                            style: TextStyle(
                              color: _isGeneratingQr ? colors.brand : colors.fg,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() => _isGeneratingQr = false);
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor:
                                !_isGeneratingQr ? colors.brandSoft : null,
                            side: BorderSide(
                              color: !_isGeneratingQr ? colors.brand : colors.line,
                            ),
                          ),
                          child: Text(
                            'Manual Roll-Call',
                            style: TextStyle(
                              color: !_isGeneratingQr ? colors.brand : colors.fg,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            if (_isGeneratingQr) ...[
              // QR Hub Display
              UcCard(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        border: Border.all(color: colors.line, width: 2),
                      ),
                      child: const Icon(
                        Icons.qr_code_2,
                        size: 200,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.refresh, size: 16, color: colors.brand),
                        const SizedBox(width: 6),
                        Text(
                          'Refreshing token every 5 seconds',
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: colors.brand,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    Text(
                      '$_presentCount of $_totalStudents Verified Present',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                      ),
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(3),
                      child: LinearProgressIndicator(
                        value: _presentCount / _totalStudents,
                        minHeight: 6,
                        backgroundColor: colors.surface2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(colors.success),
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Manual Roster List
              UcCard(
                padding: EdgeInsets.zero,
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: 5,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final names = [
                      'Tanvir Hossain',
                      'Sadia Afrin',
                      'Naimur Rahman',
                      'Anika Tabassum',
                      'Mahir Faisal'
                    ];
                    final rolls = [
                      '2023-1-60-042',
                      '2023-1-60-015',
                      '2023-1-60-022',
                      '2023-1-60-038',
                      '2023-1-60-050'
                    ];
                    return ListTile(
                      title: Text(names[index],
                          style: TextStyle(
                              fontWeight: FontWeight.w600, color: colors.fg)),
                      subtitle: Text(rolls[index],
                          style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 12,
                              color: colors.fgMuted)),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.check_circle,
                                color: Colors.green),
                            onPressed: () {},
                          ),
                          IconButton(
                            icon: const Icon(Icons.cancel, color: Colors.red),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
            const SizedBox(height: AppSpacing.lg),
            UcButton(
              label: 'Finalize & Save Roll-Call',
              icon: const Icon(Icons.save, size: 18),
              width: double.infinity,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Attendance session saved to cloud')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
