import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_search_input.dart';
import 'chat_thread_screen.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Campus Messages'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_note_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Search input
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: const UcSearchInput(
              hintText: 'Search conversations & groups...',
            ),
          ),
          // Online Active Notes Rail (Instagram Style)
          SizedBox(
            height: 96,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              itemCount: MockData.peers.length,
              separatorBuilder: (context, index) => const SizedBox(width: AppSpacing.md),
              itemBuilder: (context, index) {
                final peer = MockData.peers[index];
                return Column(
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        UcAvatar(
                          name: peer.name,
                          imageUrl: peer.avatar,
                          size: 52,
                          showOnlineDot: true,
                          isOnline: peer.isOnline,
                        ),
                        if (peer.note.isNotEmpty)
                          Positioned(
                            top: -6,
                            right: -10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: colors.surface,
                                borderRadius: BorderRadius.circular(AppRadius.pill),
                                border: Border.all(color: colors.line, width: 1.0),
                              ),
                              child: Text(
                                peer.note.length > 12
                                    ? '${peer.note.substring(0, 10)}..'
                                    : peer.note,
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: colors.fg,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    SizedBox(
                      width: 60,
                      child: Text(
                        peer.name.split(' ')[0],
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: colors.fg,
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          const Divider(),
          // Conversation List (WhatsApp Style)
          Expanded(
            child: ListView.separated(
              itemCount: MockData.conversations.length,
              separatorBuilder: (context, index) => Divider(
                indent: 78,
                color: colors.line,
                height: 1,
              ),
              itemBuilder: (context, index) {
                final conv = MockData.conversations[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                    vertical: 4,
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ChatThreadScreen(conversation: conv),
                      ),
                    );
                  },
                  leading: UcAvatar(
                    name: conv.peerName,
                    imageUrl: conv.avatar,
                    size: 50,
                    showOnlineDot: true,
                    isOnline: conv.isOnline,
                  ),
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          conv.peerName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: colors.fg,
                          ),
                        ),
                      ),
                      Text(
                        conv.timestamp,
                        style: TextStyle(
                          fontSize: 11,
                          color: conv.unreadCount > 0
                              ? colors.brand
                              : colors.fgSubtle,
                        ),
                      ),
                    ],
                  ),
                  subtitle: Row(
                    children: [
                      Expanded(
                        child: Text(
                          conv.lastMessage,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            color: conv.unreadCount > 0
                                ? colors.fg
                                : colors.fgMuted,
                            fontWeight: conv.unreadCount > 0
                                ? FontWeight.w600
                                : FontWeight.w400,
                          ),
                        ),
                      ),
                      if (conv.unreadCount > 0)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: colors.brand,
                            borderRadius: BorderRadius.circular(AppRadius.pill),
                          ),
                          child: Text(
                            '${conv.unreadCount}',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
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
