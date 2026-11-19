/**
 * UniCampus Teacher Service
 * Manages courses, live attendance sessions, gradebooks, and teaching timetables.
 * Persists changes in localStorage for interactive state retention.
 */

import {
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
  GRADE_WEIGHTS,
  calculateGrade,
} from '@/lib/canonicalCampus';

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
  quiz: number;       // Max 10
  midterm: number;    // Max 25
  final: number;      // Max 40
  lab: number;        // Max 15
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
    code: CANONICAL_COURSES['CSE-3101'].code,
    title: CANONICAL_COURSES['CSE-3101'].title,
    credit: CANONICAL_COURSES['CSE-3101'].credit,
    department: 'CSE',
    semester: '6th Semester',
    section: 'Sec A',
    room: 'Room 402',
    enrolledCount: 45,
    avgAttendance: 91.5,
    syllabusProgress: 68,
    nextSession: 'Monday, 10:15 AM - 11:45 AM',
  },
  {
    id: 'course-2',
    code: CANONICAL_COURSES['CSE-3101'].code,
    title: CANONICAL_COURSES['CSE-3101'].title,
    credit: CANONICAL_COURSES['CSE-3101'].credit,
    department: 'CSE',
    semester: '6th Semester',
    section: 'Sec B',
    room: 'Room 405',
    enrolledCount: 48,
    avgAttendance: 88.4,
    syllabusProgress: 64,
    nextSession: 'Monday, 08:30 AM - 10:00 AM',
  },
  {
    id: 'course-3',
    code: CANONICAL_COURSES['CSE-4109'].code,
    title: CANONICAL_COURSES['CSE-4109'].title,
    credit: CANONICAL_COURSES['CSE-4109'].credit,
    department: 'CSE',
    semester: '7th Semester',
    section: 'Sec A',
    room: 'Room 602',
    enrolledCount: 36,
    avgAttendance: 87.2,
    syllabusProgress: 52,
    nextSession: 'Monday, 02:00 PM - 04:00 PM',
  },
  {
    id: 'course-4',
    code: CANONICAL_COURSES['CSE-3102'].code,
    title: CANONICAL_COURSES['CSE-3102'].title,
    credit: CANONICAL_COURSES['CSE-3102'].credit,
    department: 'CSE',
    semester: '6th Semester',
    section: 'Lab 4A',
    room: 'Lab 4A',
    enrolledCount: 45,
    avgAttendance: 94.0,
    syllabusProgress: 60,
    nextSession: 'Wednesday, 02:45 PM - 04:45 PM',
  },
];

const INITIAL_STUDENT_ROSTER: StudentAttendanceRecord[] = [
  { studentId: '211-15-4424', name: 'Sakib Ahmed', avatar: '', status: 'present' },
  { studentId: '211-15-4425', name: 'Anika Tabassum', avatar: '', status: 'present' },
  { studentId: '211-15-4426', name: 'Tanvir Mahmud', avatar: '', status: 'present' },
  { studentId: '211-15-4427', name: 'Zara Rahman', avatar: '', status: 'late' },
  { studentId: '211-15-4428', name: 'Mahmudul Karim', avatar: '', status: 'present' },
  { studentId: '211-15-4429', name: 'Nusrat Fariha', avatar: '', status: 'absent' },
  { studentId: '211-15-4430', name: 'Rifat Chowdhury', avatar: '', status: 'present' },
  { studentId: '211-15-4431', name: 'Sabrina Mostafa', avatar: '', status: 'excused' },
];

function buildGradeRecord(
  studentId: string,
  name: string,
  attendance: number,
  quiz: number,
  midterm: number,
  lab: number,
  final: number
): StudentGradeRecord {
  const clampedAttendance = Math.min(GRADE_WEIGHTS.attendance, Math.max(0, attendance));
  const clampedQuiz = Math.min(GRADE_WEIGHTS.quiz1, Math.max(0, quiz));
  const clampedMidterm = Math.min(GRADE_WEIGHTS.midterm, Math.max(0, midterm));
  const clampedLab = Math.min(GRADE_WEIGHTS.lab, Math.max(0, lab));
  const clampedFinal = Math.min(GRADE_WEIGHTS.finalExam, Math.max(0, final));
  const total = Number(
    (clampedAttendance + clampedQuiz + clampedMidterm + clampedLab + clampedFinal).toFixed(1)
  );
  const { letterGrade, gpa } = calculateGrade(total);
  return {
    studentId,
    name,
    attendance: clampedAttendance,
    quiz: clampedQuiz,
    midterm: clampedMidterm,
    final: clampedFinal,
    lab: clampedLab,
    total,
    letterGrade,
    gpa,
    isSubmitted: false,
  };
}

const INITIAL_GRADES: StudentGradeRecord[] = [
  buildGradeRecord('211-15-4424', 'Sakib Ahmed', 9.5, 9.5, 23.5, 14.5, 37.0),
  buildGradeRecord('211-15-4425', 'Anika Tabassum', 10.0, 9.0, 22.0, 14.0, 36.0),
  buildGradeRecord('211-15-4426', 'Tanvir Mahmud', 8.5, 8.0, 19.5, 12.5, 32.5),
  buildGradeRecord('211-15-4427', 'Zara Rahman', 8.0, 7.5, 18.0, 12.0, 30.5),
  buildGradeRecord('211-15-4428', 'Mahmudul Karim', 9.0, 8.5, 21.0, 13.5, 34.5),
  buildGradeRecord('211-15-4429', 'Nusrat Fariha', 7.0, 6.5, 16.0, 11.0, 28.5),
  buildGradeRecord('211-15-4430', 'Rifat Chowdhury', 9.0, 8.5, 20.0, 13.0, 32.5),
  buildGradeRecord('211-15-4431', 'Sabrina Mostafa', 8.5, 7.5, 17.5, 12.0, 31.0),
];

const INITIAL_TEACHER_ROUTINE: TeacherTimetableSlot[] = [
  { id: 'tt-1', day: 'Monday', startTime: '08:30 AM', endTime: '10:00 AM', courseCode: CANONICAL_COURSES['CSE-3101'].code, courseTitle: CANONICAL_COURSES['CSE-3101'].title, room: 'Room 405', section: 'Sec B', type: 'Theory' },
  { id: 'tt-2', day: 'Monday', startTime: '10:15 AM', endTime: '11:45 AM', courseCode: CANONICAL_COURSES['CSE-3101'].code, courseTitle: CANONICAL_COURSES['CSE-3101'].title, room: 'Room 402', section: 'Sec A', type: 'Theory' },
  { id: 'tt-3', day: 'Monday', startTime: '02:00 PM', endTime: '04:00 PM', courseCode: CANONICAL_COURSES['CSE-4109'].code, courseTitle: CANONICAL_COURSES['CSE-4109'].title, room: 'Room 602', section: 'Sec A', type: 'Theory' },
  { id: 'tt-4', day: 'Monday', startTime: '04:15 PM', endTime: '05:30 PM', courseCode: 'OFFICE', courseTitle: 'Student Consultation & Advising', room: CANONICAL_FACULTY.office, section: 'Open', type: 'Consultation' },
  { id: 'tt-5', day: 'Tuesday', startTime: '10:15 AM', endTime: '11:45 AM', courseCode: CANONICAL_COURSES['CSE-3101'].code, courseTitle: CANONICAL_COURSES['CSE-3101'].title, room: 'Room 402', section: 'Sec A', type: 'Theory' },
  { id: 'tt-6', day: 'Wednesday', startTime: '02:45 PM', endTime: '04:45 PM', courseCode: CANONICAL_COURSES['CSE-3102'].code, courseTitle: CANONICAL_COURSES['CSE-3102'].title, room: 'Lab 4A', section: 'Lab 4A', type: 'Lab' },
  { id: 'tt-7', day: 'Thursday', startTime: '10:15 AM', endTime: '11:45 AM', courseCode: 'RESEARCH', courseTitle: 'Departmental Curriculum Committee', room: CANONICAL_FACULTY.office, section: 'Faculty', type: 'Consultation' },
];

export const teacherService = {
  getCourses(): TeacherCourse[] {
    if (typeof window === 'undefined') return INITIAL_TEACHER_COURSES;
    const stored = localStorage.getItem('unicampus_teacher_courses_v2');
    return stored ? JSON.parse(stored) : INITIAL_TEACHER_COURSES;
  },

  getAttendanceRoster(courseCode: string, date: string): StudentAttendanceRecord[] {
    if (typeof window === 'undefined') return INITIAL_STUDENT_ROSTER;
    const key = `unicampus_attendance_v2_${courseCode}_${date}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : INITIAL_STUDENT_ROSTER;
  },

  saveAttendance(courseCode: string, date: string, records: StudentAttendanceRecord[]): void {
    if (typeof window === 'undefined') return;
    const key = `unicampus_attendance_v2_${courseCode}_${date}`;
    localStorage.setItem(key, JSON.stringify(records));
  },

  getGrades(courseCode: string): StudentGradeRecord[] {
    if (typeof window === 'undefined') return INITIAL_GRADES;
    const key = `unicampus_grades_v2_${courseCode}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : INITIAL_GRADES;
  },

  saveGrades(courseCode: string, grades: StudentGradeRecord[]): void {
    if (typeof window === 'undefined') return;
    const key = `unicampus_grades_v2_${courseCode}`;
    localStorage.setItem(key, JSON.stringify(grades));
  },

  getRoutine(): TeacherTimetableSlot[] {
    return INITIAL_TEACHER_ROUTINE;
  },

  computeGradeLetter(total: number): { letter: string; gpa: number } {
    const { letterGrade, gpa } = calculateGrade(total);
    return { letter: letterGrade, gpa };
  }
};

