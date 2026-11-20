enum UserRole {
  student,
  teacher,
  admin;

  String get label {
    switch (this) {
      case UserRole.student:
        return 'Student';
      case UserRole.teacher:
        return 'Faculty';
      case UserRole.admin:
        return 'Admin';
    }
  }

  String get badgeLabel {
    switch (this) {
      case UserRole.student:
        return 'STUDENT';
      case UserRole.teacher:
        return 'FACULTY';
      case UserRole.admin:
        return 'CAMPUS ADMIN';
    }
  }
}

class UserProfile {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final String department;
  final String campusId;
  final String avatarUrl;
  final String? designation;
  final String? batch;
  final double? cgpa;

  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.department,
    required this.campusId,
    required this.avatarUrl,
    this.designation,
    this.batch,
    this.cgpa,
  });

  static const studentDefault = UserProfile(
    id: 'usr_std_001',
    name: 'Tanvir Hossain',
    email: 'tanvir.cse@citycollege.edu.bd',
    role: UserRole.student,
    department: 'Computer Science & Engineering',
    campusId: '2023-1-60-042',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    batch: 'Batch 2023',
    cgpa: 3.84,
  );

  static const teacherDefault = UserProfile(
    id: 'usr_fac_001',
    name: 'Dr. Rafiqul Islam',
    email: 'rafiqul.cse@citycollege.edu.bd',
    role: UserRole.teacher,
    department: 'Computer Science & Engineering',
    campusId: 'T-CSE-104',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    designation: 'Associate Professor & Head of CSE',
  );

  static const adminDefault = UserProfile(
    id: 'usr_adm_001',
    name: 'Syed Muniruzzaman',
    email: 'admin.office@citycollege.edu.bd',
    role: UserRole.admin,
    department: 'Office of the Registrar',
    campusId: 'ADM-001',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    designation: 'SuperAdmin & Registrar',
  );
}
