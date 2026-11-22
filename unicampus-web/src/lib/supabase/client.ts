import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseCircuitBreaker, withExponentialBackoff } from "@/lib/scalability/resilience";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabaseInstance: SupabaseClient | null = null;
let serverAdminInstance: SupabaseClient | null = null;

/** Returns true when live Supabase credentials are configured in environment variables */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Browser / Public Anon Supabase Client (singleton to prevent duplicate WebSocket/HTTP pools) */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "x-client-info": "unicampus-web/2.0",
          },
        },
      });
      return supabaseInstance;
    } catch (e) {
      console.warn("Could not initialize Supabase client:", e);
      return null;
    }
  }

  return null;
}

/**
 * Server-side Supabase Client for Next.js API Routes / Server Actions.
 * Uses SUPABASE_SERVICE_ROLE_KEY when present (for trusted server mutations & atomic RPCs).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (typeof window !== "undefined") return getSupabaseClient();
  if (serverAdminInstance) return serverAdminInstance;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl || !serviceRoleKey) return null;

  serverAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return serverAdminInstance;
}

/**
 * Direct Browser-to-Supabase Storage Upload
 * Uploads photos, SSC/HSC marksheets, or assignment files directly to object storage,
 * keeping heavy binary streams off the Next.js server so it scales effortlessly.
 */
export async function uploadFileDirectToStorage(
  bucket: "avatars" | "academic-documents" | "assignment-submissions",
  filePath: string,
  file: File
): Promise<{ publicUrl: string | null; path: string; fallback: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { publicUrl: null, path: filePath, fallback: true };
  }

  return supabaseCircuitBreaker.execute<{
    publicUrl: string | null;
    path: string;
    fallback: boolean;
  }>(
    async () => {
      const uploaded = await withExponentialBackoff(async () => {
        const { data, error } = await client.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true, cacheControl: "3600" });
        if (error) throw error;
        return data;
      });

      const { data: urlData } = client.storage.from(bucket).getPublicUrl(uploaded.path);
      return { publicUrl: urlData.publicUrl, path: uploaded.path, fallback: false };
    },
    () => ({ publicUrl: null, path: filePath, fallback: true })
  );
}
