import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

/// Calm Campus Design System (Option A Indigo) Color Tokens
@immutable
class AppColors extends ThemeExtension<AppColors> {
  final Color canvas;
  final Color surface;
  final Color surface2;
  final Color line;
  final Color fg;
  final Color fgMuted;
  final Color fgSubtle;
  final Color brand;
  final Color brandHover;
  final Color brandSoft;
  final Color success;
  final Color successSoft;
  final Color warning;
  final Color warningSoft;
  final Color danger;
  final Color dangerSoft;

  const AppColors({
    required this.canvas,
    required this.surface,
    required this.surface2,
    required this.line,
    required this.fg,
    required this.fgMuted,
    required this.fgSubtle,
    required this.brand,
    required this.brandHover,
    required this.brandSoft,
    required this.success,
    required this.successSoft,
    required this.warning,
    required this.warningSoft,
    required this.danger,
    required this.dangerSoft,
  });

  static const light = AppColors(
    canvas: Color(0xFFF5F5FA),
    surface: Color(0xFFFFFFFF),
    surface2: Color(0xFFF2F2F8),
    line: Color(0xFFE7E7F0),
    fg: Color(0xFF14141B),
    fgMuted: Color(0xFF6B6E80),
    fgSubtle: Color(0xFF9A9CAD),
    brand: Color(0xFF605BFF),
    brandHover: Color(0xFF4E49EB),
    brandSoft: Color(0xFFEFEEFF),
    success: Color(0xFF12A150),
    successSoft: Color(0xFFE7F7EE),
    warning: Color(0xFFB45309),
    warningSoft: Color(0xFFFEF3C7),
    danger: Color(0xFFE5484D),
    dangerSoft: Color(0xFFFEECEE),
  );

  static const dark = AppColors(
    canvas: Color(0xFF0B0B10),
    surface: Color(0xFF15151D),
    surface2: Color(0xFF1C1C26),
    line: Color(0xFF262630),
    fg: Color(0xFFEDEDF3),
    fgMuted: Color(0xFF9C9CAE),
    fgSubtle: Color(0xFF6E6E80),
    brand: Color(0xFF7C78FF),
    brandHover: Color(0xFF918EFF),
    brandSoft: Color(0x237C78FF),
    success: Color(0xFF34D399),
    successSoft: Color(0x2334D399),
    warning: Color(0xFFFBBF24),
    warningSoft: Color(0x23FBBF24),
    danger: Color(0xFFF87171),
    dangerSoft: Color(0x23F87171),
  );

  @override
  AppColors copyWith({
    Color? canvas,
    Color? surface,
    Color? surface2,
    Color? line,
    Color? fg,
    Color? fgMuted,
    Color? fgSubtle,
    Color? brand,
    Color? brandHover,
    Color? brandSoft,
    Color? success,
    Color? successSoft,
    Color? warning,
    Color? warningSoft,
    Color? danger,
    Color? dangerSoft,
  }) {
    return AppColors(
      canvas: canvas ?? this.canvas,
      surface: surface ?? this.surface,
      surface2: surface2 ?? this.surface2,
      line: line ?? this.line,
      fg: fg ?? this.fg,
      fgMuted: fgMuted ?? this.fgMuted,
      fgSubtle: fgSubtle ?? this.fgSubtle,
      brand: brand ?? this.brand,
      brandHover: brandHover ?? this.brandHover,
      brandSoft: brandSoft ?? this.brandSoft,
      success: success ?? this.success,
      successSoft: successSoft ?? this.successSoft,
      warning: warning ?? this.warning,
      warningSoft: warningSoft ?? this.warningSoft,
      danger: danger ?? this.danger,
      dangerSoft: dangerSoft ?? this.dangerSoft,
    );
  }

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      canvas: Color.lerp(canvas, other.canvas, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surface2: Color.lerp(surface2, other.surface2, t)!,
      line: Color.lerp(line, other.line, t)!,
      fg: Color.lerp(fg, other.fg, t)!,
      fgMuted: Color.lerp(fgMuted, other.fgMuted, t)!,
      fgSubtle: Color.lerp(fgSubtle, other.fgSubtle, t)!,
      brand: Color.lerp(brand, other.brand, t)!,
      brandHover: Color.lerp(brandHover, other.brandHover, t)!,
      brandSoft: Color.lerp(brandSoft, other.brandSoft, t)!,
      success: Color.lerp(success, other.success, t)!,
      successSoft: Color.lerp(successSoft, other.successSoft, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      warningSoft: Color.lerp(warningSoft, other.warningSoft, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
      dangerSoft: Color.lerp(dangerSoft, other.dangerSoft, t)!,
    );
  }

  static AppColors of(BuildContext context) => context.appColors;
}

extension AppColorsExtension on BuildContext {
  AppColors get appColors =>
      Theme.of(this).extension<AppColors>() ?? AppColors.light;
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;
}

class AppRadius {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double sheet = 24.0;
  static const double pill = 999.0;

  static const BorderRadius roundedSm = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius roundedMd = BorderRadius.all(Radius.circular(md));
  static const BorderRadius roundedLg = BorderRadius.all(Radius.circular(lg));
  static const BorderRadius roundedXl = BorderRadius.all(Radius.circular(xl));
  static const BorderRadius roundedSheet =
      BorderRadius.vertical(top: Radius.circular(sheet));
  static const BorderRadius roundedPill =
      BorderRadius.all(Radius.circular(pill));
}

/// Calm Campus Elevation Tokens (Flat 1px card borders + subtle floating shadows)
class AppShadows {
  /// Subtle elevation token for floating action buttons, popovers, and sticky bars
  static List<BoxShadow> floating(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return isDark ? darkFloating : lightFloating;
  }

  /// Light mode 6% opacity shadow
  static const List<BoxShadow> lightFloating = [
    BoxShadow(
      blurRadius: 12,
      offset: Offset(0, 4),
      color: Color(0x0F000000),
    ),
  ];

  /// Dark mode 30% opacity shadow
  static const List<BoxShadow> darkFloating = [
    BoxShadow(
      blurRadius: 12,
      offset: Offset(0, 4),
      color: Color(0x4D000000),
    ),
  ];
}

/// Centralized tactile feedback helpers across mobile platforms
class AppHaptics {
  /// Light selection click for tab switches, segmented pills, chip taps
  static Future<void> selection() => HapticFeedback.selectionClick();

  /// Light impact for minor actions (copy to clipboard, pull-to-refresh trigger)
  static Future<void> light() => HapticFeedback.lightImpact();

  /// Medium impact for card taps, dialog actions, primary CTAs
  static Future<void> medium() => HapticFeedback.mediumImpact();

  /// Success or heavy impact for attendance confirmed, grade published, approve user
  static Future<void> success() => HapticFeedback.heavyImpact();
}

class AppTypography {
  static TextStyle display(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 28,
      fontWeight: FontWeight.w700,
      letterSpacing: -0.6,
      color: colors.fg,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
  }

  static TextStyle metric(
    BuildContext context, {
    double fontSize = 24,
    FontWeight fontWeight = FontWeight.w700,
    Color? color,
  }) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: -0.5,
      color: color ?? colors.fg,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
  }

  static TextStyle screenTitle(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 19,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.3,
      color: colors.fg,
    );
  }

  static TextStyle sectionHeader(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 15,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.2,
      color: colors.fg,
    );
  }

  static TextStyle cardTitle(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 15,
      fontWeight: FontWeight.w600,
      height: 1.3,
      letterSpacing: -0.2,
      color: colors.fg,
    );
  }

  static TextStyle body(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      height: 1.5,
      letterSpacing: -0.1,
      color: colors.fg,
    );
  }

  static TextStyle metadata(BuildContext context) {
    final colors = context.appColors;
    return GoogleFonts.inter(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.0,
      color: colors.fgMuted,
    );
  }

  static TextStyle microBadge(BuildContext context) {
    return GoogleFonts.inter(
      fontSize: 11,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.3,
    );
  }

  static TextStyle monospace(
    BuildContext context, {
    double fontSize = 13,
    FontWeight fontWeight = FontWeight.w600,
    Color? color,
  }) {
    final colors = context.appColors;
    return GoogleFonts.jetBrainsMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color ?? colors.fg,
      letterSpacing: 0.2,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
  }
}

class AppTheme {
  /// Reactive theme mode notifier for live theme switching
  static final ValueNotifier<ThemeMode> themeModeNotifier =
      ValueNotifier<ThemeMode>(ThemeMode.system);

  static ThemeMode get currentThemeMode => themeModeNotifier.value;
  static set currentThemeMode(ThemeMode mode) => themeModeNotifier.value = mode;
  // Legacy backward-compatible static constants
  static const Color primary = Color(0xFF605BFF);
  static const Color primaryLight = Color(0xFF8581FF);
  static const Color primaryDark = Color(0xFF4C47E6);

  static const Color bgLight = Color(0xFFF5F5FA);
  static const Color bgDark = Color(0xFF0B0B10);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color cardDark = Color(0xFF15151D);

  static const Color textPrimary = Color(0xFF14141B);
  static const Color textSecondary = Color(0xFF6B6E80);
  static const Color textMuted = Color(0xFF9A9CAD);

  static const Color accentAmber = Color(0xFFB45309);
  static const Color accentEmerald = Color(0xFF12A150);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: AppColors.light.canvas,
    primaryColor: AppColors.light.brand,
    colorScheme: ColorScheme.light(
      primary: AppColors.light.brand,
      secondary: AppColors.light.brandHover,
      surface: AppColors.light.surface,
      error: AppColors.light.danger,
      onPrimary: Colors.white,
      onSurface: AppColors.light.fg,
    ),
    extensions: const [AppColors.light],
    textTheme: GoogleFonts.interTextTheme(
      ThemeData.light().textTheme,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.light.surface,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: AppColors.light.fg),
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.light.fg,
      ),
    ),
    dividerTheme: DividerThemeData(
      color: AppColors.light.line,
      thickness: 1,
      space: 1,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.dark.canvas,
    primaryColor: AppColors.dark.brand,
    colorScheme: ColorScheme.dark(
      primary: AppColors.dark.brand,
      secondary: AppColors.dark.brandHover,
      surface: AppColors.dark.surface,
      error: AppColors.dark.danger,
      onPrimary: Colors.white,
      onSurface: AppColors.dark.fg,
    ),
    extensions: const [AppColors.dark],
    textTheme: GoogleFonts.interTextTheme(
      ThemeData.dark().textTheme,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.dark.surface,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: AppColors.dark.fg),
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.dark.fg,
      ),
    ),
    dividerTheme: DividerThemeData(
      color: AppColors.dark.line,
      thickness: 1,
      space: 1,
    ),
  );
}
