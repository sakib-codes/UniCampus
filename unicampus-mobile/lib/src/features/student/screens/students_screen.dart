import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';
import '../../../widgets/common/uc_chip_bar.dart';
import '../../messages/screens/chat_thread_screen.dart';

class StudentsScreen extends StatefulWidget {
  const StudentsScreen({super.key});

  @override
  State<StudentsScreen> createState() => _StudentsScreenState();
}

class _StudentsScreenState extends State<StudentsScreen> {
  int _selectedFilterIndex = 0;
  final List<String> _filters = [
    'All Peers',
    'Online Now',
    'Batch 2023',
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
    final filteredPeers = MockData.peers.where((peer) {
      final matchesFilter = _selectedFilterIndex == 0 ||
          (_selectedFilterIndex == 1 && peer.isOnline) ||
          (_selectedFilterIndex == 2 && peer.batch == 'Batch 2023');
      final matchesQuery = query.isEmpty ||
          peer.name.toLowerCase().contains(query) ||
          peer.roll.toLowerCase().contains(query) ||
          peer.department.toLowerCase().contains(query) ||
          peer.note.toLowerCase().contains(query);
      return matchesFilter && matchesQuery;
    }).toList();

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('CSE Classmates Directory'),
      ),
      body: Column(
        children: [
          // Search Input
          Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
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
                  hintText: 'Search by student name or roll...',
                  hintStyle: TextStyle(fontSize: 13, color: colors.fgMuted),
                  prefixIcon:
                      Icon(Icons.search, size: 20, color: colors.fgMuted),
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

          // Filter Chips
          UcChipBar(
            chips: _filters,
            selectedIndex: _selectedFilterIndex,
            onSelected: (idx) {
              AppHaptics.selection();
              setState(() => _selectedFilterIndex = idx);
            },
          ),
          const SizedBox(height: AppSpacing.sm),

          // Peers List
          Expanded(
            child: filteredPeers.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.person_off_outlined,
                            size: 48, color: colors.fgMuted),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          'No classmates found',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: colors.fgMuted,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding:
                        const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                    itemCount: filteredPeers.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, index) {
                      final student = filteredPeers[index];
                      return _buildPeerCard(context, student, colors);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeerCard(
      BuildContext context, PeerStudent student, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      onTap: () => _showStudentDetailSheet(context, student, colors),
      child: Row(
        children: [
          // Avatar with presence status dot
          Stack(
            children: [
              UcAvatar(
                name: student.name,
                imageUrl: student.avatar,
                size: 48,
                showOnlineDot: true,
                isOnline: student.isOnline,
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: student.isOnline ? colors.success : colors.fgSubtle,
                    shape: BoxShape.circle,
                    border: Border.all(color: colors.surface, width: 2.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: AppSpacing.md),

          // Information Column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        student.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: colors.fg,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.verified, size: 14, color: colors.brand),
                  ],
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
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
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

          // Actions: 1-Tap Copy & Chat
          IconButton(
            icon: Icon(Icons.copy_outlined, size: 16, color: colors.fgMuted),
            tooltip: 'Copy Student ID',
            onPressed: () {
              Clipboard.setData(ClipboardData(text: student.roll));
              AppHaptics.light();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('ID ${student.roll} copied to clipboard'),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.chat_outlined, color: colors.brand),
            tooltip: 'Send Direct Message',
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
                      lastMessage: 'Hey ${student.name.split(" ").first}!',
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
  }

  void _showStudentDetailSheet(
      BuildContext context, PeerStudent student, AppColors colors) {
    final email = '${student.name.toLowerCase().replaceAll(" ", ".")}@student.dcc.edu.bd';

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
                    UcAvatar(
                      name: student.name,
                      imageUrl: student.avatar,
                      size: 64,
                      showOnlineDot: true,
                      isOnline: student.isOnline,
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  student.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w700,
                                    color: colors.fg,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(Icons.verified, size: 16, color: colors.brand),
                            ],
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
                          const SizedBox(height: 4),
                          UcBadge(
                            label: student.isOnline ? 'ONLINE NOW' : 'AWAY',
                            variant: student.isOnline
                                ? UcBadgeVariant.success
                                : UcBadgeVariant.neutral,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                if (student.note.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.md),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: colors.brandSoft,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: Text(
                      'Status: "${student.note}"',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: colors.brand,
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: AppSpacing.lg),

                // Copyable Contact Rows
                UcCard(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    children: [
                      _buildCopyableRow(
                        context: context,
                        label: 'Institutional Email',
                        value: email,
                        colors: colors,
                      ),
                      const Divider(),
                      _buildCopyableRow(
                        context: context,
                        label: 'Student Roll ID',
                        value: student.roll,
                        colors: colors,
                      ),
                      const Divider(),
                      _buildCopyableRow(
                        context: context,
                        label: 'Academic Batch',
                        value: student.batch,
                        colors: colors,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Direct message CTA
                UcButton(
                  label: 'Send Direct Message',
                  icon: const Icon(Icons.chat_bubble_outline, size: 18),
                  width: double.infinity,
                  onPressed: () {
                    Navigator.pop(ctx);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ChatThreadScreen(
                          conversation: Conversation(
                            id: student.id,
                            peerName: student.name,
                            peerRole: student.roll,
                            avatar: student.avatar,
                            lastMessage: 'Hey ${student.name.split(" ").first}!',
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
          ),
        );
      },
    );
  }

  Widget _buildCopyableRow({
    required BuildContext context,
    required String label,
    required String value,
    required AppColors colors,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(fontSize: 11, color: colors.fgMuted)),
              const SizedBox(height: 2),
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: colors.fg,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        IconButton(
          icon: Icon(Icons.copy_outlined, size: 16, color: colors.brand),
          tooltip: 'Copy $label',
          onPressed: () {
            Clipboard.setData(ClipboardData(text: value));
            AppHaptics.light();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('$label copied to clipboard')),
            );
          },
        ),
      ],
    );
  }
}
