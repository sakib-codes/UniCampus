import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class AdminDepartmentsScreen extends StatelessWidget {
  const AdminDepartmentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    final departments = [
      {'code': 'CSE', 'name': 'Computer Science & Engineering', 'head': 'Dr. Rafiqul Islam', 'students': '1,240', 'faculty': '42'},
      {'code': 'BBA', 'name': 'Business Administration', 'head': 'Prof. M. A. Jalil', 'students': '980', 'faculty': '34'},
      {'code': 'ENG', 'name': 'English Language & Literature', 'head': 'Dr. Selina Hossain', 'students': '520', 'faculty': '20'},
      {'code': 'ACC', 'name': 'Accounting & Information Systems', 'head': 'Dr. K. M. Hasan', 'students': '680', 'faculty': '26'},
    ];

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Academic Departments'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Department Governance',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
              UcButton(
                label: '+ Add Department',
                height: 36,
                onPressed: () {},
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          ...departments.map((d) {
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
                          '${d['code']} — ${d['name']}',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: colors.brandSoft,
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: Text(
                            'Active',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: colors.brand,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Department Head: ${d['head']}',
                      style: TextStyle(fontSize: 13, color: colors.fgMuted),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    const Divider(),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('${d['students']} Enrolled Students',
                            style: TextStyle(fontSize: 12, color: colors.fg)),
                        Text('${d['faculty']} Faculty Members',
                            style: TextStyle(fontSize: 12, color: colors.fg)),
                      ],
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
