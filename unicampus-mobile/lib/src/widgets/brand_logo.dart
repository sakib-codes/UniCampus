import 'package:flutter/material.dart';

class BrandLogo extends StatelessWidget {
  final double size;
  final bool isDark;
  final bool withOuterContainer;

  const BrandLogo({
    super.key,
    this.size = 56,
    this.isDark = false,
    this.withOuterContainer = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget logo = Image.asset(
      'assets/images/unicampus_logo.png',
      width: size,
      height: size,
      fit: BoxFit.contain,
    );

    if (!withOuterContainer) {
      return logo;
    }

    final double outerSize = size * 1.5;

    return SizedBox(
      width: outerSize,
      height: outerSize,
      child: Center(
        child: logo,
      ),
    );
  }
}
