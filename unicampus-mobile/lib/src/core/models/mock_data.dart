class NoticeItem {
  final String id;
  final String title;
  final String category;
  final String date;
  final String author;
  final String authorRole;
  final String content;
  final bool isPinned;
  final bool isUrgent;
  final String? attachmentName;
  final String? attachmentSize;

  const NoticeItem({
    required this.id,
    required this.title,
    required this.category,
    required this.date,
    required this.author,
    required this.authorRole,
    required this.content,
    this.isPinned = false,
    this.isUrgent = false,
    this.attachmentName,
    this.attachmentSize,
  });
}

class RoutineSlot {
  final String id;
  final String day;
  final String startTime;
  final String endTime;
  final String courseCode;
  final String courseTitle;
  final String room;
  final String teacher;
  final bool isLab;
  final String batch;

  const RoutineSlot({
    required this.id,
    required this.day,
    required this.startTime,
    required this.endTime,
    required this.courseCode,
    required this.courseTitle,
    required this.room,
    required this.teacher,
    this.isLab = false,
    this.batch = 'CSE-42',
  });
}

class CourseProgress {
  final String code;
  final String title;
  final double credits;
  final String grade;
  final double point;

  const CourseProgress({
    required this.code,
    required this.title,
    required this.credits,
    required this.grade,
    required this.point,
  });
}

class SemesterRecord {
  final String semester;
  final double gpa;
  final double credits;
  final List<CourseProgress> courses;

  const SemesterRecord({
    required this.semester,
    required this.gpa,
    required this.credits,
    required this.courses,
  });
}

class CourseMaterial {
  final String id;
  final String title;
  final String courseCode;
  final String courseTitle;
  final String fileType;
  final String fileSize;
  final String uploadedBy;
  final String uploadDate;
  final int downloadCount;

  const CourseMaterial({
    required this.id,
    required this.title,
    required this.courseCode,
    required this.courseTitle,
    required this.fileType,
    required this.fileSize,
    required this.uploadedBy,
    required this.uploadDate,
    this.downloadCount = 142,
  });
}

class PeerStudent {
  final String id;
  final String name;
  final String roll;
  final String department;
  final String batch;
  final String avatar;
  final bool isOnline;
  final String note;

  const PeerStudent({
    required this.id,
    required this.name,
    required this.roll,
    required this.department,
    required this.batch,
    required this.avatar,
    this.isOnline = false,
    this.note = '',
  });
}

class FacultyMember {
  final String id;
  final String name;
  final String designation;
  final String department;
  final String email;
  final String phone;
  final String room;
  final String status;
  final String avatar;
  final List<String> courses;
  final String officeHours;

  const FacultyMember({
    required this.id,
    required this.name,
    required this.designation,
    required this.department,
    required this.email,
    required this.phone,
    required this.room,
    required this.status,
    required this.avatar,
    required this.courses,
    required this.officeHours,
  });
}

class ChatMessage {
  final String id;
  final String senderId;
  final String text;
  final String timestamp;
  final bool isMe;
  final String status;
  final String? reaction;

  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.text,
    required this.timestamp,
    required this.isMe,
    this.status = 'seen',
    this.reaction,
  });
}

class Conversation {
  final String id;
  final String peerName;
  final String peerRole;
  final String avatar;
  final String lastMessage;
  final String timestamp;
  final int unreadCount;
  final bool isOnline;
  final bool isGroup;

  const Conversation({
    required this.id,
    required this.peerName,
    required this.peerRole,
    required this.avatar,
    required this.lastMessage,
    required this.timestamp,
    this.unreadCount = 0,
    this.isOnline = false,
    this.isGroup = false,
  });
}

class MockData {
  static const List<NoticeItem> notices = [
    NoticeItem(
      id: 'not_01',
      title: 'Fall 2026 Semester Final Examination Schedule Published',
      category: 'Exam',
      date: 'Today, 10:30 AM',
      author: 'Office of the Controller of Examinations',
      authorRole: 'Registrar',
      isPinned: true,
      isUrgent: true,
      content:
          'All students of BSc in CSE, BBA, and English are hereby notified that the Semester Final Examinations for Fall 2026 will commence on December 10, 2026. Admit cards must be collected from the department office by December 05 after clearing all dues.',
      attachmentName: 'Final_Exam_Routine_Fall2026.pdf',
      attachmentSize: '2.4 MB',
    ),
    NoticeItem(
      id: 'not_02',
      title: 'CSE-3101 Distributed Systems Lab 04 Assignment Due Date Extended',
      category: 'Academic',
      date: 'Yesterday, 4:15 PM',
      author: 'Dr. Rafiqul Islam',
      authorRole: 'Head of CSE',
      isPinned: true,
      isUrgent: false,
      content:
          'In response to student requests regarding network latency in the cloud testing sandbox, the submission deadline for Lab 04 (Raft Consensus Protocol implementation) has been extended to Friday, 11:59 PM.',
      attachmentName: 'Lab04_Submission_Guidelines.pdf',
      attachmentSize: '480 KB',
    ),
    NoticeItem(
      id: 'not_03',
      title: 'Annual Inter-University Tech Fest 2026 Registration Open',
      category: 'Events',
      date: 'Nov 18, 2026',
      author: 'DCC Computer Club (DCCC)',
      authorRole: 'Club Moderator',
      isPinned: false,
      isUrgent: false,
      content:
          'Registration is now open for HackDHAKA 2026, algorithmic programming contest, and robotic soccer showcase. Exciting prizes totaling 500,000 BDT await winning teams.',
    ),
    NoticeItem(
      id: 'not_04',
      title: 'Tuition Fee Payment Deadline for Semester 6',
      category: 'Finance',
      date: 'Nov 15, 2026',
      author: 'Accounts & Finance Division',
      authorRole: 'Accounts Officer',
      isPinned: false,
      isUrgent: false,
      content:
          'Please ensure tuition fee clearance through Nagad/bKash digital gateway or bank transfer to avoid late surcharges.',
    ),
  ];

  static const List<RoutineSlot> todayRoutine = [
    RoutineSlot(
      id: 'slot_01',
      day: 'Thursday',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      courseCode: 'CSE-3101',
      courseTitle: 'Distributed Systems',
      room: 'Room 502 (Academic Bldg 1)',
      teacher: 'Dr. Rafiqul Islam',
      isLab: false,
    ),
    RoutineSlot(
      id: 'slot_02',
      day: 'Thursday',
      startTime: '10:45 AM',
      endTime: '12:15 PM',
      courseCode: 'CSE-3103',
      courseTitle: 'Compiler Design & Automata',
      room: 'Room 604 (Main Annex)',
      teacher: 'Prof. Nusrat Jahan',
      isLab: false,
    ),
    RoutineSlot(
      id: 'slot_03',
      day: 'Thursday',
      startTime: '01:30 PM',
      endTime: '04:30 PM',
      courseCode: 'CSE-3102',
      courseTitle: 'Distributed Systems Lab',
      room: 'Software Lab 3 (4th Floor)',
      teacher: 'Engr. Tanvir Ahmed & Lab Team',
      isLab: true,
    ),
  ];

  static const List<SemesterRecord> academicHistory = [
    SemesterRecord(
      semester: 'Semester 5 (Current)',
      gpa: 3.88,
      credits: 19.5,
      courses: [
        CourseProgress(code: 'CSE-3101', title: 'Distributed Systems', credits: 3.0, grade: 'A+', point: 4.0),
        CourseProgress(code: 'CSE-3102', title: 'Distributed Systems Lab', credits: 1.5, grade: 'A+', point: 4.0),
        CourseProgress(code: 'CSE-3103', title: 'Compiler Design', credits: 3.0, grade: 'A', point: 3.75),
        CourseProgress(code: 'CSE-3104', title: 'Compiler Design Lab', credits: 1.5, grade: 'A+', point: 4.0),
        CourseProgress(code: 'CSE-3105', title: 'Computer Networks', credits: 3.0, grade: 'A', point: 3.75),
        CourseProgress(code: 'MATH-301', title: 'Numerical Methods', credits: 3.0, grade: 'A+', point: 4.0),
      ],
    ),
    SemesterRecord(
      semester: 'Semester 4',
      gpa: 3.82,
      credits: 21.0,
      courses: [
        CourseProgress(code: 'CSE-2201', title: 'Database Management Systems', credits: 3.0, grade: 'A+', point: 4.0),
        CourseProgress(code: 'CSE-2202', title: 'DBMS Lab', credits: 1.5, grade: 'A+', point: 4.0),
        CourseProgress(code: 'CSE-2203', title: 'Operating Systems', credits: 3.0, grade: 'A', point: 3.75),
        CourseProgress(code: 'CSE-2204', title: 'Operating Systems Lab', credits: 1.5, grade: 'A+', point: 4.0),
      ],
    ),
  ];

  static const List<CourseMaterial> materials = [
    CourseMaterial(
      id: 'mat_01',
      title: 'Lecture 08: Raft Consensus & Byzantine Fault Tolerance',
      courseCode: 'CSE-3101',
      courseTitle: 'Distributed Systems',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      uploadedBy: 'Dr. Rafiqul Islam',
      uploadDate: 'Nov 19, 2026',
    ),
    CourseMaterial(
      id: 'mat_02',
      title: 'LR(1) Parser Tables and Shift-Reduce Conflicts Guide',
      courseCode: 'CSE-3103',
      courseTitle: 'Compiler Design',
      fileType: 'SLIDES',
      fileSize: '7.8 MB',
      uploadedBy: 'Prof. Nusrat Jahan',
      uploadDate: 'Nov 17, 2026',
    ),
    CourseMaterial(
      id: 'mat_03',
      title: 'TCP Congestion Control & Sliding Window Animations',
      courseCode: 'CSE-3105',
      courseTitle: 'Computer Networks',
      fileType: 'ZIP',
      fileSize: '15.4 MB',
      uploadedBy: 'Asst. Prof. Kamrul Hasan',
      uploadDate: 'Nov 14, 2026',
    ),
  ];

  static const List<PeerStudent> peers = [
    PeerStudent(
      id: 'std_01',
      name: 'Sadia Afrin',
      roll: '2023-1-60-015',
      department: 'CSE',
      batch: 'Batch 2023',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isOnline: true,
      note: 'Studying for Compiler Midterm 📚',
    ),
    PeerStudent(
      id: 'std_02',
      name: 'Naimur Rahman',
      roll: '2023-1-60-022',
      department: 'CSE',
      batch: 'Batch 2023',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isOnline: true,
      note: 'Lab 4 Raft tests passing! 🚀',
    ),
    PeerStudent(
      id: 'std_03',
      name: 'Anika Tabassum',
      roll: '2023-1-60-038',
      department: 'CSE',
      batch: 'Batch 2023',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      isOnline: false,
      note: 'In Library',
    ),
  ];

  static const List<FacultyMember> faculty = [
    FacultyMember(
      id: 'fac_01',
      name: 'Dr. Rafiqul Islam',
      designation: 'Associate Professor & Head',
      department: 'Computer Science & Engineering',
      email: 'rafiqul.cse@citycollege.edu.bd',
      phone: '+880 1711-234567',
      room: 'Room 501, Academic Bldg 1',
      status: 'In Office',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      courses: ['CSE-3101 Distributed Systems', 'CSE-4200 Thesis Supervision'],
      officeHours: 'Sun, Tue, Thu: 2:00 PM - 4:00 PM',
    ),
    FacultyMember(
      id: 'fac_02',
      name: 'Prof. Nusrat Jahan',
      designation: 'Professor',
      department: 'Computer Science & Engineering',
      email: 'nusrat.jahan@citycollege.edu.bd',
      phone: '+880 1819-876543',
      room: 'Room 504, Academic Bldg 1',
      status: 'In Class',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      courses: ['CSE-3103 Compiler Design', 'CSE-2101 Formal Languages'],
      officeHours: 'Mon, Wed: 11:30 AM - 1:30 PM',
    ),
    FacultyMember(
      id: 'fac_03',
      name: 'Kamrul Hasan',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'kamrul.hasan@citycollege.edu.bd',
      phone: '+880 1912-345678',
      room: 'Room 408, Academic Bldg 1',
      status: 'Available',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      courses: ['CSE-3105 Computer Networks', 'CSE-3106 Networks Lab'],
      officeHours: 'Everyday: 3:00 PM - 4:30 PM',
    ),
  ];

  static const List<Conversation> conversations = [
    Conversation(
      id: 'conv_01',
      peerName: 'CSE-42 Study Circle',
      peerRole: 'Group • 38 Members',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      lastMessage: 'Sadia: Shared the revised compiler notes from lecture 9!',
      timestamp: '11:42 AM',
      unreadCount: 3,
      isOnline: true,
      isGroup: true,
    ),
    Conversation(
      id: 'conv_02',
      peerName: 'Dr. Rafiqul Islam',
      peerRole: 'Head of CSE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'Your thesis proposal looks solid. Let us review the draft tomorrow.',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isOnline: true,
    ),
    Conversation(
      id: 'conv_03',
      peerName: 'Naimur Rahman',
      peerRole: 'Batchmate • CSE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      lastMessage: 'Are we heading to Software Lab 3 early?',
      timestamp: 'Tuesday',
      unreadCount: 0,
      isOnline: false,
    ),
  ];

  static const List<ChatMessage> chatMessages = [
    ChatMessage(
      id: 'msg_01',
      senderId: 'fac_01',
      text: 'Good morning Tanvir. Have you reviewed the distributed consensus paper I sent?',
      timestamp: '10:15 AM',
      isMe: false,
      status: 'seen',
    ),
    ChatMessage(
      id: 'msg_02',
      senderId: 'me',
      text: 'Yes Sir! The Raft state machine replication section was very clear. I implemented the leader election logic in Lab 4.',
      timestamp: '10:18 AM',
      isMe: true,
      status: 'seen',
      reaction: '👍',
    ),
    ChatMessage(
      id: 'msg_03',
      senderId: 'fac_01',
      text: 'Excellent. Make sure you handle heartbeat timeout randomized intervals properly to avoid split votes.',
      timestamp: '10:22 AM',
      isMe: false,
      status: 'seen',
    ),
    ChatMessage(
      id: 'msg_04',
      senderId: 'me',
      text: 'Understood Sir, configured between 150ms and 300ms. Will demonstrate in lab today.',
      timestamp: '10:24 AM',
      isMe: true,
      status: 'delivered',
    ),
  ];
}
