import 'package:flutter/material.dart';
import '../../../core/models/mock_data.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class _DayInfo {
  final String dayName;
  final String shortName;
  final int dateNumber;
  final int classCount;

  const _DayInfo({
    required this.dayName,
    required this.shortName,
    required this.dateNumber,
    required this.classCount,
  });
}

class _StudyCircleItem {
  final String id;
  final String courseCode;
  final String topic;
  final String timeAndRoom;
  final String host;
  final int currentPeers;
  final int maxPeers;
  bool isJoined;

  _StudyCircleItem({
    required this.id,
    required this.courseCode,
    required this.topic,
    required this.timeAndRoom,
    required this.host,
    required this.currentPeers,
    required this.maxPeers,
    this.isJoined = false,
  });
}

class RoutineScreen extends StatefulWidget {
  const RoutineScreen({super.key});

  @override
  State<RoutineScreen> createState() => _RoutineScreenState();
}

class _RoutineScreenState extends State<RoutineScreen> {
  int _selectedDayIndex = 4; // Defaults to Thursday
  int _modeIndex = 0; // 0 = Classes, 1 = Peer Circles

  final List<_DayInfo> _days = const [
    _DayInfo(dayName: 'Sunday', shortName: 'Sun', dateNumber: 18, classCount: 3),
    _DayInfo(dayName: 'Monday', shortName: 'Mon', dateNumber: 19, classCount: 4),
    _DayInfo(dayName: 'Tuesday', shortName: 'Tue', dateNumber: 20, classCount: 3),
    _DayInfo(dayName: 'Wednesday', shortName: 'Wed', dateNumber: 21, classCount: 4),
    _DayInfo(dayName: 'Thursday', shortName: 'Thu', dateNumber: 22, classCount: 3),
  ];

  late final List<_StudyCircleItem> _studyCircles;

  @override
  void initState() {
    super.initState();
    _studyCircles = [
      _StudyCircleItem(
        id: 'sc-1',
        courseCode: 'CSE-3101',
        topic: 'Raft Consensus & Distributed Log Replication',
        timeAndRoom: 'Wednesday 03:00 PM – 04:30 PM (Lab 4 Available)',
        host: 'Tanvir Ahmed',
        currentPeers: 4,
        maxPeers: 6,
        isJoined: true,
      ),
      _StudyCircleItem(
        id: 'sc-2',
        courseCode: 'CSE-3205',
        topic: 'Microservices Architecture & gRPC Deep-Dive',
        timeAndRoom: 'Thursday 04:00 PM – 05:30 PM (Discussion Room 2)',
        host: 'Sadia Afrin',
        currentPeers: 5,
        maxPeers: 6,
      ),
      _StudyCircleItem(
        id: 'sc-3',
        courseCode: 'CSE-3102',
        topic: 'B-Tree Indexing & Query Optimization Workshop',
        timeAndRoom: 'Friday 10:00 AM – 11:30 AM (Online Meet)',
        host: 'Fahim Shahriar',
        currentPeers: 3,
        maxPeers: 5,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final currentDay = _days[_selectedDayIndex];

    return Scaffold(
      backgroundColor: colors.canvas,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.md),
                // 1. Weekday Pill Strip
                _buildWeekdayPillStrip(colors),
                const SizedBox(height: AppSpacing.md),

                // 2. Mode Switch: Classes vs Peer Circles
                _buildModeSwitch(colors),
                const SizedBox(height: AppSpacing.md),

                // 3. Section Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          _modeIndex == 0
                              ? '${currentDay.dayName} Schedule'
                              : 'Peer Study Circles',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: colors.fg,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Flexible(
                        child: Text(
                          _modeIndex == 0
                              ? '${currentDay.classCount} Classes • 6.0 Hours'
                              : '${_studyCircles.length} Active Circles',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: colors.fgMuted,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
            ),
          ),

          // Content body based on mode
          if (_modeIndex == 0)
            _buildClassesSliverList(colors)
          else
            _buildPeerCirclesSliverList(colors),
        ],
      ),
    );
  }

  Widget _buildWeekdayPillStrip(AppColors colors) {
    return SizedBox(
      height: 68,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
        scrollDirection: Axis.horizontal,
        itemCount: _days.length,
        separatorBuilder: (context, index) => const SizedBox(width: AppSpacing.sm),
        itemBuilder: (context, index) {
          final day = _days[index];
          final isSelected = index == _selectedDayIndex;

          return Material(
            color: isSelected ? colors.brand : colors.surface,
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: InkWell(
              borderRadius: BorderRadius.circular(AppRadius.md),
              onTap: () {
                AppHaptics.selection();
                setState(() => _selectedDayIndex = index);
              },
              child: Container(
                width: 58,
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(
                    color: isSelected ? colors.brand : colors.line,
                    width: 1.0,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      day.shortName,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white70 : colors.fgMuted,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${day.dateNumber}',
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : colors.fg,
                        fontFeatures: const [FontFeature.tabularFigures()],
                      ),
                    ),
                    const SizedBox(height: 3),
                    Container(
                      width: 4,
                      height: 4,
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : colors.brand,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildModeSwitch(AppColors colors) {
    final modes = ['Classes', 'Peer Circles'];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Container(
        height: 40,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: colors.surface2,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: colors.line, width: 1.0),
        ),
        child: Row(
          children: List.generate(modes.length, (idx) {
            final isSelected = _modeIndex == idx;
            return Expanded(
              child: GestureDetector(
                onTap: () {
                  AppHaptics.selection();
                  setState(() => _modeIndex = idx);
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected ? colors.surface : Colors.transparent,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                    border: isSelected
                        ? Border.all(color: colors.line, width: 1.0)
                        : null,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    modes[idx],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight:
                          isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? colors.fg : colors.fgMuted,
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  Widget _buildClassesSliverList(AppColors colors) {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final slot =
                MockData.todayRoutine[index % MockData.todayRoutine.length];
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: UcCard(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              slot.courseCode,
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: colors.brand,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            UcBadge(
                              label: slot.isLab ? 'LAB' : 'THEORY',
                              variant: slot.isLab
                                  ? UcBadgeVariant.warning
                                  : UcBadgeVariant.neutral,
                            ),
                          ],
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: colors.surface2,
                              borderRadius:
                                  BorderRadius.circular(AppRadius.xs),
                              border: Border.all(
                                  color: colors.line, width: 1.0),
                            ),
                            child: Text.rich(
                              TextSpan(
                                children: [
                                  WidgetSpan(
                                    alignment: PlaceholderAlignment.middle,
                                    child: Padding(
                                      padding: const EdgeInsets.only(right: 3),
                                      child: Icon(Icons.location_on_outlined,
                                          size: 12, color: colors.fgMuted),
                                    ),
                                  ),
                                  TextSpan(
                                    text: slot.room,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: colors.fg,
                                    ),
                                  ),
                                ],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      slot.courseTitle,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: AppSpacing.md,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.schedule, size: 15, color: colors.fgMuted),
                            const SizedBox(width: 5),
                            Text(
                              '${slot.startTime} – ${slot.endTime}',
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: colors.fgMuted,
                              ),
                            ),
                          ],
                        ),
                        Text.rich(
                          TextSpan(
                            children: [
                              WidgetSpan(
                                alignment: PlaceholderAlignment.middle,
                                child: Padding(
                                  padding: const EdgeInsets.only(right: 5),
                                  child: Icon(Icons.person_outline,
                                      size: 15, color: colors.fgMuted),
                                ),
                              ),
                              TextSpan(
                                text: slot.teacher,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: colors.fgMuted,
                                ),
                              ),
                            ],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        _buildQuickResourcePill(
                            'Course Materials', Icons.description_outlined, colors),
                        _buildQuickResourcePill(
                            'Classroom Link', Icons.video_camera_front_outlined, colors),
                        if (slot.isLab)
                          _buildQuickResourcePill(
                              'Lab Manual', Icons.code_outlined, colors),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
          childCount: MockData.todayRoutine.length,
        ),
      ),
    );
  }

  Widget _buildQuickResourcePill(
      String label, IconData icon, AppColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: BorderRadius.circular(AppRadius.pill),
        border: Border.all(color: colors.line),
      ),
      child: Text.rich(
        TextSpan(
          children: [
            WidgetSpan(
              alignment: PlaceholderAlignment.middle,
              child: Padding(
                padding: const EdgeInsets.only(right: 4),
                child: Icon(icon, size: 12, color: colors.brand),
              ),
            ),
            TextSpan(
              text: label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: colors.fg,
              ),
            ),
          ],
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }

  Widget _buildPeerCirclesSliverList(AppColors colors) {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          // Propose Slot CTA Banner
          UcCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            borderRadius: AppRadius.lg,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: colors.brandSoft,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: Icon(Icons.group_add, color: colors.brand, size: 24),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Organize a Study Session',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Reserve a discussion table or lab slot with peers',
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(fontSize: 12, color: colors.fgMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                UcButton(
                  label: 'Propose Slot',
                  width: double.infinity,
                  height: 36,
                  onPressed: () => _showProposeStudySlotSheet(context, colors),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Study Circle Cards
          ..._studyCircles.map((circle) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: UcCard(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      alignment: WrapAlignment.spaceBetween,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: colors.brandSoft,
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: Text(
                            circle.courseCode,
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: colors.brand,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: colors.surface2,
                            borderRadius: BorderRadius.circular(AppRadius.pill),
                            border: Border.all(color: colors.line),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.people_outline,
                                  size: 13, color: colors.fgMuted),
                              const SizedBox(width: 4),
                              Text(
                                '${circle.currentPeers + (circle.isJoined ? 1 : 0)} / ${circle.maxPeers} Peers',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: colors.fg,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      circle.topic,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: colors.fg,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Row(
                      children: [
                        Icon(Icons.schedule, size: 14, color: colors.fgMuted),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            circle.timeAndRoom,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 12,
                              color: colors.fgMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              UcAvatar(name: circle.host, size: 26),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  'Host: ${circle.host}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: colors.fgMuted,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        UcButton(
                          label: circle.isJoined ? 'Joined ✓' : 'Join Circle',
                          variant: circle.isJoined
                              ? UcButtonVariant.secondary
                              : UcButtonVariant.primary,
                          height: 36,
                          onPressed: () {
                            AppHaptics.light();
                            setState(() {
                              circle.isJoined = !circle.isJoined;
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(circle.isJoined
                                    ? 'Joined "${circle.topic}"'
                                    : 'Left "${circle.topic}"'),
                                duration: const Duration(seconds: 2),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: AppSpacing.xxl),
        ]),
      ),
    );
  }

  void _showProposeStudySlotSheet(BuildContext context, AppColors colors) {
    String selectedCourse = 'CSE-3101';
    final topicController = TextEditingController(text: 'Distributed Storage Consensus');
    String selectedRoom = 'Lab 4 (Available)';
    int maxPeers = 6;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.sheet)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return SafeArea(
              child: Padding(
                padding: EdgeInsets.only(
                  left: AppSpacing.xl,
                  right: AppSpacing.xl,
                  top: AppSpacing.xl,
                  bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.xl,
                ),
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
                      Text(
                        'Propose Peer Study Circle',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: colors.fg,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Collaborate on coursework with enrolled classmates',
                        style: TextStyle(fontSize: 13, color: colors.fgMuted),
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Course selector
                      Text(
                        'Target Course',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: colors.fg,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 8,
                        children: ['CSE-3101', 'CSE-3102', 'CSE-3205'].map((c) {
                          final isSel = selectedCourse == c;
                          return ChoiceChip(
                            label: Text(c),
                            selected: isSel,
                            onSelected: (val) {
                              if (val) {
                                setSheetState(() => selectedCourse = c);
                              }
                            },
                            selectedColor: colors.brandSoft,
                            labelStyle: TextStyle(
                              color: isSel ? colors.brand : colors.fg,
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Topic input
                      Text(
                        'Session Topic',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: colors.fg,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: topicController,
                        decoration: InputDecoration(
                          hintText: 'e.g. Exam Prep or Lab Exercise',
                          filled: true,
                          fillColor: colors.surface2,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            borderSide: BorderSide(color: colors.line),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Room selector
                      Text(
                        'Preferred Location / Slot',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: colors.fg,
                        ),
                      ),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        isExpanded: true,
                        initialValue: selectedRoom,
                        items: const [
                          DropdownMenuItem(
                            value: 'Lab 4 (Available)',
                            child: Text(
                              'Wednesday 03:00 PM – Lab 4',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Discussion Room 2',
                            child: Text(
                              'Thursday 04:00 PM – Discussion Room 2',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Central Library Room 102',
                            child: Text(
                              'Thursday 05:00 PM – Library Room 102',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          DropdownMenuItem(
                            value: 'Online Google Meet',
                            child: Text(
                              'Friday 10:00 AM – Online Meet',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                        onChanged: (val) {
                          if (val != null) {
                            setSheetState(() => selectedRoom = val);
                          }
                        },
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: colors.surface2,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            borderSide: BorderSide(color: colors.line),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Max peers stepper
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Max Peers Capacity',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: colors.fg,
                                  ),
                                ),
                                Text(
                                  'Recommended group size: 4 to 8 peers',
                                  style: TextStyle(
                                      fontSize: 11, color: colors.fgMuted),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline),
                                onPressed: maxPeers > 2
                                    ? () => setSheetState(() => maxPeers--)
                                    : null,
                              ),
                              Text(
                                '$maxPeers',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: colors.fg,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline),
                                onPressed: maxPeers < 12
                                    ? () => setSheetState(() => maxPeers++)
                                    : null,
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // Submit button
                      UcButton(
                        label: 'Publish Study Circle',
                        width: double.infinity,
                        onPressed: () {
                          AppHaptics.success();
                          setState(() {
                            _studyCircles.insert(
                              0,
                              _StudyCircleItem(
                                id: 'sc-${DateTime.now().millisecondsSinceEpoch}',
                                courseCode: selectedCourse,
                                topic: topicController.text.trim().isEmpty
                                    ? 'Group Study'
                                    : topicController.text.trim(),
                                timeAndRoom: selectedRoom,
                                host: 'Tanvir Ahmed',
                                currentPeers: 1,
                                maxPeers: maxPeers,
                                isJoined: true,
                              ),
                            );
                          });
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Study Circle proposed successfully!'),
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
      },
    );
  }
}
