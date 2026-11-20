import 'package:flutter/material.dart';
import '../../core/theme.dart';

class UcCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderRadius;
  final bool border;

  const UcCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.lg),
    this.margin,
    this.onTap,
    this.backgroundColor,
    this.borderColor,
    this.borderRadius = AppRadius.lg,
    this.border = true,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final bg = backgroundColor ?? colors.surface;
    final borderSide = border
        ? BorderSide(color: borderColor ?? colors.line, width: 1.0)
        : BorderSide.none;

    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(borderRadius),
      side: borderSide,
    );

    final content = Container(
      padding: padding,
      child: child,
    );

    return Container(
      margin: margin,
      child: Material(
        color: bg,
        shape: shape,
        clipBehavior: Clip.antiAlias,
        child: onTap != null
            ? InkWell(
                onTap: onTap,
                splashColor: colors.brandSoft,
                highlightColor: colors.surface2,
                child: content,
              )
            : content,
      ),
    );
  }
}
