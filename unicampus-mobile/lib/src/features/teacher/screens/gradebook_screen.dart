import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class GradebookScreen extends StatelessWidget {
  const GradebookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty Gradebook Studio'),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Distribution Summary
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'CSE-3101: Midterm & Lab Evaluation',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Class Average: 82.4% • Median: 85% • Highest: 98%',
                    style: TextStyle(fontSize: 12, color: colors.fgMuted),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildGradeMetric('A+', '14', colors.success),
                      _buildGradeMetric('A', '18', colors.brand),
                      _buildGradeMetric('B+', '12', colors.warning),
                      _buildGradeMetric('F', '2', colors.danger),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            Text(
              'Student Evaluations',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: colors.fg,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            UcCard(
              padding: EdgeInsets.zero,
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 4,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final students = [
                    {'name': 'Tanvir Hossain', 'roll': '2023-1-60-042', 'score': '92 / 100', 'grade': 'A+'},
                    {'name': 'Sadia Afrin', 'roll': '2023-1-60-015', 'score': '88 / 100', 'grade': 'A'},
                    {'name': 'Naimur Rahman', 'roll': '2023-1-60-022', 'score': '84 / 100', 'grade': 'A'},
                    {'name': 'Anika Tabassum', 'roll': '2023-1-60-038', 'score': '78 / 100', 'grade': 'B+'},
                  ];
                  final s = students[index];
                  return ListTile(
                    title: Text(s['name']!,
                        style: TextStyle(
                            fontWeight: FontWeight.w600, color: colors.fg)),
                    subtitle: Text(s['roll']!,
                        style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            color: colors.fgMuted)),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          s['score']!,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: colors.fg,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.md),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: colors.brandSoft,
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: Text(
                            s['grade']!,
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
                  );
                },
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            UcButton(
              label: 'Publish Grades to Student Portal',
              width: double.infinity,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Grades published officially')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGradeMetric(String label, String count, Color color) {
    return Column(
      children: [
        Text(label,
            style: TextStyle(
                fontSize: 14, fontWeight: FontWeight.w700, color: color)),
        const SizedBox(height: 2),
        Text('$count std',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
      ],
    );
  }
}
