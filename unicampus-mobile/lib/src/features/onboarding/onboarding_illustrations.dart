import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class NoticesIllustration extends StatelessWidget {
  const NoticesIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      height: 240,
      child: ColorFiltered(
        colorFilter: const ColorFilter.mode(
          Color(0xFFF7F8FD),
          BlendMode.multiply,
        ),
        child: Lottie.asset('assets/lottie/rocket.lottie', fit: BoxFit.contain),
      ),
    );
  }
}

/// 2. Routine Illustration: Tilted Glass Cards with Amber Accent Dot
class RoutineIllustration extends StatelessWidget {
  const RoutineIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      height: 240,
      child: ColorFiltered(
        colorFilter: const ColorFilter.mode(
          Color(0xFFF7F8FD),
          BlendMode.multiply,
        ),
        child: Lottie.asset(
          'assets/lottie/routine.lottie',
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}

/// 3. Directory Illustration: Intersecting Concentric Rings & Purple Sphere
class DirectoryIllustration extends StatelessWidget {
  const DirectoryIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      height: 240,
      child: Lottie.asset(
        'assets/lottie/teacher.json',
        fit: BoxFit.contain,
        imageProviderFactory: (lottieImage) {
          return AssetImage('assets/lottie/images/${lottieImage.fileName}');
        },
      ),
    );
  }
}
