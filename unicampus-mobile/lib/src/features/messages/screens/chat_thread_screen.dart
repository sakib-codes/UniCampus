import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';

class ChatThreadScreen extends StatefulWidget {
  final Conversation conversation;

  const ChatThreadScreen({super.key, required this.conversation});

  @override
  State<ChatThreadScreen> createState() => _ChatThreadScreenState();
}

class _ChatThreadScreenState extends State<ChatThreadScreen> {
  final TextEditingController _msgController = TextEditingController();
  final List<ChatMessage> _messages = List.from(MockData.chatMessages);
  bool _isCallActive = false;

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add(
        ChatMessage(
          id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
          senderId: 'me',
          text: text,
          timestamp: 'Just now',
          isMe: true,
          status: 'sent',
        ),
      );
      _msgController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            UcAvatar(
              imageUrl: widget.conversation.avatar,
              name: widget.conversation.peerName,
              size: 36,
              showOnlineDot: true,
              isOnline: widget.conversation.isOnline,
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.conversation.peerName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  Text(
                    widget.conversation.isOnline
                        ? 'Online • Dhaka City College'
                        : widget.conversation.peerRole,
                    style: TextStyle(fontSize: 11, color: colors.fgMuted),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isCallActive ? Icons.call_end : Icons.phone_outlined,
              color: _isCallActive ? colors.danger : colors.fg,
            ),
            onPressed: () {
              setState(() => _isCallActive = !_isCallActive);
            },
          ),
          IconButton(
            icon: Icon(Icons.videocam_outlined, color: colors.fg),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Starting HD video consultation...')),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.more_vert, color: colors.fg),
            onPressed: () {
              _showThreadInfoSheet(context, colors);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          if (_isCallActive) _buildActiveCallBanner(colors),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(AppSpacing.lg),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg, colors);
              },
            ),
          ),
          _buildComposer(colors),
        ],
      ),
    );
  }

  Widget _buildActiveCallBanner(AppColors colors) {
    return Container(
      color: colors.successSoft,
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: colors.success,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'VoIP Consultation in progress (02:14)',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: colors.success,
                ),
              ),
            ],
          ),
          GestureDetector(
            onTap: () => setState(() => _isCallActive = false),
            child: Text(
              'End',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: colors.danger,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg, AppColors colors) {
    final isMe = msg.isMe;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.md),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.76,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? colors.brand : colors.surface,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(AppRadius.lg),
            topRight: const Radius.circular(AppRadius.lg),
            bottomLeft: Radius.circular(isMe ? AppRadius.lg : 2.0),
            bottomRight: Radius.circular(isMe ? 2.0 : AppRadius.lg),
          ),
          border: isMe ? null : Border.all(color: colors.line, width: 1.0),
        ),
        child: Column(
          crossAxisAlignment:
              isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              msg.text,
              style: TextStyle(
                fontSize: 14,
                color: isMe ? Colors.white : colors.fg,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  msg.timestamp,
                  style: TextStyle(
                    fontSize: 10,
                    color: isMe ? Colors.white70 : colors.fgSubtle,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    Icons.done_all,
                    size: 13,
                    color: Colors.white70,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComposer(AppColors colors) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
        MediaQuery.of(context).padding.bottom + AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border(top: BorderSide(color: colors.line, width: 1.0)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: Icon(Icons.add_circle_outline, color: colors.brand),
            onPressed: () {},
          ),
          Expanded(
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: colors.surface2,
                borderRadius: BorderRadius.circular(AppRadius.pill),
                border: Border.all(color: colors.line),
              ),
              child: TextField(
                controller: _msgController,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
                style: TextStyle(fontSize: 14, color: colors.fg),
                decoration: InputDecoration(
                  hintText: 'Type a message...',
                  hintStyle: TextStyle(fontSize: 13, color: colors.fgSubtle),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Material(
            color: colors.brand,
            shape: const CircleBorder(),
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: _sendMessage,
              child: const Padding(
                padding: EdgeInsets.all(10),
                child: Icon(Icons.send, size: 18, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showThreadInfoSheet(BuildContext context, AppColors colors) {
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                UcAvatar(
                  imageUrl: widget.conversation.avatar,
                  name: widget.conversation.peerName,
                  size: 64,
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  widget.conversation.peerName,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: colors.fg,
                  ),
                ),
                Text(
                  widget.conversation.peerRole,
                  style: TextStyle(fontSize: 13, color: colors.fgMuted),
                ),
                const SizedBox(height: AppSpacing.xl),
                ListTile(
                  leading: Icon(Icons.notifications_off_outlined, color: colors.fg),
                  title: Text('Mute Notifications', style: TextStyle(color: colors.fg)),
                ),
                ListTile(
                  leading: Icon(Icons.photo_library_outlined, color: colors.fg),
                  title: Text('Shared Media & Documents (14)', style: TextStyle(color: colors.fg)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
