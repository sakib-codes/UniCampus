import 'package:flutter/material.dart';
import '../../core/theme.dart';

class UcAvatar extends StatelessWidget {
  static bool isTestMode = false;

  final String? name;
  final String? imageUrl;
  final double size;
  final bool showOnlineDot;
  final bool isOnline;

  const UcAvatar({
    super.key,
    this.name,
    this.imageUrl,
    this.size = 40.0,
    this.showOnlineDot = false,
    this.isOnline = false,
  });

  String get _initials {
    if (name == null || name!.isEmpty) return 'U';
    final parts = name!.trim().split(' ');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    Widget avatarCore;
    if (!isTestMode && imageUrl != null && imageUrl!.isNotEmpty) {
      avatarCore = ClipRRect(
        borderRadius: BorderRadius.circular(size / 2),
        child: Image.network(
          imageUrl!,
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => _buildFallback(colors),
        ),
      );
    } else {
      avatarCore = _buildFallback(colors);
    }

    if (!showOnlineDot) return avatarCore;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        avatarCore,
        Positioned(
          right: 0,
          bottom: 0,
          child: Container(
            width: size * 0.28,
            height: size * 0.28,
            decoration: BoxDecoration(
              color: isOnline ? colors.success : colors.fgSubtle,
              shape: BoxShape.circle,
              border: Border.all(
                color: colors.surface,
                width: 2.0,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFallback(AppColors colors) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: colors.brandSoft,
        shape: BoxShape.circle,
        border: Border.all(
          color: colors.brand.withValues(alpha: 0.3),
          width: 1.0,
        ),
      ),
      child: Center(
        child: Text(
          _initials,
          style: TextStyle(
            fontSize: size * 0.38,
            fontWeight: FontWeight.w700,
            color: colors.brand,
          ),
        ),
      ),
    );
  }
}
