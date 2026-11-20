import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class TeacherMaterialsScreen extends StatelessWidget {
  const TeacherMaterialsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty Course Materials Manager'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Upload New Lecture Material',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Supported files: PDF, PPTX, MP4, ZIP (Max 100 MB)',
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcButton(
                  label: 'Select File & Upload',
                  icon: const Icon(Icons.cloud_upload_outlined, size: 18),
                  width: double.infinity,
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('File upload dialog opened')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Your Published Materials',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ...MockData.materials.map((mat) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: UcCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  children: [
                    Icon(Icons.description, color: colors.brand, size: 30),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            mat.title,
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: colors.fg),
                          ),
                          Text(
                            '${mat.courseCode} • ${mat.fileSize} • ${mat.uploadDate}',
                            style: TextStyle(fontSize: 12, color: colors.fgMuted),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.red),
                      onPressed: () {},
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
