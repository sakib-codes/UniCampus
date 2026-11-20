import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_card.dart';

class AdminFinanceScreen extends StatelessWidget {
  const AdminFinanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Campus Treasury & Finance'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            borderRadius: AppRadius.xl,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Total Tuition Revenue (Fall 2026)',
                    style: TextStyle(fontSize: 13, color: colors.fgMuted)),
                const SizedBox(height: 4),
                Text(
                  '৳ 42,850,000 BDT',
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: colors.fg,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Cleared: ৳ 38.3M (89.4%)',
                        style: TextStyle(fontSize: 12, color: colors.success, fontWeight: FontWeight.w600)),
                    Text('Outstanding: ৳ 4.5M',
                        style: TextStyle(fontSize: 12, color: colors.danger, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Recent Digital Gateway Transactions',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ...[
            {'id': 'TXN-902184', 'student': 'Tanvir Hossain (2023-1-60-042)', 'amount': '৳ 28,500', 'method': 'bKash Gateway'},
            {'id': 'TXN-902183', 'student': 'Sadia Afrin (2023-1-60-015)', 'amount': '৳ 28,500', 'method': 'Nagad Direct'},
            {'id': 'TXN-902182', 'student': 'Naimur Rahman (2023-1-60-022)', 'amount': '৳ 28,500', 'method': 'City Bank Transfer'},
          ].map((txn) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: UcCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(txn['student']!,
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: colors.fg)),
                        Text('${txn['id']} • ${txn['method']}',
                            style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: colors.fgMuted)),
                      ],
                    ),
                    Text(txn['amount']!,
                        style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: colors.success)),
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
