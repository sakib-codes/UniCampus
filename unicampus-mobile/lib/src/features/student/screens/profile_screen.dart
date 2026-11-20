import 'package:flutter/material.dart';
import '../../../core/models/user_role.dart';
import '../../../core/theme.dart';
import '../../../widgets/common/uc_avatar.dart';
import '../../../widgets/common/uc_badge.dart';
import '../../../widgets/common/uc_button.dart';
import '../../../widgets/common/uc_card.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

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
            icon: const Icon(Icons.share_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            // Digital Identity Card
            UcCard(
              padding: const EdgeInsets.all(AppSpacing.xl),
              borderRadius: AppRadius.xl,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: colors.brand,
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Text(
                                'DCC',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'DHAKA CITY COLLEGE',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: colors.fg,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              Text(
                                'STUDENT SMART IDENTITY',
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: colors.brand,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      UcBadge(
                        label: 'VERIFIED',
                        variant: UcBadgeVariant.success,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xl),
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
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
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
                  // QR Identity Code
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
            ),
            const SizedBox(height: AppSpacing.lg),
            UcButton(
              label: 'Add to Apple Wallet / Google Pay',
              icon: const Icon(Icons.wallet, size: 18),
              variant: UcButtonVariant.secondary,
              width: double.infinity,
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }
}
