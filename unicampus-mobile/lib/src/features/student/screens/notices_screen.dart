import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
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
  final List<String> _categories = ['All', 'Exam', 'Academic', 'Events', 'Finance'];

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    final filteredNotices = _selectedCategoryIndex == 0
        ? MockData.notices
        : MockData.notices.where((n) {
            return n.category.toLowerCase() ==
                _categories[_selectedCategoryIndex].toLowerCase();
          }).toList();

    return Scaffold(
      backgroundColor: colors.canvas,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.md),
                // Category Filter Strip
                UcChipBar(
                  chips: _categories,
                  selectedIndex: _selectedCategoryIndex,
                  onSelected: (idx) {
                    setState(() => _selectedCategoryIndex = idx);
                  },
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
                  final notice = filteredNotices[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: UcCard(
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
                              Row(
                                children: [
                                  UcBadge(
                                    label: notice.category.toUpperCase(),
                                    variant: notice.isUrgent
                                        ? UcBadgeVariant.danger
                                        : UcBadgeVariant.brand,
                                  ),
                                  if (notice.isPinned) ...[
                                    const SizedBox(width: AppSpacing.sm),
                                    UcBadge(
                                      label: 'PINNED',
                                      variant: UcBadgeVariant.neutral,
                                      icon: Icons.push_pin,
                                    ),
                                  ],
                                ],
                              ),
                              Text(
                                notice.date,
                                style: TextStyle(
                                    fontSize: 11, color: colors.fgMuted),
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
                              Text(
                                notice.author,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: colors.fgSubtle,
                                ),
                              ),
                              if (notice.attachmentName != null)
                                Row(
                                  children: [
                                    Icon(Icons.attachment,
                                        size: 14, color: colors.brand),
                                    const SizedBox(width: 3),
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
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
                childCount: filteredNotices.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
