/**
 * UniCampus Teacher Service
 * Manages courses, live attendance sessions, gradebooks, and teaching timetables.
 * Persists changes in localStorage for interactive state retention.
 */

export interface TeacherCourse {
  id: string;
  code: string;
  title: string;
  credit: number;
  department: string;
  semester: string;
  section: string;
  room: string;
  enrolledCount: number;
  avgAttendance: number;
  syllabusProgress: number;
  nextSession: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentAttendanceRecord {
  studentId: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  section: string;
  date: string;
  period: string;
  topic: string;
  records: StudentAttendanceRecord[];
}

export interface StudentGradeRecord {
  studentId: string;
  name: string;
  attendance: number; // Max 10
  quiz: number;       // Max 15
  midterm: number;    // Max 25
  final: number;      // Max 30
  lab: number;        // Max 20
  total: number;      // Max 100
  letterGrade: string;
  gpa: number;
  isSubmitted: boolean;
}

export interface TeacherTimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  section: string;
  type: 'Theory' | 'Lab' | 'Consultation';
}

const INITIAL_TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'course-1',
    code: 'CSE-311',
    title: 'Database Management Systems',
    credit: 3.0,
    department: 'CSE',
    semester: '6th Semester',
    section: 'Sec-A',
    room: 'RM-402',
    enrolledCount: 48,
    avgAttendance: 91.5,
    syllabusProgress: 68,
    nextSession: 'Today, 10:00 AM - 11:30 AM',
  },
  {
    id: 'course-2',
    code: 'CSE-401',
    title: 'Artificial Intelligence & Neural Nets',
    credit: 3.0,
    department: 'CSE',
    semester: '7th Semester',
    section: 'Sec-B',
    room: 'RM-303',
    enrolledCount: 42,
    avgAttendance: 87.2,
    syllabusProgress: 52,
    nextSession: 'Monday, 09:00 AM - 10:30 AM',
  },
  {
    id: 'course-3',
    code: 'CSE-402',
    title: 'AI & Deep Learning Lab',
    credit: 1.5,
    department: 'CSE',
    semester: '7th Semester',
    section: 'Lab-1',
    room: 'LAB-03',
    enrolledCount: 36,
    avgAttendance: 94.0,
    syllabusProgress: 60,
    nextSession: 'Wednesday, 01:00 PM - 03:30 PM',
  },
];

const INITIAL_STUDENT_ROSTER: StudentAttendanceRecord[] = [
  { studentId: '211-15-4424', name: 'Sakib Ahmed', avatar: '', status: 'present' },
  { studentId: '211-15-4425', name: 'Anika Tabassum', avatar: '', status: 'present' },
  { studentId: '211-15-4426', name: 'Tanvir Hasan', avatar: '', status: 'present' },
  { studentId: '211-15-4427', name: 'Zara Rahman', avatar: '', status: 'late' },
  { studentId: '211-15-4428', name: 'Mahmudul Karim', avatar: '', status: 'present' },
  { studentId: '211-15-4429', name: 'Nusrat Fariha', avatar: '', status: 'absent' },
  { studentId: '211-15-4430', name: 'Rifat Chowdhury', avatar: '', status: 'present' },
  { studentId: '211-15-4431', name: 'Sabrina Mostafa', avatar: '', status: 'excused' },
];

const INITIAL_GRADES: StudentGradeRecord[] = [
  { studentId: '211-15-4424', name: 'Sakib Ahmed', attendance: 9.5, quiz: 14.0, midterm: 23.5, final: 28.0, lab: 19.0, total: 94.0, letterGrade: 'A+', gpa: 4.0, isSubmitted: false },
  { studentId: '211-15-4425', name: 'Anika Tabassum', attendance: 10.0, quiz: 13.5, midterm: 22.0, final: 27.0, lab: 18.5, total: 91.0, letterGrade: 'A+', gpa: 4.0, isSubmitted: false },
  { studentId: '211-15-4426', name: 'Tanvir Hasan', attendance: 8.5, quiz: 12.0, midterm: 19.5, final: 24.0, lab: 17.0, total: 81.0, letterGrade: 'A', gpa: 3.75, isSubmitted: false },
  { studentId: '211-15-4427', name: 'Zara Rahman', attendance: 8.0, quiz: 11.5, midterm: 18.0, final: 22.5, lab: 16.0, total: 76.0, letterGrade: 'A-', gpa: 3.5, isSubmitted: false },
  { studentId: '211-15-4428', name: 'Mahmudul Karim', attendance: 9.0, quiz: 13.0, midterm: 21.0, final: 25.5, lab: 18.0, total: 86.5, letterGrade: 'A+', gpa: 4.0, isSubmitted: false },
  { studentId: '211-15-4429', name: 'Nusrat Fariha', attendance: 7.0, quiz: 10.0, midterm: 16.0, final: 21.0, lab: 15.0, total: 69.0, letterGrade: 'B+', gpa: 3.25, isSubmitted: false },
  { studentId: '211-15-4430', name: 'Rifat Chowdhury', attendance: 9.0, quiz: 12.5, midterm: 20.0, final: 24.0, lab: 17.5, total: 83.0, letterGrade: 'A', gpa: 3.75, isSubmitted: false },
  { studentId: '211-15-4431', name: 'Sabrina Mostafa', attendance: 8.5, quiz: 11.0, midterm: 17.5, final: 23.0, lab: 16.5, total: 76.5, letterGrade: 'A-', gpa: 3.5, isSubmitted: false },
];

const INITIAL_TEACHER_ROUTINE: TeacherTimetableSlot[] = [
  { id: 'tt-1', day: 'Saturday', startTime: '10:00 AM', endTime: '11:30 AM', courseCode: 'CSE-311', courseTitle: 'Database Management Systems', room: 'RM-402', section: 'Sec-A', type: 'Theory' },
  { id: 'tt-2', day: 'Saturday', startTime: '02:00 PM', endTime: '03:30 PM', courseCode: 'OFFICE', courseTitle: 'Student Consultation & Advising', room: 'Cabin 412', section: 'Open', type: 'Consultation' },
  { id: 'tt-3', day: 'Monday', startTime: '09:00 AM', endTime: '10:30 AM', courseCode: 'CSE-401', courseTitle: 'Artificial Intelligence & Neural Nets', room: 'RM-303', section: 'Sec-B', type: 'Theory' },
  { id: 'tt-4', day: 'Monday', startTime: '11:00 AM', endTime: '12:30 PM', courseCode: 'CSE-311', courseTitle: 'Database Management Systems', room: 'RM-402', section: 'Sec-A', type: 'Theory' },
  { id: 'tt-5', day: 'Wednesday', startTime: '01:00 PM', endTime: '03:30 PM', courseCode: 'CSE-402', courseTitle: 'AI & Deep Learning Lab', room: 'LAB-03', section: 'Lab-1', type: 'Lab' },
  { id: 'tt-6', day: 'Thursday', startTime: '10:00 AM', endTime: '12:00 PM', courseCode: 'RESEARCH', courseTitle: 'Departmental Curriculum Meeting', room: 'Conference Hall', section: 'Faculty', type: 'Consultation' },
];

export const teacherService = {
  getCourses(): TeacherCourse[] {
    if (typeof window === 'undefined') return INITIAL_TEACHER_COURSES;
    const stored = localStorage.getItem('unicampus_teacher_courses');
    return stored ? JSON.parse(stored) : INITIAL_TEACHER_COURSES;
  },

  getAttendanceRoster(courseCode: string, date: string): StudentAttendanceRecord[] {
    if (typeof window === 'undefined') return INITIAL_STUDENT_ROSTER;
    const key = `unicampus_attendance_${courseCode}_${date}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : INITIAL_STUDENT_ROSTER;
  },

  saveAttendance(courseCode: string, date: string, records: StudentAttendanceRecord[]): void {
    if (typeof window === 'undefined') return;
    const key = `unicampus_attendance_${courseCode}_${date}`;
    localStorage.setItem(key, JSON.stringify(records));
  },

  getGrades(courseCode: string): StudentGradeRecord[] {
    if (typeof window === 'undefined') return INITIAL_GRADES;
    const key = `unicampus_grades_${courseCode}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : INITIAL_GRADES;
  },

  saveGrades(courseCode: string, grades: StudentGradeRecord[]): void {
    if (typeof window === 'undefined') return;
    const key = `unicampus_grades_${courseCode}`;
    localStorage.setItem(key, JSON.stringify(grades));
  },

  getRoutine(): TeacherTimetableSlot[] {
    return INITIAL_TEACHER_ROUTINE;
  },

  computeGradeLetter(total: number): { letter: string; gpa: number } {
    if (total >= 80) return { letter: 'A+', gpa: 4.0 };
    if (total >= 75) return { letter: 'A', gpa: 3.75 };
    if (total >= 70) return { letter: 'A-', gpa: 3.5 };
    if (total >= 65) return { letter: 'B+', gpa: 3.25 };
    if (total >= 60) return { letter: 'B', gpa: 3.0 };
    if (total >= 55) return { letter: 'B-', gpa: 2.75 };
    if (total >= 50) return { letter: 'C+', gpa: 2.5 };
    if (total >= 45) return { letter: 'C', gpa: 2.25 };
    if (total >= 40) return { letter: 'D', gpa: 2.0 };
    return { letter: 'F', gpa: 0.0 };
  }
};

