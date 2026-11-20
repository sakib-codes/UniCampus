import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class AdminNoticesScreen extends StatelessWidget {
  const AdminNoticesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Campus Broadcast Manager'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Create Official Campus Circular',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextField(
                    decoration: InputDecoration(
                      labelText: 'Notice Title',
                      hintText: 'e.g. Winter Vacation & Semester Break Schedule',
                      filled: true,
                      fillColor: colors.surface2,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextField(
                    maxLines: 5,
                    decoration: InputDecoration(
                      labelText: 'Notice Content',
                      hintText: 'Enter full text...',
                      filled: true,
                      fillColor: colors.surface2,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  UcButton(
                    label: 'Publish to Entire Campus',
                    icon: const Icon(Icons.broadcast_on_personal, size: 18),
                    width: double.infinity,
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Notice broadcasted to all 3,420 students and faculty')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
