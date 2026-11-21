import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/models/user_role.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _flipController;
  late final Animation<double> _flipAnimation;
  bool _showFront = true;

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _flipAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOutCubic),
    )..addListener(() {
        if (_flipAnimation.value >= 0.5 && _showFront) {
          setState(() => _showFront = false);
        } else if (_flipAnimation.value < 0.5 && !_showFront) {
          setState(() => _showFront = true);
        }
      });
  }

  @override
  void dispose() {
    _flipController.dispose();
    super.dispose();
  }

  void _toggleFlip() {
    AppHaptics.medium();
    if (_flipController.isCompleted) {
      _flipController.reverse();
    } else {
      _flipController.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    const user = UserProfile.studentDefault;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        title: const Text('Digital Student ID'),
        actions: [
          IconButton(
            icon: const Icon(Icons.flip_camera_android_outlined),
            tooltip: 'Flip ID Card',
            onPressed: _toggleFlip,
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: 'Share Card',
            onPressed: () {
              AppHaptics.light();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Student ID link copied to clipboard')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            // 3D Flippable Digital Identity Card
            GestureDetector(
              onTap: _toggleFlip,
              child: AnimatedBuilder(
                animation: _flipAnimation,
                builder: (context, child) {
                  final angle = _flipAnimation.value * pi;
                  final isUnder = _flipAnimation.value >= 0.5;

                  return Transform(
                    transform: Matrix4.identity()
                      ..setEntry(3, 2, 0.0012)
                      ..rotateY(angle),
                    alignment: Alignment.center,
                    child: isUnder
                        ? Transform(
                            transform: Matrix4.identity()..rotateY(pi),
                            alignment: Alignment.center,
                            child: _buildCardBack(context, colors, user),
                          )
                        : _buildCardFront(context, colors, user),
                  );
                },
              ),
            ),
            const SizedBox(height: AppSpacing.sm),

            // Hint Pill
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.touch_app_outlined, size: 14, color: colors.fgMuted),
                const SizedBox(width: 4),
                Flexible(
                  child: Text(
                    _showFront
                        ? 'Tap card to view Library Barcode & Wallet Pass ↺'
                        : 'Tap card to view Student Front ID ↻',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 11, color: colors.fgMuted),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: UcButton(
                    label: 'Flip Card',
                    icon: const Icon(Icons.sync, size: 18),
                    variant: UcButtonVariant.secondary,
                    onPressed: _toggleFlip,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: UcButton(
                    label: 'Add to Wallet',
                    icon: const Icon(Icons.wallet, size: 18),
                    onPressed: () {
                      AppHaptics.success();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Student Pass added to Apple / Google Wallet!'),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.xl),

            // Academic Registry Information
            _buildAcademicRegistryCard(colors),
            const SizedBox(height: AppSpacing.md),

            // Campus Affiliations
            _buildAffiliationsCard(colors),
            const SizedBox(height: AppSpacing.md),

            // Contact & Emergency Details
            _buildContactDetailsCard(context, colors),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildCardFront(
      BuildContext context, AppColors colors, UserProfile user) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.xl),
      borderRadius: AppRadius.xl,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: colors.brand,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Text(
                          'DCC',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'DHAKA CITY COLLEGE',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            'STUDENT SMART IDENTITY',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: colors.brand,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              UcBadge(
                label: 'VERIFIED',
                variant: UcBadgeVariant.success,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),

          // Student Photo Avatar
          UcAvatar(
            name: user.name,
            imageUrl: user.avatarUrl,
            size: 88,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            user.name,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: colors.fg,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            user.department,
            style: TextStyle(
              fontSize: 13,
              color: colors.fgMuted,
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Preserved Text Fixture
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: colors.surface2,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: colors.line),
            ),
            child: Text(
              'STUDENT ID: ${user.campusId}',
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: colors.brand,
                letterSpacing: 1.0,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // QR Code for Campus Gate
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: colors.line),
            ),
            child: const Icon(
              Icons.qr_code_2,
              size: 130,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Campus Gate & Library RFID Compliant',
            style: TextStyle(fontSize: 11, color: colors.fgSubtle),
          ),
        ],
      ),
    );
  }

  Widget _buildCardBack(
      BuildContext context, AppColors colors, UserProfile user) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.xl),
      borderRadius: AppRadius.xl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: colors.brand,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Text(
                          'DCC',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'DHAKA CITY COLLEGE',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: colors.fg,
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            'LIBRARY & SERVICES ACCESS',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: colors.brand,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              UcBadge(
                label: 'VALID THRU 2026',
                variant: UcBadgeVariant.brand,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),

          // Library Barcode Visual
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: colors.line),
            ),
            child: Column(
              children: [
                SizedBox(
                  height: 58,
                  width: double.infinity,
                  child: CustomPaint(
                    painter: _BarcodePainter(),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '*LIB-${user.campusId}*',
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.0,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Metadata key-values
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: colors.surface2,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: colors.line),
            ),
            child: Column(
              children: [
                _buildCardInfoRow('Cardholder Name', user.name, colors),
                const SizedBox(height: 6),
                _buildCardInfoRow('Issued', 'January 15, 2023', colors),
                const SizedBox(height: 6),
                _buildCardInfoRow('Expires', 'December 31, 2026', colors),
                const SizedBox(height: 6),
                _buildCardInfoRow('Blood Group', 'O (Positive)', colors),
                const SizedBox(height: 6),
                _buildCardInfoRow('Emergency Phone', '+880 1711-234567', colors),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Security & Issuing Notice
          Text(
            'This digital smart identity card is non-transferable and remains the official property of Dhaka City College.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10,
              color: colors.fgMuted,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardInfoRow(String label, String value, AppColors colors) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 11, color: colors.fgMuted),
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: colors.fg,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAcademicRegistryCard(AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Academic Registry',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: _buildRegistryItem('Department', 'CSE', colors),
              ),
              Expanded(
                child: _buildRegistryItem('Semester', '6th Semester', colors),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _buildRegistryItem('Section', 'Section A', colors),
              ),
              Expanded(
                child: _buildRegistryItem('Session', '2022–2023', colors),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _buildRegistryItem('Advisor', 'Dr. Mahmudul Hasan', colors),
              ),
              Expanded(
                child: _buildRegistryItem('Status', 'Active • Regular', colors),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRegistryItem(String label, String value, AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 11, color: colors.fgMuted),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: colors.fg,
          ),
        ),
      ],
    );
  }

  Widget _buildAffiliationsCard(AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Campus Affiliations',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          _buildAffiliationTile(
            title: 'Competitive Programming Wing',
            subtitle: 'Executive Member • Since 2024',
            icon: Icons.code,
            colors: colors,
          ),
          const Divider(),
          _buildAffiliationTile(
            title: 'UniCampus Robotics Club',
            subtitle: 'Active Member • Hardware Track',
            icon: Icons.precision_manufacturing_outlined,
            colors: colors,
          ),
        ],
      ),
    );
  }

  Widget _buildAffiliationTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required AppColors colors,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: colors.brandSoft,
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Icon(icon, size: 18, color: colors.brand),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: colors.fg,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 11, color: colors.fgMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactDetailsCard(BuildContext context, AppColors colors) {
    return UcCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Contact & Personal Details',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: colors.fg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          _buildCopyableRow(
            context: context,
            label: 'Institutional Email',
            value: 'tanvir.ahmed@student.dcc.edu.bd',
            colors: colors,
          ),
          const Divider(),
          _buildCopyableRow(
            context: context,
            label: 'Mobile Phone',
            value: '+880 1700-123456',
            colors: colors,
          ),
          const Divider(),
          _buildCopyableRow(
            context: context,
            label: 'Guardian Phone',
            value: '+880 1711-234567',
            colors: colors,
          ),
        ],
      ),
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

class _BarcodePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..strokeWidth = 1.0;

    // Pattern of barcode line widths (1, 2, 3, 4)
    final pattern = [
      3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1,
      4, 1, 2, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 3, 2, 1, 4, 1, 2,
      1, 3, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4,
    ];

    double currentX = 8.0;
    final totalWidth = size.width - 16.0;
    final step = totalWidth / pattern.length;

    for (int i = 0; i < pattern.length; i++) {
      if (i % 2 == 0) {
        final barWidth = pattern[i] * (step / 3.5);
        paint.strokeWidth = barWidth;
        canvas.drawLine(
          Offset(currentX, 0),
          Offset(currentX, size.height),
          paint,
        );
      }
      currentX += step;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
