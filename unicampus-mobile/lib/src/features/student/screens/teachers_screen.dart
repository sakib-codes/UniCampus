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

class TeachersScreen extends StatefulWidget {
  const TeachersScreen({super.key});

  @override
  State<TeachersScreen> createState() => _TeachersScreenState();
}

class _TeachersScreenState extends State<TeachersScreen> {
  int _selectedDeptIndex = 0;
  final List<String> _departments = [
    'All Faculty',
    'CSE',
    'EEE',
    'BBA',
    'In Office',
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
    final filteredFaculty = MockData.faculty.where((teacher) {
      final matchesDept = _selectedDeptIndex == 0 ||
          (_selectedDeptIndex == 4
              ? teacher.status.toLowerCase() == 'in office'
              : teacher.department
                  .toLowerCase()
                  .contains(_departments[_selectedDeptIndex].toLowerCase()));
      final matchesQuery = query.isEmpty ||
          teacher.name.toLowerCase().contains(query) ||
          teacher.designation.toLowerCase().contains(query) ||
          teacher.department.toLowerCase().contains(query) ||
          teacher.room.toLowerCase().contains(query);
      return matchesDept && matchesQuery;
    }).toList();

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Faculty & Teachers Directory'),
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
                  hintText: 'Search faculty by name or department...',
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

          // Department Filter Chips
          UcChipBar(
            chips: _departments,
            selectedIndex: _selectedDeptIndex,
            onSelected: (idx) {
              AppHaptics.selection();
              setState(() => _selectedDeptIndex = idx);
            },
          ),
          const SizedBox(height: AppSpacing.sm),

          // Faculty List
          Expanded(
            child: filteredFaculty.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.school_outlined,
                            size: 48, color: colors.fgMuted),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          'No faculty members found',
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
                    itemCount: filteredFaculty.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, index) {
                      final teacher = filteredFaculty[index];
                      return _buildFacultyCard(context, teacher, colors);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFacultyCard(
      BuildContext context, FacultyMember teacher, AppColors colors) {
    final statusColor = _getStatusColor(teacher.status, colors);

    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      onTap: () => _showTeacherDetailSheet(context, teacher, colors),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Avatar with live status ring / dot
              Stack(
                children: [
                  UcAvatar(
                    name: teacher.name,
                    imageUrl: teacher.avatar,
                    size: 50,
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 13,
                      height: 13,
                      decoration: BoxDecoration(
                        color: statusColor,
                        shape: BoxShape.circle,
                        border: Border.all(color: colors.surface, width: 2.0),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: AppSpacing.md),

              // Title and Designation
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            teacher.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                            ),
                          ),
                        ),
                        UcBadge(
                          label: teacher.status.toUpperCase(),
                          variant: teacher.status.toLowerCase() == 'in office'
                              ? UcBadgeVariant.success
                              : UcBadgeVariant.warning,
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${teacher.designation} • ${teacher.department}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 12,
                        color: colors.fgMuted,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Icon(Icons.location_on_outlined,
                            size: 13, color: colors.brand),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            teacher.room,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: colors.brand,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // 1-Tap Copy Contact Strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: colors.surface2,
              borderRadius: BorderRadius.circular(AppRadius.sm),
              border: Border.all(color: colors.line),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Icon(Icons.email_outlined,
                          size: 13, color: colors.fgMuted),
                      const SizedBox(width: 5),
                      Expanded(
                        child: Text(
                          teacher.email,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: colors.fgMuted,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                InkWell(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: teacher.email));
                    AppHaptics.light();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Email copied: ${teacher.email}')),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: Text(
                      'Copy',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: colors.brand,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Action Buttons: Message & Office Hours
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
                  label:
                      const Text('Office Hours', style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status, AppColors colors) {
    switch (status.toLowerCase()) {
      case 'in office':
        return colors.success;
      case 'in class':
        return colors.warning;
      case 'online':
        return colors.brand;
      default:
        return colors.fgSubtle;
    }
  }

  void _showTeacherDetailSheet(
      BuildContext context, FacultyMember teacher, AppColors colors) {
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: SingleChildScrollView(
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

                  // Header with Avatar and Status
                  Row(
                    children: [
                      UcAvatar(
                        name: teacher.name,
                        imageUrl: teacher.avatar,
                        size: 64,
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              teacher.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: colors.fg,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${teacher.designation} • ${teacher.department}',
                              style: TextStyle(
                                fontSize: 12,
                                color: colors.fgMuted,
                              ),
                            ),
                            const SizedBox(height: 6),
                            UcBadge(
                              label: teacher.status.toUpperCase(),
                              variant:
                                  teacher.status.toLowerCase() == 'in office'
                                      ? UcBadgeVariant.success
                                      : UcBadgeVariant.warning,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Contact Details Card
                  UcCard(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Column(
                      children: [
                        _buildCopyableRow(
                          context: context,
                          label: 'Institutional Email',
                          value: teacher.email,
                          colors: colors,
                        ),
                        const Divider(),
                        _buildCopyableRow(
                          context: context,
                          label: 'Direct Cabin Phone',
                          value: teacher.phone,
                          colors: colors,
                        ),
                        const Divider(),
                        _buildCopyableRow(
                          context: context,
                          label: 'Office Location',
                          value: teacher.room,
                          colors: colors,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Weekly Office Consultation Hours
                  UcCard(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                'Office & Advising Hours',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: colors.fg,
                                ),
                              ),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: colors.successSoft,
                                borderRadius:
                                    BorderRadius.circular(AppRadius.xs),
                              ),
                              child: Text(
                                'Available Today',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: colors.success,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          teacher.officeHours,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: colors.fg,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Walk-ins welcome during office hours or book via message.',
                          style: TextStyle(
                              fontSize: 11, color: colors.fgMuted),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Courses Taught
                  Text(
                    'Courses Taught This Semester',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: colors.fg,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: teacher.courses.map((c) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: colors.brandSoft,
                          borderRadius: BorderRadius.circular(AppRadius.pill),
                        ),
                        child: Text(
                          c,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: colors.brand,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Consultation CTA
                  UcButton(
                    label: 'Send Consultation Message',
                    icon: const Icon(Icons.chat_bubble_outline, size: 18),
                    width: double.infinity,
                    onPressed: () {
                      Navigator.pop(ctx);
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
                  ),
                ],
              ),
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
