import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';
import 'notice_detail_screen.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({super.key});

  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  int _selectedCategoryIndex = 0;
  final List<String> _categories = [
    'All',
    'Exam',
    'Academic',
    'Events',
    'Urgent',
    'Finance',
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
    final filteredNotices = MockData.notices.where((notice) {
      final matchesCategory = _selectedCategoryIndex == 0 ||
          notice.category.toLowerCase() ==
              _categories[_selectedCategoryIndex].toLowerCase();
      final matchesQuery = query.isEmpty ||
          notice.title.toLowerCase().contains(query) ||
          notice.content.toLowerCase().contains(query) ||
          notice.author.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList();

    // Check if pinned notice exists in filtered set
    final pinnedNotice = filteredNotices.where((n) => n.isPinned).firstOrNull;
    final feedNotices = pinnedNotice != null && _searchQuery.isEmpty
        ? filteredNotices.where((n) => n.id != pinnedNotice.id).toList()
        : filteredNotices;

    return Scaffold(
      backgroundColor: colors.canvas,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.md),

                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: colors.surface2,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(color: colors.line, width: 1.0),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() => _searchQuery = val);
                      },
                      style: TextStyle(fontSize: 14, color: colors.fg),
                      decoration: InputDecoration(
                        hintText: 'Search campus notices, circulars, exams...',
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
                const SizedBox(height: AppSpacing.md),

                // Category Filter Chip Rail
                UcChipBar(
                  chips: _categories,
                  selectedIndex: _selectedCategoryIndex,
                  onSelected: (idx) {
                    AppHaptics.selection();
                    setState(() => _selectedCategoryIndex = idx);
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Pinned Priority Announcement Banner (if available in current filter)
                if (pinnedNotice != null && _searchQuery.isEmpty) ...[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                    child: _buildPinnedNoticeBanner(pinnedNotice, colors),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
              ],
            ),
          ),

          // Hairline Feed List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            sliver: filteredNotices.isEmpty
                ? SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(Icons.search_off, size: 48, color: colors.fgMuted),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              'No notices found matching "$_searchQuery"',
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
                        final notice = feedNotices[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.md),
                          child: _buildNoticeCard(notice, colors),
                        );
                      },
                      childCount: feedNotices.length,
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

  Widget _buildPinnedNoticeBanner(NoticeItem notice, AppColors colors) {
    return Container(
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: colors.brand.withValues(alpha: 0.35), width: 1.0),
      ),
      clipBehavior: Clip.antiAlias,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Left vertical accent stripe
            Container(
              width: 4,
              color: notice.isUrgent ? colors.danger : colors.brand,
            ),
            Expanded(
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => NoticeDetailScreen(notice: notice),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Icon(Icons.push_pin,
                                    size: 14,
                                    color: notice.isUrgent
                                        ? colors.danger
                                        : colors.brand),
                                const SizedBox(width: 4),
                                Flexible(
                                  child: Text(
                                    'PINNED ANNOUNCEMENT',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: notice.isUrgent
                                          ? colors.danger
                                          : colors.brand,
                                      letterSpacing: 0.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            notice.date,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              color: colors.fgMuted,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Text(
                        notice.title,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notice.content,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13,
                          color: colors.fgMuted,
                          height: 1.4,
                        ),
                      ),
                      if (notice.attachmentName != null) ...[
                        const SizedBox(height: AppSpacing.md),
                        InkWell(
                          onTap: () => _showAttachmentPreviewSheet(
                              context, notice, colors),
                          borderRadius: BorderRadius.circular(AppRadius.xs),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: colors.brandSoft,
                              borderRadius:
                                  BorderRadius.circular(AppRadius.xs),
                              border: Border.all(
                                  color:
                                      colors.brand.withValues(alpha: 0.2)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.picture_as_pdf,
                                    size: 14, color: colors.brand),
                                const SizedBox(width: 5),
                                Flexible(
                                  child: Text(
                                    '${notice.attachmentName} (${notice.attachmentSize ?? 'PDF'})',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontFamily: 'monospace',
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: colors.brand,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNoticeCard(NoticeItem notice, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => NoticeDetailScreen(notice: notice),
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    UcBadge(
                      label: notice.category.toUpperCase(),
                      variant: notice.isUrgent
                          ? UcBadgeVariant.danger
                          : UcBadgeVariant.brand,
                    ),
                    if (notice.isPinned)
                      UcBadge(
                        label: 'PINNED',
                        variant: UcBadgeVariant.neutral,
                        icon: Icons.push_pin,
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                notice.date,
                style: TextStyle(fontSize: 11, color: colors.fgMuted),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            notice.title,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: colors.fg,
              height: 1.3,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            notice.content,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 13,
              color: colors.fgMuted,
              height: 1.4,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    UcAvatar(name: notice.author, size: 20),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        notice.author,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: colors.fgSubtle,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (notice.attachmentName != null) ...[
                const SizedBox(width: AppSpacing.sm),
                GestureDetector(
                  onTap: () =>
                      _showAttachmentPreviewSheet(context, notice, colors),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: colors.surface2,
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                      border: Border.all(color: colors.line),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.attachment, size: 13, color: colors.brand),
                        const SizedBox(width: 4),
                        Text(
                          notice.attachmentSize ?? 'PDF',
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: colors.brand,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  void _showAttachmentPreviewSheet(
      BuildContext context, NoticeItem notice, AppColors colors) {
    AppHaptics.light();
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
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: colors.dangerSoft,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: Icon(Icons.picture_as_pdf,
                          size: 24, color: colors.danger),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            notice.attachmentName ?? 'Document.pdf',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                            ),
                          ),
                          Text(
                            '${notice.attachmentSize ?? "1.8 MB"} • Official Circular',
                            style: TextStyle(
                                fontSize: 12, color: colors.fgMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),

                // Simulated Document Viewport
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
                          Text(
                            'PREVIEW • PAGE 1 OF 3',
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: colors.fgMuted,
                            ),
                          ),
                          Icon(Icons.zoom_in, size: 16, color: colors.fgMuted),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(
                        notice.title,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        notice.content,
                        maxLines: 4,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11,
                          color: colors.fgMuted,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Actions
                Row(
                  children: [
                    Expanded(
                      child: UcButton(
                        label: 'Download PDF',
                        icon: const Icon(Icons.download, size: 18),
                        onPressed: () {
                          AppHaptics.success();
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                  'Downloading ${notice.attachmentName}...'),
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
