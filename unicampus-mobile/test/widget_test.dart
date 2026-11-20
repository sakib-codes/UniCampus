import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unicampus_mobile/main.dart';
import 'package:unicampus_mobile/src/core/theme.dart';
import 'package:unicampus_mobile/src/widgets/common/uc_avatar.dart';

void main() {
  setUpAll(() {
    UcAvatar.isTestMode = true;
  });

  testWidgets('UniCampusApp boots directly into portal', (WidgetTester tester) async {
    await tester.pumpWidget(const UniCampusApp());
    await tester.pumpAndSettle();

    // Verify Student Portal loads
    expect(find.text('Student Portal'), findsOneWidget);
    expect(find.text('STUDENT'), findsOneWidget);
  });

  test('Calm Campus Design System tokens adhere strictly to Calm Campus Option A', () {
    expect(AppColors.light.canvas, const Color(0xFFF5F5FA));
    expect(AppColors.dark.canvas, const Color(0xFF0B0B10));
    expect(AppColors.light.brand, const Color(0xFF605BFF));
    expect(AppColors.dark.brand, const Color(0xFF7C78FF));
    expect(AppColors.light.surface, const Color(0xFFFFFFFF));
    expect(AppColors.dark.surface, const Color(0xFF15151D));
    expect(AppColors.light.line, const Color(0xFFE7E7F0));
    expect(AppColors.dark.line, const Color(0xFF262630));
  });

  test('AppTheme loads AppColors extension in both Light and Dark themes', () {
    final lightColors = AppTheme.lightTheme.extension<AppColors>();
    final darkColors = AppTheme.darkTheme.extension<AppColors>();

    expect(lightColors, isNotNull);
    expect(darkColors, isNotNull);
    expect(lightColors!.brand, AppColors.light.brand);
    expect(darkColors!.brand, AppColors.dark.brand);
  });
}
