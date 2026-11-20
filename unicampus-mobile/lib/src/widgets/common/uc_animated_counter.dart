import 'package:flutter/material.dart';
import '../../core/theme.dart';

/// High-performance animated numeric transition widget for metrics and counters.
///
/// Automatically animates between numeric values using [ImplicitlyAnimatedWidget]
/// and strictly applies [FontFeature.tabularFigures] for fixed-width glyphs,
/// eliminating horizontal jitter during transitions.
class UcAnimatedCounter extends ImplicitlyAnimatedWidget {
  /// Target numeric value to display and animate toward.
  final num value;

  /// Number of decimal digits to display (defaults to 0 for whole numbers).
  final int decimalPlaces;

  /// Optional prefix string (e.g. '$', '৳', '+').
  final String prefix;

  /// Optional suffix string (e.g. '%', ' Cr', ' min').
  final String suffix;

  /// Custom text style. If omitted, falls back to [AppTypography.metric].
  final TextStyle? style;

  const UcAnimatedCounter({
    super.key,
    required this.value,
    this.decimalPlaces = 0,
    this.prefix = '',
    this.suffix = '',
    this.style,
    super.duration = const Duration(milliseconds: 600),
    super.curve = Curves.easeOutCubic,
    super.onEnd,
  });

  @override
  AnimatedWidgetBaseState<UcAnimatedCounter> createState() =>
      _UcAnimatedCounterState();
}

class _UcAnimatedCounterState
    extends AnimatedWidgetBaseState<UcAnimatedCounter> {
  Tween<double>? _valueTween;

  @override
  void forEachTween(TweenVisitor<dynamic> visitor) {
    _valueTween = visitor(
      _valueTween,
      widget.value.toDouble(),
      (dynamic value) => Tween<double>(begin: (value as num).toDouble()),
    ) as Tween<double>?;
  }

  @override
  Widget build(BuildContext context) {
    final double evaluated =
        _valueTween?.evaluate(animation) ?? widget.value.toDouble();

    final String formattedNumber = widget.decimalPlaces > 0
        ? evaluated.toStringAsFixed(widget.decimalPlaces)
        : evaluated.round().toString();

    final baseStyle = widget.style ?? AppTypography.metric(context);
    final appliedStyle = baseStyle.copyWith(
      fontFeatures: [
        ...?baseStyle.fontFeatures,
        const FontFeature.tabularFigures(),
      ],
    );

    return Text(
      '${widget.prefix}$formattedNumber${widget.suffix}',
      style: appliedStyle,
    );
  }
}
