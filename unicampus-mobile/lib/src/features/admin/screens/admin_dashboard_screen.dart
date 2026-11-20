import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class AdminDashboardScreen extends StatelessWidget {
  final ValueChanged<String>? onNavigate;

  const AdminDashboardScreen({super.key, this.onNavigate});

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
                  // Admin Welcome & Campus Meta
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Campus Command Overview',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: colors.fg,
                                letterSpacing: -0.4,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              'Dhaka City College Governance Console',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      UcBadge(
                        label: 'SUPERADMIN',
                        variant: UcBadgeVariant.brand,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // 1. Pending Approvals Triage Card
                  _buildPendingApprovalsCard(context, colors),

                  const SizedBox(height: AppSpacing.lg),

                  // 2. Quick Admin Action Strip
                  _buildQuickActionStrip(context, colors),

                  const SizedBox(height: AppSpacing.xl),

                  // 3. 2x2 Executive KPI Bento Grid
                  _buildExecutiveKpiGrid(context, colors),

                  const SizedBox(height: AppSpacing.xxl),

                  // 4. Department Enrollment & Health
                  _buildDepartmentHealthCard(context, colors),

                  const SizedBox(height: AppSpacing.xxxl),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPendingApprovalsCard(BuildContext context, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      backgroundColor: colors.dangerSoft,
      borderColor: colors.danger.withValues(alpha: 0.3),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: colors.danger,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.shield_outlined,
                color: Colors.white, size: 20),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '7 Pending Account Approvals',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: colors.danger,
                  ),
                ),
                Text(
                  '5 Students • 2 Faculty awaiting verification',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
              ],
            ),
          ),
          UcButton(
            label: 'Review',
            variant: UcButtonVariant.danger,
            height: 36,
            onPressed: () {
              if (onNavigate != null) onNavigate!('/admin/users');
            },
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionStrip(BuildContext context, AppColors colors) {
    final actions = [
      {'icon': Icons.campaign, 'label': 'Broadcast Notice', 'route': '/admin/notices'},
      {'icon': Icons.domain, 'label': 'Departments', 'route': '/admin/departments'},
      {'icon': Icons.calendar_today, 'label': 'Master Routine', 'route': '/admin/routine'},
      {'icon': Icons.account_balance, 'label': 'Treasury', 'route': '/admin/finance'},
      {'icon': Icons.analytics, 'label': 'Analytics', 'route': '/admin/analytics'},
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

  Widget _buildExecutiveKpiGrid(BuildContext context, AppColors colors) {
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
              Text('Total Students',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Text('3,420',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.fg)),
              Text('+4.2% YoY Growth',
                  style: TextStyle(fontSize: 11, color: colors.success)),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Active Faculty',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Text('148',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.fg)),
              Text('6 Departments',
                  style: TextStyle(fontSize: 11, color: colors.fgMuted)),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          onTap: () {
            if (onNavigate != null) onNavigate!('/admin/finance');
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Fee Collection Rate',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Text('89.4%',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.fg)),
              ClipRRect(
                borderRadius: BorderRadius.circular(2),
                child: LinearProgressIndicator(
                  value: 0.894,
                  minHeight: 4,
                  backgroundColor: colors.surface2,
                  valueColor: AlwaysStoppedAnimation<Color>(colors.success),
                ),
              ),
            ],
          ),
        ),
        UcCard(
          padding: const EdgeInsets.all(AppSpacing.md),
          onTap: () {
            if (onNavigate != null) onNavigate!('/admin/notices');
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Published Notices',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted)),
              Text('18 Active',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.fg)),
              Text('3 Pinned Globally',
                  style: TextStyle(fontSize: 11, color: colors.brand)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDepartmentHealthCard(BuildContext context, AppColors colors) {
    final depts = [
      {'code': 'CSE', 'name': 'Computer Science & Engineering', 'students': '1,240', 'attendance': '92%'},
      {'code': 'BBA', 'name': 'Bachelor of Business Administration', 'students': '980', 'attendance': '88%'},
      {'code': 'ENG', 'name': 'Department of English', 'students': '520', 'attendance': '86%'},
      {'code': 'ACC', 'name': 'Accounting & Finance', 'students': '680', 'attendance': '89%'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Department Enrollment & Attendance',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: colors.fg,
              ),
            ),
            GestureDetector(
              onTap: () {
                if (onNavigate != null) onNavigate!('/admin/departments');
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
        UcCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: depts.map((d) {
              return ListTile(
                leading: Container(
                  width: 44,
                  height: 34,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: colors.brandSoft,
                    borderRadius: BorderRadius.circular(AppRadius.xs),
                  ),
                  child: Text(
                    d['code']!,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: colors.brand,
                    ),
                  ),
                ),
                title: Text(
                  d['name']!,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.fg,
                  ),
                ),
                subtitle: Text(
                  '${d['students']} Enrolled Students',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
                trailing: Text(
                  d['attendance']!,
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: colors.success,
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
