import 'package:flutter/material.dart';
import '../../core/theme.dart';

enum UcButtonVariant { primary, secondary, outline, ghost, danger }

class UcButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final UcButtonVariant variant;
  final bool isLoading;
  final double height;
  final double? width;
  final double borderRadius;

  const UcButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = UcButtonVariant.primary,
    this.isLoading = false,
    this.height = 48.0,
    this.width,
    this.borderRadius = AppRadius.md,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case UcButtonVariant.primary:
        bg = colors.brand;
        fg = Colors.white;
        break;
      case UcButtonVariant.secondary:
        bg = colors.surface2;
        fg = colors.fg;
        break;
      case UcButtonVariant.outline:
        bg = Colors.transparent;
        fg = colors.fg;
        border = BorderSide(color: colors.line, width: 1.0);
        break;
      case UcButtonVariant.ghost:
        bg = Colors.transparent;
        fg = colors.brand;
        break;
      case UcButtonVariant.danger:
        bg = colors.danger;
        fg = Colors.white;
        break;
    }

    Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading)
          SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fg),
            ),
          )
        else ...[
          if (icon != null) ...[
            icon!,
            const SizedBox(width: AppSpacing.sm),
          ],
          Flexible(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: fg,
              ),
            ),
          ),
        ],
      ],
    );

    return SizedBox(
      height: height,
      width: width,
      child: Material(
        color: onPressed == null ? bg.withValues(alpha: 0.5) : bg,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          side: border,
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: (isLoading || onPressed == null) ? null : onPressed,
          splashColor: colors.brandSoft,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Center(child: content),
          ),
        ),
      ),
    );
  }
}
