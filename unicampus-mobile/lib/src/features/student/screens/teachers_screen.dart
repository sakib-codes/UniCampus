import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_search_input.dart';
import '../../messages/screens/chat_thread_screen.dart';

class TeachersScreen extends StatelessWidget {
  const TeachersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty & Teachers Directory'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: const UcSearchInput(
              hintText: 'Search faculty by name or department...',
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: MockData.faculty.length,
              separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, index) {
                final teacher = MockData.faculty[index];
                return UcCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  onTap: () {
                    _showTeacherDetailSheet(context, teacher, colors);
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          UcAvatar(
                            name: teacher.name,
                            imageUrl: teacher.avatar,
                            size: 50,
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        teacher.name,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w700,
                                          color: colors.fg,
                                        ),
                                      ),
                                    ),
                                    UcBadge(
                                      label: teacher.status.toUpperCase(),
                                      variant: teacher.status == 'In Office'
                                          ? UcBadgeVariant.success
                                          : UcBadgeVariant.warning,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${teacher.designation} • ${teacher.department}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: colors.fgMuted,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  teacher.room,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                    color: colors.brand,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => ChatThreadScreen(
                                      conversation: Conversation(
                                        id: teacher.id,
                                        peerName: teacher.name,
                                        peerRole: teacher.designation,
                                        avatar: teacher.avatar,
                                        lastMessage: 'Consultation message...',
                                        timestamp: 'Now',
                                        isOnline: true,
                                      ),
                                    ),
                                  ),
                                );
                              },
                              icon: const Icon(Icons.chat_bubble_outline, size: 16),
                              label: const Text('Message', style: TextStyle(fontSize: 12)),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {
                                _showTeacherDetailSheet(context, teacher, colors);
                              },
                              icon: const Icon(Icons.info_outline, size: 16),
                              label: const Text('Office Hours', style: TextStyle(fontSize: 12)),
                            ),
                          ),
                        ],
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

  void _showTeacherDetailSheet(
      BuildContext context, FacultyMember teacher, AppColors colors) {
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
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
                    UcAvatar(
                      name: teacher.name,
                      imageUrl: teacher.avatar,
                      size: 60,
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(teacher.name,
                              style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w700,
                                  color: colors.fg)),
                          Text(teacher.designation,
                              style: TextStyle(
                                  fontSize: 13, color: colors.fgMuted)),
                          Text(teacher.room,
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: colors.brand)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(Icons.email_outlined, color: colors.brand),
                  title: Text(teacher.email, style: TextStyle(color: colors.fg)),
                  subtitle: const Text('Institutional Email'),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(Icons.schedule, color: colors.brand),
                  title: Text(teacher.officeHours, style: TextStyle(color: colors.fg)),
                  subtitle: const Text('Consultation Hours'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
