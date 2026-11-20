import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class NoticeDetailScreen extends StatelessWidget {
  final NoticeItem notice;

  const NoticeDetailScreen({super.key, required this.notice});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Notice Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notice link copied to clipboard')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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
                const Spacer(),
                Text(
                  notice.date,
                  style: TextStyle(fontSize: 12, color: colors.fgMuted),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              notice.title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: colors.fg,
                height: 1.3,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            // Author Box
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              backgroundColor: colors.surface2,
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: colors.brandSoft,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.account_balance,
                        size: 20, color: colors.brand),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          notice.author,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: colors.fg,
                          ),
                        ),
                        Text(
                          notice.authorRole,
                          style: TextStyle(fontSize: 11, color: colors.fgMuted),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            // Notice Content
            Text(
              notice.content,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w400,
                height: 1.6,
                color: colors.fg,
              ),
            ),
            if (notice.attachmentName != null) ...[
              const SizedBox(height: AppSpacing.xxl),
              Text(
                'Official Attachment',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: colors.fg,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              UcCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: colors.dangerSoft,
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Icon(Icons.picture_as_pdf,
                          color: colors.danger, size: 24),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            notice.attachmentName!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: colors.fg,
                            ),
                          ),
                          Text(
                            notice.attachmentSize ?? 'PDF File',
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 11,
                              color: colors.fgMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    UcButton(
                      label: 'Download',
                      icon: const Icon(Icons.download, size: 16),
                      variant: UcButtonVariant.secondary,
                      height: 36,
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                              content: Text(
                                  'Downloading ${notice.attachmentName}...')),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
