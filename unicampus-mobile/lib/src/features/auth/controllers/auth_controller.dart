import 'package:flutter/material.dart';
import '../../../core/models/user_role.dart';

class AuthController extends ChangeNotifier {
  static final AuthController instance = AuthController._internal();
  AuthController._internal();

  UserRole _currentRole = UserRole.student;
  UserProfile _user = UserProfile.studentDefault;
  bool _isAuthenticated = true;

  UserRole get currentRole => _currentRole;
  UserProfile get user => _user;
  bool get isAuthenticated => _isAuthenticated;

  void switchRole(UserRole role) {
    if (_currentRole == role) return;
    _currentRole = role;
    switch (role) {
      case UserRole.student:
        _user = UserProfile.studentDefault;
        break;
      case UserRole.teacher:
        _user = UserProfile.teacherDefault;
        break;
      case UserRole.admin:
        _user = UserProfile.adminDefault;
        break;
    }
    notifyListeners();
  }

  void login(UserRole role) {
    _isAuthenticated = true;
    switchRole(role);
  }

  void logout() {
    _isAuthenticated = false;
    notifyListeners();
  }
}
