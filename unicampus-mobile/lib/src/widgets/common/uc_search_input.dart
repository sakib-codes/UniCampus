import 'package:flutter/material.dart';
import '../../core/theme.dart';

class UcSearchInput extends StatelessWidget {
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final String hintText;

  const UcSearchInput({
    super.key,
    this.controller,
    this.onChanged,
    this.onClear,
    this.hintText = 'Search notices, routine, teachers...',
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: colors.line, width: 1.0),
      ),
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        style: TextStyle(fontSize: 14, color: colors.fg),
        decoration: InputDecoration(
          prefixIcon: Icon(Icons.search, size: 20, color: colors.fgMuted),
          suffixIcon: (controller?.text.isNotEmpty ?? false)
              ? IconButton(
                  icon: Icon(Icons.close, size: 18, color: colors.fgMuted),
                  onPressed: onClear,
                )
              : null,
          hintText: hintText,
          hintStyle: TextStyle(fontSize: 13, color: colors.fgSubtle),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            vertical: AppSpacing.sm,
            horizontal: AppSpacing.md,
          ),
        ),
      ),
    );
  }
}
