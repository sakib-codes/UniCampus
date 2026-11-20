import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';
import '../../../widgets/common/uc_search_input.dart';

class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  int _selectedFilter = 0;
  final List<String> _filters = ['All Users', 'Pending Approvals', 'Students', 'Faculty'];

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Campus User Accounts & Roles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt_1_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: const UcSearchInput(hintText: 'Search users by name, roll, or email...'),
          ),
          UcChipBar(
            chips: _filters,
            selectedIndex: _selectedFilter,
            onSelected: (idx) => setState(() => _selectedFilter = idx),
          ),
          const SizedBox(height: AppSpacing.md),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: 4,
              separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, index) {
                final users = [
                  {'name': 'Sadia Afrin', 'id': '2023-1-60-015', 'role': 'STUDENT', 'dept': 'CSE', 'status': 'ACTIVE'},
                  {'name': 'Tanvir Ahmed', 'id': 'T-CSE-109', 'role': 'FACULTY', 'dept': 'CSE', 'status': 'PENDING'},
                  {'name': 'Naimur Rahman', 'id': '2023-1-60-022', 'role': 'STUDENT', 'dept': 'CSE', 'status': 'ACTIVE'},
                  {'name': 'Farhana Yeasmin', 'id': '2023-2-20-008', 'role': 'STUDENT', 'dept': 'BBA', 'status': 'PENDING'},
                ];
                final u = users[index];
                final isPending = u['status'] == 'PENDING';

                return UcCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 22,
                        backgroundColor: colors.surface2,
                        child: Text(
                          u['name']![0],
                          style: TextStyle(
                              fontWeight: FontWeight.w700, color: colors.brand),
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
                                  u['name']!,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: colors.fg,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                UcBadge(
                                  label: u['status']!,
                                  variant: isPending
                                      ? UcBadgeVariant.warning
                                      : UcBadgeVariant.success,
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${u['id']} • ${u['dept']} • ${u['role']}',
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isPending)
                        UcButton(
                          label: 'Approve',
                          variant: UcButtonVariant.primary,
                          height: 32,
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Approved ${u['name']}')),
                            );
                          },
                        )
                      else
                        IconButton(
                          icon: Icon(Icons.more_vert, color: colors.fgMuted),
                          onPressed: () {},
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
