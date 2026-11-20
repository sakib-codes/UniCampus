import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/theme.dart';

/// Full-featured camera scan viewfinder overlay with animated laser bar,
/// 260×260dp corner framing reticles, flashlight toggle, and auto-dismissing toast.
///
/// Supports headless test mode for widget test environments without real camera hardware.
class UcViewfinderScanner extends StatefulWidget {
  /// Callback when user dismisses the scanner.
  final VoidCallback onClose;

  /// Callback when a QR/Barcode payload is scanned.
  final ValueChanged<String> onScanned;

  /// Header title for the scanner screen.
  final String title;

  /// Optional instructional subtitle.
  final String? subtitle;

  /// Fallback payload emitted by test mode or simulated scan button.
  final String simulatedScanPayload;

  /// Static flag to disable infinite animations in widget test environments.
  static bool isTestMode = false;

  const UcViewfinderScanner({
    super.key,
    required this.onClose,
    required this.onScanned,
    this.title = 'Scan Attendance QR',
    this.subtitle,
    this.simulatedScanPayload = '2023-1-60-042',
  });

  @override
  State<UcViewfinderScanner> createState() => _UcViewfinderScannerState();
}

class _UcViewfinderScannerState extends State<UcViewfinderScanner>
    with TickerProviderStateMixin {
  late final AnimationController _laserController;
  late final AnimationController _pulseController;
  late final Animation<double> _laserAnimation;
  late final Animation<double> _pulseAnimation;

  bool _isTorchOn = false;
  String? _recentScannedPayload;
  Timer? _toastDismissTimer;

  static const double _viewfinderSize = 260.0;

  @override
  void initState() {
    super.initState();

    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _laserAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _laserController, curve: Curves.easeInOut),
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // Only start infinite repeating animations outside of widget test mode
    // to prevent tester.pumpAndSettle() timeouts.
    if (!UcViewfinderScanner.isTestMode) {
      _laserController.repeat(reverse: true);
      _pulseController.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _toastDismissTimer?.cancel();
    _laserController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _triggerScan(String payload) {
    AppHaptics.success();
    setState(() {
      _recentScannedPayload = payload;
    });

    widget.onScanned(payload);

    _toastDismissTimer?.cancel();
    _toastDismissTimer = Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        setState(() {
          _recentScannedPayload = null;
        });
      }
    });
  }

  void _toggleTorch() {
    AppHaptics.light();
    setState(() {
      _isTorchOn = !_isTorchOn;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            // Dark Camera Simulation Viewport
            Positioned.fill(
              child: Container(
                color: _isTorchOn
                    ? const Color(0xFF1E1E28)
                    : const Color(0xFF0D0D14),
                child: Center(
                  child: Opacity(
                    opacity: 0.05,
                    child: Icon(
                      Icons.qr_code_2,
                      size: _viewfinderSize * 0.85,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),

            // Top Control Bar
            Positioned(
              top: 12,
              left: 16,
              right: 16,
              child: Row(
                children: [
                  // Close Button
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 24),
                    tooltip: 'Close Scanner',
                    onPressed: widget.onClose,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      widget.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                        letterSpacing: -0.3,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  // Torch Toggle Button
                  IconButton(
                    icon: Icon(
                      _isTorchOn ? Icons.flash_on : Icons.flash_off,
                      color: _isTorchOn ? const Color(0xFFFBBF24) : Colors.white70,
                      size: 24,
                    ),
                    tooltip: 'Toggle Flashlight',
                    onPressed: _toggleTorch,
                  ),
                ],
              ),
            ),

            // Center Viewfinder with Corner Framing Reticles & Laser Scan Bar
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedBuilder(
                    animation: Listenable.merge([_laserAnimation, _pulseAnimation]),
                    builder: (context, _) {
                      return SizedBox(
                        width: _viewfinderSize,
                        height: _viewfinderSize,
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            // 260×260dp Corner Framing Reticles
                            CustomPaint(
                              size: const Size(_viewfinderSize, _viewfinderSize),
                              painter: _ReticlePainter(
                                color: colors.brand,
                                pulseScale: _pulseAnimation.value,
                              ),
                            ),

                            // Animated Laser Line Bar
                            Positioned(
                              top: (_viewfinderSize - 20) * _laserAnimation.value + 10,
                              left: 12,
                              right: 12,
                              child: Container(
                                height: 3.0,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(2),
                                  gradient: LinearGradient(
                                    colors: [
                                      colors.brand.withValues(alpha: 0.0),
                                      colors.brand,
                                      Colors.white,
                                      colors.brand,
                                      colors.brand.withValues(alpha: 0.0),
                                    ],
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: colors.brand.withValues(alpha: 0.7),
                                      blurRadius: 8.0,
                                      spreadRadius: 2.0,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                  // Instruction Hint
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      widget.subtitle ??
                          'Align QR code within the frame to verify attendance',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.white.withValues(alpha: 0.75),
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Bottom Actions & Headless Simulation Trigger
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Auto-dismissing Verification Toast Banner
                  if (_recentScannedPayload != null)
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 250),
                      opacity: 1.0,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF15151D),
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          border: Border.all(
                            color: colors.success.withValues(alpha: 0.5),
                            width: 1.0,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x66000000),
                              blurRadius: 16,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: colors.successSoft,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.check_rounded,
                                color: colors.success,
                                size: 16,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Flexible(
                              child: Text(
                                '✓ $_recentScannedPayload Marked Present',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                  // Simulated Scan Trigger (Useful for testing & headless environments)
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.brand,
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                    ),
                    icon: const Icon(Icons.qr_code_scanner, size: 20),
                    label: const Text(
                      'Simulate Scan',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
                    onPressed: () => _triggerScan(widget.simulatedScanPayload),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Custom painter for the 4 corner framing reticle brackets.
class _ReticlePainter extends CustomPainter {
  final Color color;
  final double pulseScale;

  const _ReticlePainter({
    required this.color,
    required this.pulseScale,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final strokeWidth = 3.5 * pulseScale;
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    const cornerLength = 32.0;
    const radius = 8.0;

    // Top-Left Corner
    final pathTL = Path()
      ..moveTo(0, cornerLength)
      ..lineTo(0, radius)
      ..arcToPoint(const Offset(radius, 0),
          radius: const Radius.circular(radius))
      ..lineTo(cornerLength, 0);
    canvas.drawPath(pathTL, paint);

    // Top-Right Corner
    final pathTR = Path()
      ..moveTo(size.width - cornerLength, 0)
      ..lineTo(size.width - radius, 0)
      ..arcToPoint(Offset(size.width, radius),
          radius: const Radius.circular(radius))
      ..lineTo(size.width, cornerLength);
    canvas.drawPath(pathTR, paint);

    // Bottom-Left Corner
    final pathBL = Path()
      ..moveTo(0, size.height - cornerLength)
      ..lineTo(0, size.height - radius)
      ..arcToPoint(Offset(radius, size.height),
          radius: const Radius.circular(radius))
      ..lineTo(cornerLength, size.height);
    canvas.drawPath(pathBL, paint);

    // Bottom-Right Corner
    final pathBR = Path()
      ..moveTo(size.width - cornerLength, size.height)
      ..lineTo(size.width - radius, size.height)
      ..arcToPoint(Offset(size.width, size.height - radius),
          radius: const Radius.circular(radius))
      ..lineTo(size.width, size.height - cornerLength);
    canvas.drawPath(pathBR, paint);
  }

  @override
  bool shouldRepaint(covariant _ReticlePainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.pulseScale != pulseScale;
  }
}
