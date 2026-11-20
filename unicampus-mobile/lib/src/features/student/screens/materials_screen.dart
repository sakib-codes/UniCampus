import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';
import '../../../widgets/common/uc_search_input.dart';

class MaterialsScreen extends StatefulWidget {
  const MaterialsScreen({super.key});

  @override
  State<MaterialsScreen> createState() => _MaterialsScreenState();
}

class _MaterialsScreenState extends State<MaterialsScreen> {
  int _selectedFilter = 0;
  final List<String> _filters = ['All Courses', 'CSE-3101', 'CSE-3103', 'CSE-3105'];

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Course Materials & Vault'),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_done_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: const UcSearchInput(
                    hintText: 'Search slides, lab sheets, notes...',
                  ),
                ),
                UcChipBar(
                  chips: _filters,
                  selectedIndex: _selectedFilter,
                  onSelected: (idx) => setState(() => _selectedFilter = idx),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final mat = MockData.materials[index % MockData.materials.length];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: UcCard(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: mat.fileType == 'PDF'
                                  ? colors.dangerSoft
                                  : colors.brandSoft,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                            ),
                            child: Icon(
                              mat.fileType == 'PDF'
                                  ? Icons.picture_as_pdf
                                  : Icons.slideshow,
                              color: mat.fileType == 'PDF'
                                  ? colors.danger
                                  : colors.brand,
                              size: 24,
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
                                      mat.courseCode,
                                      style: TextStyle(
                                        fontFamily: 'monospace',
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: colors.brand,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    UcBadge(
                                      label: mat.fileType,
                                      variant: UcBadgeVariant.neutral,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  mat.title,
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
                                  '${mat.uploadedBy} • ${mat.fileSize}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: colors.fgMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.cloud_download_outlined,
                                color: colors.brand),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content: Text('Downloading ${mat.title}...')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
                childCount: MockData.materials.length * 2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
