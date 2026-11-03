import 'package:flutter/material.dart';
import 'src/core/theme.dart';
import 'src/features/splash/splash_screen.dart';
import 'src/features/onboarding/onboarding_screen.dart';
import 'src/features/auth/login_screen.dart';
import 'src/features/auth/register_screen.dart';
import 'src/features/auth/forgot_password_screen.dart';
import 'src/features/auth/reset_password_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const UniCampusApp());
}

class UniCampusApp extends StatelessWidget {
  const UniCampusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UniCampus',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(initialDark: false, autoNavigate: true),
        '/splash-dark': (context) => const SplashScreen(initialDark: true, autoNavigate: true),
        '/onboarding': (context) => const OnboardingScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
        '/reset-password': (context) => const ResetPasswordScreen(),
      },
    );
  }
}
