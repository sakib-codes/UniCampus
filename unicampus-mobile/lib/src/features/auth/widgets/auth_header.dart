import 'package:flutter/material.dart';
import '../../../widgets/brand_logo.dart';

class AuthHeader extends StatelessWidget {
  final bool showHelp;
  final VoidCallback? onHelpPressed;
  final bool showBack;
  final VoidCallback? onBackPressed;

  const AuthHeader({
    super.key,
    this.showHelp = false,
    this.onHelpPressed,
    this.showBack = false,
    this.onBackPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (showBack) ...[
                IconButton(
                  onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                  color: const Color(0xFF0F172A),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
                const SizedBox(width: 12),
              ],
              const BrandLogo(size: 38),
              const SizedBox(width: 10),
              const Text(
                'UniCampus',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.3,
                ),
              ),
            ],
          ),
          if (showHelp)
            GestureDetector(
              onTap: onHelpPressed ??
                  () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Contact IT desk: support@unicampus.edu'),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: const Color(0xFF605BFF),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    );
                  },
              child: const Text(
                'Need Help?',
                style: TextStyle(
                  color: Color(0xFF605BFF),
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
