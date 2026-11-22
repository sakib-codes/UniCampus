import type { Profile } from "@/types/admin";

/**
 * Generates an official, unique Student Academic ID in Bangladeshi university format:
 *   YY-<DEPT>-NNNN   (e.g., 26-CSE-1001)
 */
export function generateStudentAcademicId(
  departmentCode: string,
  existingProfiles: Profile[],
  admissionYear: number = 2026
): string {
  const yy = String(admissionYear).slice(-2);
  const dept = (departmentCode || "GEN").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  const prefix = `${yy}-${dept}-`;

  const existingIds = new Set(
    existingProfiles
      .map((p) => p.student_id)
      .filter((id): id is string => Boolean(id))
  );

  let seq = 1001 + existingProfiles.filter((p) => p.role === "student").length;
  let candidate = `${prefix}${seq}`;
  while (existingIds.has(candidate)) {
    seq += 1;
    candidate = `${prefix}${seq}`;
  }
  return candidate;
}

/**
 * Generates an official, unique Faculty Academic ID:
 *   FAC-<DEPT>-NNNN  (e.g., FAC-CSE-1043)
 */
export function generateTeacherAcademicId(
  departmentCode: string,
  existingProfiles: Profile[]
): string {
  const dept = (departmentCode || "GEN").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  const prefix = `FAC-${dept}-`;

  const existingCodes = new Set(
    existingProfiles
      .map((p) => p.teacher_code)
      .filter((code): code is string => Boolean(code))
  );

  let seq = 1040 + existingProfiles.filter((p) => p.role === "teacher").length;
  let candidate = `${prefix}${seq}`;
  while (existingCodes.has(candidate)) {
    seq += 1;
    candidate = `${prefix}${seq}`;
  }
  return candidate;
}
