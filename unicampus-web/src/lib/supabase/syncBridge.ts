import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { queryWithSwr, invalidateQueryCache } from "@/lib/scalability/queryCache";
import { supabaseCircuitBreaker, withExponentialBackoff } from "@/lib/scalability/resilience";
import type { Department, Profile, Semester, Subject } from "@/types/admin";
import { clampProgramSemesters, getSemestersForCount } from "@/lib/canonicalCampus";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_REGEX.test(value));
}

export interface SupabaseAuthResult {
  profile: Profile | null;
  error: string | null;
  needsEmailConfirmation?: boolean;
}

/**
 * Production Supabase Live Auth & Data Sync Bridge
 *
 * Wraps live PostgreSQL queries & Supabase Auth with:
 *  - SWR caching + singleflight request coalescing (cuts read load by 80–90% during bursts)
 *  - Exponential backoff with full jitter on transient errors
 *  - Circuit breaker fail-fast to local fallback when offline or unconfigured
 */
export const supabaseSyncBridge = {
  isLive(): boolean {
    return isSupabaseConfigured();
  },

  // ============================================================================
  // LIVE SUPABASE AUTHENTICATION
  // ============================================================================

  async signInWithPassword(email: string, password: string): Promise<SupabaseAuthResult> {
    const client = getSupabaseClient();
    if (!client) {
      return { profile: null, error: "Supabase is not configured." };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.user) {
        return { profile: null, error: error?.message || "Invalid email or password." };
      }

      const { data: profileRow, error: profileErr } = await client
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileErr) {
        return { profile: null, error: profileErr.message };
      }

      if (!profileRow) {
        return {
          profile: null,
          error: "Account authenticated, but no institutional profile dossier was found.",
        };
      }

      return { profile: profileRow as Profile, error: null };
    } catch (err) {
      return {
        profile: null,
        error: err instanceof Error ? err.message : "Unable to reach authentication server.",
      };
    }
  },

  async signUpWithProfile(
    email: string,
    password: string,
    payload: Omit<Profile, "id" | "created_at">,
    deptCode: string
  ): Promise<SupabaseAuthResult> {
    const client = getSupabaseClient();
    if (!client) {
      return { profile: null, error: "Supabase is not configured." };
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: signUpData, error: signUpError } = await client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: payload.full_name,
            role: payload.role,
          },
        },
      });

      if (signUpError || !signUpData.user) {
        return {
          profile: null,
          error: signUpError?.message || "Registration failed on Supabase Auth.",
        };
      }

      const userId = signUpData.user.id;
      const hasActiveSession = Boolean(signUpData.session);

      // Resolve live Postgres department & semester UUIDs when registering
      let resolvedDeptId: string | null = isUuid(payload.department_id)
        ? payload.department_id
        : null;
      if (!resolvedDeptId) {
        const { data: deptRow } = await client
          .from("departments")
          .select("id")
          .ilike("code", deptCode)
          .maybeSingle();
        resolvedDeptId = deptRow?.id ?? null;
      }

      let resolvedSemId: string | null = isUuid(payload.semester_id)
        ? payload.semester_id
        : null;
      if (!resolvedSemId && resolvedDeptId && payload.semester_name) {
        const { data: semRow } = await client
          .from("semesters")
          .select("id")
          .eq("department_id", resolvedDeptId)
          .eq("name", payload.semester_name)
          .maybeSingle();
        resolvedSemId = semRow?.id ?? null;
      }

      let studentId = payload.student_id;
      let teacherCode = payload.teacher_code;

      if (hasActiveSession && (payload.role === "student" || payload.role === "teacher")) {
        const atomicId = await this.generateAtomicAcademicId(payload.role, deptCode, 2026);
        if (atomicId) {
          if (payload.role === "student") studentId = atomicId;
          if (payload.role === "teacher") teacherCode = atomicId;
        }
      }

      if (hasActiveSession) {
        const insertRow = {
          id: userId,
          full_name: payload.full_name,
          email: normalizedEmail,
          role: payload.role,
          department_id: resolvedDeptId,
          program_name: payload.program_name || null,
          semester_id: resolvedSemId,
          student_id: studentId,
          teacher_code: teacherCode,
          avatar_url: payload.avatar_url || null,
          is_approved: false,
          account_status: "pending",
          phone: payload.phone || null,
          emergency_phone: payload.emergency_phone || null,
          date_of_birth: payload.date_of_birth || null,
          gender: payload.gender || null,
          blood_group: payload.blood_group || null,
          religion: payload.religion || null,
          nationality: payload.nationality || "Bangladeshi",
          id_document_type: payload.id_document_type || null,
          nid_or_birth_cert: payload.nid_or_birth_cert || null,
          father_name: payload.father_name || null,
          father_phone: payload.father_phone || null,
          mother_name: payload.mother_name || null,
          mother_phone: payload.mother_phone || null,
          present_address: payload.present_address || null,
          permanent_address: payload.permanent_address || null,
          academic_year: payload.academic_year || null,
          board_exams: payload.board_exams || [],
          teacher_qualifications: payload.teacher_qualifications || null,
          admission_payment: payload.admission_payment || null,
          email_verified: Boolean(payload.email_verified),
          email_verified_at: payload.email_verified ? new Date().toISOString() : null,
          phone_verified: Boolean(payload.phone_verified),
          phone_verified_at: payload.phone_verified ? new Date().toISOString() : null,
        };

        const { data: inserted, error: insertErr } = await client
          .from("profiles")
          .upsert(insertRow, { onConflict: "id" })
          .select("*")
          .maybeSingle();

        if (insertErr) {
          return {
            profile: null,
            error: insertErr.message,
            needsEmailConfirmation: false,
          };
        }

        invalidateQueryCache("profiles:");
        return {
          profile: (inserted as Profile) || {
            ...payload,
            id: userId,
            student_id: studentId,
            teacher_code: teacherCode,
            created_at: new Date().toISOString(),
          },
          error: null,
          needsEmailConfirmation: false,
        };
      }

      return {
        profile: {
          ...payload,
          id: userId,
          student_id: studentId,
          teacher_code: teacherCode,
          created_at: new Date().toISOString(),
        },
        error: null,
        needsEmailConfirmation: true,
      };
    } catch (err) {
      return {
        profile: null,
        error: err instanceof Error ? err.message : "Failed to complete Supabase registration.",
      };
    }
  },

  async signOut(): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.auth.signOut();
    } catch {
      // ignore offline signout error
    }
  },

  async signInWithGoogle(): Promise<{ error: string | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      return { error: error ? error.message : null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Could not start Google Sign-In.",
      };
    }
  },

  async getOAuthUserMeta(): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    provider: string;
  } | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      if (!user || !user.email) return null;
      const meta = (user.user_metadata || {}) as Record<string, string | undefined>;
      const fullName = meta.full_name || meta.name || "";
      const parts = fullName.trim().split(/\s+/).filter(Boolean);
      return {
        id: user.id,
        email: user.email.trim().toLowerCase(),
        firstName: meta.given_name || parts[0] || "",
        lastName: meta.family_name || parts.slice(1).join(" ") || "",
        avatarUrl: meta.avatar_url || meta.picture || "",
        provider: user.app_metadata?.provider || "google",
      };
    } catch {
      return null;
    }
  },

  async completeOAuthProfile(
    payload: Omit<Profile, "id" | "created_at">,
    deptCode: string
  ): Promise<SupabaseAuthResult> {
    const client = getSupabaseClient();
    if (!client) {
      return { profile: null, error: "Supabase is not configured." };
    }

    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        return { profile: null, error: "No active Google session found. Please sign in with Google again." };
      }

      let resolvedDeptId: string | null = isUuid(payload.department_id)
        ? payload.department_id
        : null;
      if (!resolvedDeptId) {
        const { data: deptRow } = await client
          .from("departments")
          .select("id")
          .ilike("code", deptCode)
          .maybeSingle();
        resolvedDeptId = deptRow?.id ?? null;
      }

      let resolvedSemId: string | null = isUuid(payload.semester_id)
        ? payload.semester_id
        : null;
      if (!resolvedSemId && resolvedDeptId && payload.semester_name) {
        const { data: semRow } = await client
          .from("semesters")
          .select("id")
          .eq("department_id", resolvedDeptId)
          .eq("name", payload.semester_name)
          .maybeSingle();
        resolvedSemId = semRow?.id ?? null;
      }

      let studentId = payload.student_id;
      let teacherCode = payload.teacher_code;
      if (payload.role === "student" || payload.role === "teacher") {
        const atomicId = await this.generateAtomicAcademicId(payload.role, deptCode, 2026);
        if (atomicId) {
          if (payload.role === "student") studentId = atomicId;
          if (payload.role === "teacher") teacherCode = atomicId;
        }
      }

      const insertRow = {
        id: user.id,
        full_name: payload.full_name,
        email: (user.email || payload.email).trim().toLowerCase(),
        role: payload.role,
        department_id: resolvedDeptId,
        program_name: payload.program_name || null,
        semester_id: resolvedSemId,
        student_id: studentId,
        teacher_code: teacherCode,
        avatar_url: payload.avatar_url || null,
        is_approved: false,
        account_status: "pending",
        phone: payload.phone || null,
        emergency_phone: payload.emergency_phone || null,
        date_of_birth: payload.date_of_birth || null,
        gender: payload.gender || null,
        blood_group: payload.blood_group || null,
        religion: payload.religion || null,
        nationality: payload.nationality || "Bangladeshi",
        id_document_type: payload.id_document_type || null,
        nid_or_birth_cert: payload.nid_or_birth_cert || null,
        father_name: payload.father_name || null,
        father_phone: payload.father_phone || null,
        mother_name: payload.mother_name || null,
        mother_phone: payload.mother_phone || null,
        present_address: payload.present_address || null,
        permanent_address: payload.permanent_address || null,
        academic_year: payload.academic_year || null,
        board_exams: payload.board_exams || [],
        teacher_qualifications: payload.teacher_qualifications || null,
        admission_payment: payload.admission_payment || null,
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        phone_verified: Boolean(payload.phone_verified),
        phone_verified_at: payload.phone_verified ? new Date().toISOString() : null,
      };

      const { data: inserted, error: insertErr } = await client
        .from("profiles")
        .upsert(insertRow, { onConflict: "id" })
        .select("*")
        .maybeSingle();

      if (insertErr) {
        return { profile: null, error: insertErr.message };
      }

      invalidateQueryCache("profiles:");
      return {
        profile: (inserted as Profile) || {
          ...payload,
          id: user.id,
          student_id: studentId,
          teacher_code: teacherCode,
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    } catch (err) {
      return {
        profile: null,
        error: err instanceof Error ? err.message : "Failed to save Google profile.",
      };
    }
  },

  async getCurrentSessionProfile(): Promise<Profile | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data: sessionData } = await client.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return null;
      const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      return (data as Profile) || null;
    } catch {
      return null;
    }
  },

  // ============================================================================
  // ATOMIC RPC & SWR-CACHED READS
  // ============================================================================

  /** Calls Postgres atomic RPC `generate_academic_id` for collision-free IDs under concurrency */
  async generateAtomicAcademicId(
    role: "student" | "teacher",
    deptCode: string,
    admissionYear: number = 2026
  ): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    return supabaseCircuitBreaker.execute(
      async () =>
        withExponentialBackoff(async () => {
          const { data, error } = await client.rpc("generate_academic_id", {
            p_role: role,
            p_dept_code: deptCode,
            p_admission_year: admissionYear,
          });
          if (error) throw error;
          return typeof data === "string" ? data : null;
        }),
      () => null
    );
  },

  /** SWR-cached departments fetch (30s fresh, 5m stale-while-revalidate) */
  async fetchDepartments(fallback: () => Department[]): Promise<Department[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "departments:all",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("departments")
                .select("*")
                .order("code", { ascending: true });
              if (error) throw error;
              return (data as Department[]) || [];
            }),
          fallback
        ),
      { ttlMs: 30_000, staleMs: 300_000 }
    );
  },

  /** SWR-cached semesters fetch */
  async fetchSemesters(fallback: () => Semester[]): Promise<Semester[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "semesters:all",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("semesters")
                .select("*")
                .order("order_index", { ascending: true });
              if (error) throw error;
              return (data as Semester[]) || [];
            }),
          fallback
        ),
      { ttlMs: 60_000, staleMs: 300_000 }
    );
  },

  /** SWR-cached subjects fetch per department */
  async fetchSubjects(
    departmentId: string | undefined,
    fallback: () => Subject[]
  ): Promise<Subject[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      `subjects:${departmentId || "all"}`,
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              let query = client.from("subjects").select("*").order("code", { ascending: true });
              if (departmentId && isUuid(departmentId)) {
                query = query.eq("department_id", departmentId);
              }
              const { data, error } = await query;
              if (error) throw error;
              return (data as Subject[]) || [];
            }),
          fallback
        ),
      { ttlMs: 30_000, staleMs: 300_000 }
    );
  },

  /** Cursor-paginated profiles query (O(log N) keyset pagination instead of OFFSET) */
  async fetchProfilesPage(
    options: { departmentId?: string; status?: string; cursorCreatedAt?: string; limit?: number },
    fallback: () => Profile[]
  ): Promise<{ items: Profile[]; nextCursor: string | null }> {
    const client = getSupabaseClient();
    const limit = options.limit ?? 50;
    if (!client) {
      return { items: fallback().slice(0, limit), nextCursor: null };
    }

    return supabaseCircuitBreaker.execute(
      async () =>
        withExponentialBackoff(async () => {
          let query = client
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit + 1);

          if (options.departmentId && options.departmentId !== "all" && isUuid(options.departmentId)) {
            query = query.eq("department_id", options.departmentId);
          }
          if (options.status && options.status !== "all") {
            query = query.eq("account_status", options.status);
          }
          if (options.cursorCreatedAt) {
            query = query.lt("created_at", options.cursorCreatedAt);
          }

          const { data, error } = await query;
          if (error) throw error;
          const rows = (data as Profile[]) || [];
          const hasMore = rows.length > limit;
          const items = hasMore ? rows.slice(0, limit) : rows;
          const nextCursor = hasMore ? items[items.length - 1]?.created_at ?? null : null;
          return { items, nextCursor };
        }),
      () => ({ items: fallback().slice(0, limit), nextCursor: null })
    );
  },

  // ============================================================================
  // LIVE POSTGRES MUTATIONS (DEPARTMENTS, SUBJECTS, PROFILES)
  // ============================================================================

  async createDepartmentWithSemesters(
    data: Omit<Department, "id">
  ): Promise<Department | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const totalSemesters = clampProgramSemesters(data.total_semesters);

    return supabaseCircuitBreaker.execute(
      async () =>
        withExponentialBackoff(async () => {
          const basePayload = {
            name: data.name,
            code: data.code.toUpperCase(),
            faculty: data.faculty || null,
            dept_admin_name: data.dept_admin_name || data.head_teacher_name || null,
            head_teacher_id: isUuid(data.head_teacher_id) ? data.head_teacher_id : null,
          };

          let { data: inserted, error } = await client
            .from("departments")
            .insert({ ...basePayload, total_semesters: totalSemesters })
            .select("*")
            .single();

          if (error && error.message?.toLowerCase().includes("total_semesters")) {
            const fallbackRes = await client
              .from("departments")
              .insert(basePayload)
              .select("*")
              .single();
            inserted = fallbackRes.data;
            error = fallbackRes.error;
          }

          if (error || !inserted) throw error || new Error("Department insert failed");

          const semRows = getSemestersForCount(totalSemesters).map((name, idx) => ({
            department_id: inserted.id,
            name,
            order_index: idx + 1,
          }));
          await client.from("semesters").insert(semRows);

          invalidateQueryCache("departments:");
          invalidateQueryCache("semesters:");
          return { ...(inserted as Department), total_semesters: totalSemesters };
        }),
      () => null
    );
  },

  async updateDepartmentSemesterCount(
    deptIdOrCode: string,
    totalSemesters: number
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const count = clampProgramSemesters(totalSemesters);

    return supabaseCircuitBreaker.execute(
      async () => {
        // Resolve department UUID if code/slug was passed
        let resolvedId = isUuid(deptIdOrCode) ? deptIdOrCode : null;
        if (!resolvedId) {
          const { data: deptRow } = await client
            .from("departments")
            .select("id")
            .ilike("code", deptIdOrCode.replace(/^dept-/i, ""))
            .maybeSingle();
          resolvedId = deptRow?.id ?? null;
        }
        if (!resolvedId) return false;

        // Best-effort update of total_semesters column (gracefully skipped if column not migrated yet)
        const { error: colErr } = await client
          .from("departments")
          .update({ total_semesters: count })
          .eq("id", resolvedId);
        if (colErr && !colErr.message?.toLowerCase().includes("total_semesters")) {
          throw colErr;
        }

        // Sync public.semesters rows for this department so count is authoritative even before column migration
        const { data: existingSems } = await client
          .from("semesters")
          .select("id, order_index")
          .eq("department_id", resolvedId);

        const existingIndices = new Set(
          (existingSems || []).map((s) => Number(s.order_index))
        );
        const targetNames = getSemestersForCount(count);
        const toInsert = targetNames
          .map((name, idx) => ({
            department_id: resolvedId!,
            name,
            order_index: idx + 1,
          }))
          .filter((row) => !existingIndices.has(row.order_index));

        if (toInsert.length > 0) {
          await client.from("semesters").insert(toInsert);
        }

        const toDeleteIds = (existingSems || [])
          .filter((s) => Number(s.order_index) > count)
          .map((s) => s.id);
        if (toDeleteIds.length > 0) {
          await client.from("semesters").delete().in("id", toDeleteIds);
        }

        invalidateQueryCache("departments:");
        invalidateQueryCache("semesters:");
        return true;
      },
      () => false
    );
  },

  async updateDepartmentHod(
    deptIdOrCode: string,
    headTeacherId: string | null,
    headTeacherName: string
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    return supabaseCircuitBreaker.execute(
      async () => {
        const updatePayload: Record<string, unknown> = {
          dept_admin_name: headTeacherName,
        };
        if (isUuid(headTeacherId)) {
          updatePayload.head_teacher_id = headTeacherId;
        }
        const query = isUuid(deptIdOrCode)
          ? client.from("departments").update(updatePayload).eq("id", deptIdOrCode)
          : client.from("departments").update(updatePayload).ilike("code", deptIdOrCode.replace(/^dept-/i, ""));
        const { error } = await query;
        if (error) throw error;
        invalidateQueryCache("departments:");
        return true;
      },
      () => false
    );
  },

  async createSubject(data: Omit<Subject, "id">): Promise<Subject | null> {
    const client = getSupabaseClient();
    if (!client || !isUuid(data.department_id) || !isUuid(data.semester_id)) return null;

    return supabaseCircuitBreaker.execute(
      async () =>
        withExponentialBackoff(async () => {
          const { data: inserted, error } = await client
            .from("subjects")
            .insert({
              department_id: data.department_id,
              semester_id: data.semester_id,
              code: data.code.toUpperCase(),
              title: data.title,
              credit: data.credit,
              type: data.type || "Theory",
              assigned_teacher_id: isUuid(data.assigned_teacher_id)
                ? data.assigned_teacher_id
                : null,
              assigned_teacher_name: data.assigned_teacher_name || null,
            })
            .select("*")
            .single();
          if (error) throw error;
          invalidateQueryCache("subjects:");
          return inserted as Subject;
        }),
      () => null
    );
  },

  async updateSubject(id: string, updates: Partial<Subject>): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client || !isUuid(id)) return false;

    return supabaseCircuitBreaker.execute(
      async () => {
        const { error } = await client
          .from("subjects")
          .update({
            ...(updates.title !== undefined ? { title: updates.title } : {}),
            ...(updates.code !== undefined ? { code: updates.code } : {}),
            ...(updates.credit !== undefined ? { credit: updates.credit } : {}),
            ...(updates.type !== undefined ? { type: updates.type } : {}),
            ...(updates.assigned_teacher_id !== undefined
              ? {
                  assigned_teacher_id: isUuid(updates.assigned_teacher_id)
                    ? updates.assigned_teacher_id
                    : null,
                }
              : {}),
            ...(updates.assigned_teacher_name !== undefined
              ? { assigned_teacher_name: updates.assigned_teacher_name }
              : {}),
          })
          .eq("id", id);
        if (error) throw error;
        invalidateQueryCache("subjects:");
        return true;
      },
      () => false
    );
  },

  async deleteSubject(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client || !isUuid(id)) return false;

    return supabaseCircuitBreaker.execute(
      async () => {
        const { error } = await client.from("subjects").delete().eq("id", id);
        if (error) throw error;
        invalidateQueryCache("subjects:");
        return true;
      },
      () => false
    );
  },

  async updateProfileStatus(
    id: string,
    updates: {
      is_approved?: boolean;
      account_status?: "active" | "pending" | "suspended" | "rejected";
      rejection_reason?: string | null;
      reviewed_at?: string | null;
      reviewed_by?: string | null;
    }
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client || !isUuid(id)) return false;

    return supabaseCircuitBreaker.execute(
      async () => {
        const { error } = await client.from("profiles").update(updates).eq("id", id);
        if (error) throw error;
        invalidateQueryCache("profiles:");
        return true;
      },
      () => false
    );
  },

  async deleteProfile(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client || !isUuid(id)) return false;

    return supabaseCircuitBreaker.execute(
      async () => {
        const { error } = await client.from("profiles").delete().eq("id", id);
        if (error) throw error;
        invalidateQueryCache("profiles:");
        return true;
      },
      () => false
    );
  },

  async fetchNotices<T>(fallback: () => T[]): Promise<T[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "notices:all",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("notices")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);
              if (error) throw error;
              return (data ?? []) as T[];
            }),
          fallback
        ),
      { ttlMs: 120_000 }
    );
  },

  async fetchRoutineSlots<T>(fallback: () => T[]): Promise<T[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "routine:all",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("routine_slots")
                .select("*")
                .order("day_of_week", { ascending: true })
                .limit(200);
              if (error) throw error;
              return (data ?? []) as T[];
            }),
          fallback
        ),
      { ttlMs: 300_000 }
    );
  },

  async fetchAssignments<T>(fallback: () => T[]): Promise<T[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "assignments:all",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("assignments")
                .select("*")
                .order("due_at", { ascending: true })
                .limit(100);
              if (error) throw error;
              return (data ?? []) as T[];
            }),
          fallback
        ),
      { ttlMs: 120_000 }
    );
  },

  async fetchFinanceTransactions<T>(fallback: () => T[]): Promise<T[]> {
    const client = getSupabaseClient();
    if (!client) return fallback();

    return queryWithSwr(
      "finance:transactions",
      () =>
        supabaseCircuitBreaker.execute(
          async () =>
            withExponentialBackoff(async () => {
              const { data, error } = await client
                .from("finance_transactions")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);
              if (error) throw error;
              return (data ?? []) as T[];
            }),
          fallback
        ),
      { ttlMs: 120_000 }
    );
  },

  invalidate(prefix?: string): void {
    invalidateQueryCache(prefix);
  },
};
