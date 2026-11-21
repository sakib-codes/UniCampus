import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';

class MaterialsScreen extends StatefulWidget {
  const MaterialsScreen({super.key});

  @override
  State<MaterialsScreen> createState() => _MaterialsScreenState();
}

class _MaterialsScreenState extends State<MaterialsScreen> {
  int _selectedCourseFilter = 0;
  final List<String> _courseFilters = [
    'All Courses',
    'CSE-3101',
    'CSE-3103',
    'CSE-3105',
  ];

  int _selectedTypeFilter = 0;
  final List<String> _typeFilters = [
    'All Types',
    'PDF',
    'SLIDES',
    'ZIP',
    'CODE',
  ];

  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    final query = _searchQuery.toLowerCase().trim();
    final allMaterials = [
      ...MockData.materials,
      // Supplemental realistic items for comprehensive vault
      const CourseMaterial(
        id: 'mat_04',
        title: 'B-Tree Indexing Implementation in C++ with Buffer Pool',
        courseCode: 'CSE-3101',
        courseTitle: 'Distributed Systems',
        fileType: 'CODE',
        fileSize: '320 KB',
        uploadedBy: 'Dr. Rafiqul Islam',
        uploadDate: 'Nov 12, 2026',
      ),
      const CourseMaterial(
        id: 'mat_05',
        title: 'Network Socket Programming Lab Manual & Wireshark Pcap',
        courseCode: 'CSE-3105',
        courseTitle: 'Computer Networks',
        fileType: 'ZIP',
        fileSize: '8.4 MB',
        uploadedBy: 'Asst. Prof. Kamrul Hasan',
        uploadDate: 'Nov 10, 2026',
      ),
    ];

    final filtered = allMaterials.where((mat) {
      final matchesCourse = _selectedCourseFilter == 0 ||
          mat.courseCode == _courseFilters[_selectedCourseFilter];
      final matchesType = _selectedTypeFilter == 0 ||
          mat.fileType.toUpperCase() ==
              _typeFilters[_selectedTypeFilter].toUpperCase();
      final matchesQuery = query.isEmpty ||
          mat.title.toLowerCase().contains(query) ||
          mat.courseCode.toLowerCase().contains(query) ||
          mat.uploadedBy.toLowerCase().contains(query);

      return matchesCourse && matchesType && matchesQuery;
    }).toList();

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Course Materials & Vault'),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_done_outlined),
            tooltip: 'Downloaded Files',
            onPressed: () {
              AppHaptics.light();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Offline vault has 3 cached files (27.4 MB)')),
              );
            },
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Input
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: colors.surface2,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(color: colors.line, width: 1.0),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) => setState(() => _searchQuery = val),
                      style: TextStyle(fontSize: 14, color: colors.fg),
                      decoration: InputDecoration(
                        hintText: 'Search slides, lab sheets, notes, code...',
                        hintStyle: TextStyle(fontSize: 13, color: colors.fgMuted),
                        prefixIcon: Icon(Icons.search, size: 20, color: colors.fgMuted),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 18),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() => _searchQuery = '');
                                },
                              )
                            : null,
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ),

                // Course Filter Rail
                UcChipBar(
                  chips: _courseFilters,
                  selectedIndex: _selectedCourseFilter,
                  onSelected: (idx) {
                    AppHaptics.selection();
                    setState(() => _selectedCourseFilter = idx);
                  },
                ),
                const SizedBox(height: AppSpacing.sm),

                // File Type Filter Rail
                UcChipBar(
                  chips: _typeFilters,
                  selectedIndex: _selectedTypeFilter,
                  onSelected: (idx) {
                    AppHaptics.selection();
                    setState(() => _selectedTypeFilter = idx);
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Vault count header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Available Resources (${filtered.length})',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Flexible(
                        child: Text(
                          'Drive Vault Sync: Up to date',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 11, color: colors.fgMuted),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
              ],
            ),
          ),

          // Resources SliverList
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: filtered.isEmpty
                ? SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(Icons.folder_off_outlined,
                                size: 48, color: colors.fgMuted),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              'No course materials found',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final mat = filtered[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.md),
                          child: _buildMaterialCard(context, mat, colors),
                        );
                      },
                      childCount: filtered.length,
                    ),
                  ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(height: AppSpacing.xxl),
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialCard(
      BuildContext context, CourseMaterial mat, AppColors colors) {
    final typeBadge = _getFileTypeVisual(mat.fileType, colors);

    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      onTap: () => _showMaterialPreviewSheet(context, mat, colors),
      child: Row(
        children: [
          // 44×44dp File Type Badge Container
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: typeBadge.bgColor,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(
              typeBadge.icon,
              color: typeBadge.fgColor,
              size: 24,
            ),
          ),
          const SizedBox(width: AppSpacing.md),

          // Details Column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
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
                    UcBadge(
                      label: mat.fileType,
                      variant: typeBadge.badgeVariant,
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
                  '${mat.uploadedBy} • ${mat.fileSize} • ${mat.uploadDate}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    color: colors.fgMuted,
                  ),
                ),
              ],
            ),
          ),

          // Download Action Icon Button
          IconButton(
            icon: Icon(Icons.cloud_download_outlined, color: colors.brand),
            tooltip: 'Download File',
            onPressed: () {
              AppHaptics.light();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Downloading ${mat.title}...')),
              );
            },
          ),
        ],
      ),
    );
  }

  _FileTypeVisual _getFileTypeVisual(String fileType, AppColors colors) {
    switch (fileType.toUpperCase()) {
      case 'PDF':
        return _FileTypeVisual(
          bgColor: colors.dangerSoft,
          fgColor: colors.danger,
          icon: Icons.picture_as_pdf,
          badgeVariant: UcBadgeVariant.danger,
        );
      case 'SLIDES':
      case 'PPTX':
        return _FileTypeVisual(
          bgColor: colors.warningSoft,
          fgColor: colors.warning,
          icon: Icons.slideshow,
          badgeVariant: UcBadgeVariant.warning,
        );
      case 'CODE':
      case 'SQL':
      case 'CPP':
        return _FileTypeVisual(
          bgColor: colors.successSoft,
          fgColor: colors.success,
          icon: Icons.code,
          badgeVariant: UcBadgeVariant.success,
        );
      case 'ZIP':
      case 'ARCHIVE':
      default:
        return _FileTypeVisual(
          bgColor: colors.brandSoft,
          fgColor: colors.brand,
          icon: Icons.folder_zip_outlined,
          badgeVariant: UcBadgeVariant.brand,
        );
    }
  }

  void _showMaterialPreviewSheet(
      BuildContext context, CourseMaterial mat, AppColors colors) {
    final visual = _getFileTypeVisual(mat.fileType, colors);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
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

                // File Header
                Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: visual.bgColor,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: Icon(visual.icon, size: 28, color: visual.fgColor),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            mat.title,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                              height: 1.25,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${mat.courseCode} • ${mat.fileSize} • Uploaded ${mat.uploadDate}',
                            style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 11,
                                color: colors.fgMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),

                // In-App Document Viewport Mockup
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
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
                              'DOCUMENT PREVIEW • ${mat.fileType}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: colors.fgMuted,
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Icon(Icons.fullscreen, size: 18, color: colors.fgMuted),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(
                        mat.title,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Course: ${mat.courseTitle} (${mat.courseCode})\nFaculty Instructor: ${mat.uploadedBy}\nVerified institutional course material available for offline studying.',
                        style: TextStyle(
                          fontSize: 11,
                          color: colors.fgMuted,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Row(
                        children: [
                          Icon(Icons.lock_outline, size: 12, color: colors.success),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              'Encrypted DCC Campus Cloud Storage',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: colors.success,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: UcButton(
                        label: 'Download Offline',
                        icon: const Icon(Icons.download, size: 18),
                        onPressed: () {
                          AppHaptics.success();
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Downloading "${mat.title}" for offline view...'),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    UcButton(
                      label: 'Share',
                      icon: const Icon(Icons.share_outlined, size: 18),
                      variant: UcButtonVariant.secondary,
                      onPressed: () {
                        AppHaptics.light();
                        Navigator.pop(ctx);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _FileTypeVisual {
  final Color bgColor;
  final Color fgColor;
  final IconData icon;
  final UcBadgeVariant badgeVariant;

  const _FileTypeVisual({
    required this.bgColor,
    required this.fgColor,
    required this.icon,
    required this.badgeVariant,
  });
}
