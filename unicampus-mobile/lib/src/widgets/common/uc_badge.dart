import 'package:flutter/material.dart';
import '../../core/theme.dart';

enum UcBadgeVariant { neutral, brand, success, warning, danger }

class UcBadge extends StatelessWidget {
  final String label;
  final UcBadgeVariant variant;
  final IconData? icon;

  const UcBadge({
    super.key,
    required this.label,
    this.variant = UcBadgeVariant.neutral,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    Color bg;
    Color fg;

    switch (variant) {
      case UcBadgeVariant.neutral:
        bg = colors.surface2;
        fg = colors.fgMuted;
        break;
      case UcBadgeVariant.brand:
        bg = colors.brandSoft;
        fg = colors.brand;
        break;
      case UcBadgeVariant.success:
        bg = colors.successSoft;
        fg = colors.success;
        break;
      case UcBadgeVariant.warning:
        bg = colors.warningSoft;
        fg = colors.warning;
        break;
      case UcBadgeVariant.danger:
        bg = colors.dangerSoft;
        fg = colors.danger;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: 3.0,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.xs),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: fg),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: fg,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
