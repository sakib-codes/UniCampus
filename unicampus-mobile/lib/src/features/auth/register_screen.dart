import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:ui';
import 'package:animations/animations.dart';
import '../../widgets/brand_logo.dart';
import 'widgets/auth_text_field.dart';

enum UserRole { student, teacher }

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  
  final TextEditingController _rollNoController = TextEditingController();
  final TextEditingController _departmentController = TextEditingController();
  final TextEditingController _semesterController = TextEditingController();
  final TextEditingController _designationController = TextEditingController();

  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  
  int _currentStep = 0; // 0: Role, 1: Info, 2: Academic, 3: Password
  bool _isGoingBack = false;
  UserRole _role = UserRole.student;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _rollNoController.dispose();
    _departmentController.dispose();
    _semesterController.dispose();
    _designationController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _nextStep() {
    setState(() {
      _isGoingBack = false;
      _currentStep++;
    });
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() {
        _isGoingBack = true;
        _currentStep--;
      });
    } else {
      Navigator.of(context).pop();
    }
  }

  void _handleRegister() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Account created successfully!'),
        backgroundColor: const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    );
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FD),
      body: SafeArea(
        child: Column(
          children: [
            // Custom Back Navigation
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Align(
                alignment: Alignment.centerLeft,
                child: ClipOval(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.4),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.6),
                          width: 1.2,
                        ),
                      ),
                      child: IconButton(
                        onPressed: _prevStep,
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                        color: const Color(0xFF0F172A),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Main Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 12),
                    
                    // App Logo
                    const BrandLogo(size: 96, withOuterContainer: true),
                    const SizedBox(height: 24),
                    
                    // Welcome Text
                    const Text(
                      'Join UniCampus',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Content area - conditionally wrapped
                    if (_currentStep == 0)
                      // Role selection renders WITHOUT the outer white card
                      PageTransitionSwitcher(
                        duration: const Duration(milliseconds: 400),
                        reverse: _isGoingBack,
                        transitionBuilder: (
                          Widget child,
                          Animation<double> animation,
                          Animation<double> secondaryAnimation,
                        ) {
                          return SharedAxisTransition(
                            animation: animation,
                            secondaryAnimation: secondaryAnimation,
                            transitionType: SharedAxisTransitionType.horizontal,
                            fillColor: Colors.transparent,
                            child: child,
                          );
                        },
                        child: _buildCurrentStep(),
                      )
                    else
                      // Other steps render inside the white card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF605BFF).withValues(alpha: 0.06),
                              blurRadius: 30,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: PageTransitionSwitcher(
                          duration: const Duration(milliseconds: 400),
                          reverse: _isGoingBack,
                          transitionBuilder: (
                            Widget child,
                            Animation<double> animation,
                            Animation<double> secondaryAnimation,
                          ) {
                            return SharedAxisTransition(
                              animation: animation,
                              secondaryAnimation: secondaryAnimation,
                              transitionType: SharedAxisTransitionType.horizontal,
                              fillColor: Colors.white,
                              child: child,
                            );
                          },
                          child: _buildCurrentStep(),
                        ),
                      ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentStep() {
    switch (_currentStep) {
      case 0:
        return _buildRoleSelectionStep();
      case 1:
        return _buildInfoStep();
      case 2:
        return _buildAcademicStep();
      case 3:
      default:
        return _buildPasswordStep();
    }
  }

  Widget _buildRoleSelectionStep() {
    return Column(
      key: const ValueKey('role_step'),
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Text(
          'Choose your role',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 36),
        
        Row(
          children: [
            Expanded(child: _buildRoleCard(
              role: UserRole.student,
              imagePath: 'assets/images/role_student.png',
              label: 'Student',
            )),
            const SizedBox(width: 16),
            Expanded(child: _buildRoleCard(
              role: UserRole.teacher,
              imagePath: 'assets/images/role_teacher.png',
              label: 'Teacher',
            )),
          ],
        ),
        const SizedBox(height: 36),
        
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: _nextStep,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF605BFF),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Text(
              'Continue',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
          ),
        ),),
      ],
    );
  }

  Widget _buildRoleCard({
    required UserRole role,
    required String imagePath,
    required String label,
  }) {
    final bool isSelected = _role == role;

    return GestureDetector(
      onTap: () => setState(() => _role = role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF605BFF) : const Color(0xFFE2E8F0),
            width: isSelected ? 2.0 : 1.0,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF605BFF).withValues(alpha: 0.12),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Column(
          children: [
            const SizedBox(height: 8),
            // Illustration
            Image.asset(
              imagePath,
              width: 76,
              height: 76,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 16),
            // Label
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: isSelected
                    ? const Color(0xFF605BFF)
                    : const Color(0xFF0F172A),
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 16),
            // Selection indicator pill
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: isSelected ? 40 : 24,
              height: 4,
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF605BFF)
                    : const Color(0xFFE2E8F0),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 4),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoStep() {
    return Column(
      key: const ValueKey('info_step'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Center(
          child: Text(
            'Basic Info',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
        const SizedBox(height: 32),
        
        AuthTextField(
          label: 'Full Name',
          hintText: 'Enter full name',
          controller: _fullNameController,
        ),
        const SizedBox(height: 16),

        AuthTextField(
          label: 'Email Address',
          hintText: 'Enter email address',
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 28),
        
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              if (_fullNameController.text.isNotEmpty && _emailController.text.isNotEmpty) {
                _nextStep();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please fill in all fields')),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF605BFF),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Text(
              'Continue',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 28),
        _buildFooter(),
      ],
    );
  }

  Widget _buildAcademicStep() {
    return Column(
      key: const ValueKey('academic_step'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            _role == UserRole.student ? 'Student Portal' : 'Teacher Portal',
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
        const SizedBox(height: 32),

        if (_role == UserRole.student) ...[
          AuthTextField(
            label: 'Roll Number',
            hintText: 'e.g. 2021CS01',
            controller: _rollNoController,
          ),
          const SizedBox(height: 16),
          AuthTextField(
            label: 'Department',
            hintText: 'e.g. Computer Science',
            controller: _departmentController,
          ),
          const SizedBox(height: 16),
          AuthTextField(
            label: 'Semester',
            hintText: 'e.g. 5th',
            controller: _semesterController,
          ),
        ] else ...[
          AuthTextField(
            label: 'Department',
            hintText: 'e.g. Computer Science',
            controller: _departmentController,
          ),
          const SizedBox(height: 16),
          AuthTextField(
            label: 'Designation',
            hintText: 'e.g. Assistant Professor',
            controller: _designationController,
          ),
        ],
        const SizedBox(height: 28),
        
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              _nextStep();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF605BFF),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Text(
              'Continue',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 28),
        _buildFooter(),
      ],
    );
  }

  Widget _buildPasswordStep() {
    return Column(
      key: const ValueKey('password_step'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Center(
          child: Text(
            'Set Password',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
        const SizedBox(height: 32),
        
        AuthTextField(
          label: 'New Password',
          hintText: 'New password',
          controller: _passwordController,
          isPassword: true,
        ),
        const SizedBox(height: 16),
        
        AuthTextField(
          label: 'Confirm Password',
          hintText: 'Confirm password',
          controller: _confirmPasswordController,
          isPassword: true,
        ),
        const SizedBox(height: 28),
        
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: _handleRegister,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF605BFF),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Text(
              'Create Account',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 28),
        _buildFooter(),
      ],
    );
  }

  Widget _buildFooter() {
    return Column(
      children: [
        Center(
          child: GestureDetector(
            onTap: () {
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
            child: RichText(
              text: const TextSpan(
                text: "Already have an account? ",
                style: TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
                children: [
                  TextSpan(
                    text: 'Sign In',
                    style: TextStyle(
                      color: Color(0xFF334155),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        
        Row(
          children: [
            Expanded(child: Container(height: 1, color: const Color(0xFFF1F5F9))),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 14),
              child: Text(
                'Or',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ),
            Expanded(child: Container(height: 1, color: const Color(0xFFF1F5F9))),
          ],
        ),
        const SizedBox(height: 24),
        
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildCircularSocialIcon(),
          ],
        ),
      ],
    );
  }

  Widget _buildCircularSocialIcon() {
    return Container(
      width: 52,
      height: 52,
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Image.asset(
          'assets/images/google_logo.png',
          width: 28,
          height: 28,
        ),
      ),
    );
  }
}
