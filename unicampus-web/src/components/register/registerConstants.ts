import type { OrdinalSemesterName } from "@/types/admin";

export const BD_EDUCATION_BOARDS = [
  "Dhaka",
  "Rajshahi",
  "Cumilla",
  "Jashore",
  "Chattogram",
  "Barishal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah",
  "Technical",
  "Edexcel / Cambridge",
] as const;

export const BD_ACADEMIC_GROUPS = [
  "Science",
  "Business Studies",
  "Humanities",
  "Technical / Diploma",
] as const;

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
] as const;

export const GENDERS = ["Male", "Female", "Other"] as const;

export const RELIGIONS = [
  "Islam",
  "Hinduism",
  "Buddhism",
  "Christianity",
  "Other",
] as const;

export const FACULTY_DESIGNATIONS = [
  "Lecturer",
  "Senior Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
] as const;

export const HIGHEST_DEGREES = [
  "Ph.D.",
  "M.Phil.",
  "M.Sc. / M.A. / MBA",
  "B.Sc. / B.A. / BBA",
] as const;

export interface StudentRegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  nationality: string;
  idDocumentType: "Birth Certificate" | "NID";
  nidOrBirthCert: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  presentAddress: string;
  permanentAddress: string;
  deptId: string;
  semesterName: OrdinalSemesterName;
  // JSC
  jscBoard: string;
  jscYear: string;
  jscGpa: string;
  jscRoll: string;
  // SSC
  sscBoard: string;
  sscGroup: string;
  sscYear: string;
  sscInstitution: string;
  sscRoll: string;
  sscRegNo: string;
  sscGpa: string;
  sscMarksheetName: string;
  // HSC
  hscBoard: string;
  hscGroup: string;
  hscYear: string;
  hscInstitution: string;
  hscRoll: string;
  hscRegNo: string;
  hscGpa: string;
  hscMarksheetName: string;
}

export interface TeacherRegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  nidNumber: string;
  presentAddress: string;
  permanentAddress: string;
  deptId: string;
  designation: string;
  employmentType: "Full-Time" | "Adjunct" | "Visiting";
  experienceYears: string;
  specialization: string;
  highestDegree: string;
  undergradDegree: string;
  undergradUniversity: string;
  undergradYear: string;
  undergradCgpa: string;
  postgradDegree: string;
  postgradUniversity: string;
  postgradYear: string;
  cvFilename: string;
  certificateFilename: string;
}

export const INITIAL_STUDENT_FORM: StudentRegistrationForm = {
  fullName: "",
  email: "",
  phone: "",
  photoUrl: "",
  dateOfBirth: "",
  gender: "Male",
  bloodGroup: "B+",
  religion: "Islam",
  nationality: "Bangladeshi",
  idDocumentType: "Birth Certificate",
  nidOrBirthCert: "",
  fatherName: "",
  fatherPhone: "",
  motherName: "",
  motherPhone: "",
  presentAddress: "",
  permanentAddress: "",
  deptId: "dept-cse",
  semesterName: "1st Semester",
  jscBoard: "Dhaka",
  jscYear: "2019",
  jscGpa: "",
  jscRoll: "",
  sscBoard: "Dhaka",
  sscGroup: "Science",
  sscYear: "2022",
  sscInstitution: "",
  sscRoll: "",
  sscRegNo: "",
  sscGpa: "",
  sscMarksheetName: "",
  hscBoard: "Dhaka",
  hscGroup: "Science",
  hscYear: "2024",
  hscInstitution: "",
  hscRoll: "",
  hscRegNo: "",
  hscGpa: "",
  hscMarksheetName: "",
};

export const INITIAL_TEACHER_FORM: TeacherRegistrationForm = {
  fullName: "",
  email: "",
  phone: "",
  emergencyPhone: "",
  photoUrl: "",
  dateOfBirth: "",
  gender: "Male",
  bloodGroup: "O+",
  nationality: "Bangladeshi",
  nidNumber: "",
  presentAddress: "",
  permanentAddress: "",
  deptId: "dept-cse",
  designation: "Lecturer",
  employmentType: "Full-Time",
  experienceYears: "2",
  specialization: "",
  highestDegree: "M.Sc. / M.A. / MBA",
  undergradDegree: "B.Sc. in Computer Science & Engineering",
  undergradUniversity: "",
  undergradYear: "",
  undergradCgpa: "",
  postgradDegree: "",
  postgradUniversity: "",
  postgradYear: "",
  cvFilename: "",
  certificateFilename: "",
};
