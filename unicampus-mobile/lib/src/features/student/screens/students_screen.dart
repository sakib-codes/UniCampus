import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_search_input.dart';
import '../../messages/screens/chat_thread_screen.dart';

class StudentsScreen extends StatelessWidget {
  const StudentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('CSE Classmates Directory'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: const UcSearchInput(
              hintText: 'Search by student name or roll...',
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: MockData.peers.length,
              separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, index) {
                final student = MockData.peers[index];
                return UcCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    children: [
                      UcAvatar(
                        name: student.name,
                        imageUrl: student.avatar,
                        size: 48,
                        showOnlineDot: true,
                        isOnline: student.isOnline,
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              student.name,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: colors.fg,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${student.roll} • ${student.department}',
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                                color: colors.fgMuted,
                              ),
                            ),
                            if (student.note.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                student.note,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontStyle: FontStyle.italic,
                                  color: colors.brand,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.chat_outlined, color: colors.brand),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ChatThreadScreen(
                                conversation: Conversation(
                                  id: student.id,
                                  peerName: student.name,
                                  peerRole: student.roll,
                                  avatar: student.avatar,
                                  lastMessage: 'Hey Tanvir!',
                                  timestamp: 'Just now',
                                  isOnline: student.isOnline,
                                ),
                              ),
                            ),
                          );
                        },
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
