import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit, getClientRateLimitKey } from "@/lib/scalability/rateLimiter";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface OtpMemoryRecord {
  channel: "email" | "phone";
  target: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
}

// Shared in-memory OTP store for local/sandbox fallback when SUPABASE_SERVICE_ROLE_KEY or SMS gateway is unset
const globalForOtp = globalThis as unknown as {
  __unicampusOtpStore?: Map<string, OtpMemoryRecord>;
};

export const otpMemoryStore: Map<string, OtpMemoryRecord> =
  globalForOtp.__unicampusOtpStore ?? new Map<string, OtpMemoryRecord>();

if (!globalForOtp.__unicampusOtpStore) {
  globalForOtp.__unicampusOtpStore = otpMemoryStore;
}

export function hashOtp(channel: string, target: string, code: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "unicampus-otp-salt-v1";
  return crypto
    .createHash("sha256")
    .update(`${channel}:${target}:${code}:${secret}`)
    .digest("hex");
}

export function normalizeTarget(channel: "email" | "phone", raw: string): string {
  if (channel === "email") {
    return raw.trim().toLowerCase();
  }
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+880")) return digits;
  if (digits.startsWith("880")) return `+${digits}`;
  if (digits.startsWith("01") && digits.length === 11) return `+88${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export async function POST(req: NextRequest) {
  try {
    const rl = await checkRateLimit(getClientRateLimitKey(req, "auth:otp:send"), {
      capacity: 8,
      refillPerSecond: 0.15,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many verification code requests. Please wait a minute and try again." },
        { status: 429, headers: rl.headers }
      );
    }

    const body = await req.json().catch(() => ({}));
    const channel = body.channel === "phone" ? "phone" : body.channel === "email" ? "email" : null;
    const rawTarget = typeof body.target === "string" ? body.target.trim() : "";

    if (!channel || !rawTarget) {
      return NextResponse.json(
        { error: "Valid channel ('email' or 'phone') and target are required." },
        { status: 400 }
      );
    }

    const target = normalizeTarget(channel, rawTarget);
    if (channel === "email" && !target.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (channel === "phone" && target.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please provide a valid mobile number." }, { status: 400 });
    }

    // Generate cryptographically random 6-digit OTP
    const code = String(crypto.randomInt(100000, 999999));
    const codeHash = hashOtp(channel, target, code);
    const expiresAtMs = Date.now() + 5 * 60 * 1000; // 5 minutes
    const storeKey = `${channel}:${target}`;

    // Store in memory fallback ledger
    otpMemoryStore.set(storeKey, {
      channel,
      target,
      codeHash,
      expiresAt: expiresAtMs,
      attempts: 0,
      maxAttempts: 5,
      verified: false,
    });

    let deliveryMode: "supabase-email" | "supabase-sms" | "sandbox-preview" = "sandbox-preview";

    // Attempt live Supabase Auth OTP delivery + Postgres ledger persistence
    if (isSupabaseConfigured()) {
      const serverClient = getSupabaseServerClient();
      if (serverClient) {
        // Persist hashed OTP in Postgres when service role key is present
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          await serverClient.from("verification_otps").insert({
            channel,
            target,
            code_hash: codeHash,
            expires_at: new Date(expiresAtMs).toISOString(),
          });
        }

        // Attempt live Supabase Auth Email OTP (works out of the box on Supabase)
        if (channel === "email") {
          const { error: otpErr } = await serverClient.auth.signInWithOtp({
            email: target,
            options: { shouldCreateUser: false },
          });
          if (!otpErr) {
            deliveryMode = "supabase-email";
          }
        }

        // Attempt live Supabase Auth Phone OTP (works when Twilio/MessageBird/Vonage is enabled in Supabase)
        if (channel === "phone" && process.env.SUPABASE_SMS_ENABLED === "true") {
          const { error: smsErr } = await serverClient.auth.signInWithOtp({
            phone: target,
          });
          if (!smsErr) {
            deliveryMode = "supabase-sms";
          }
        }
      }
    }

    return NextResponse.json(
      {
        sent: true,
        channel,
        target,
        expiresInSeconds: 300,
        deliveryMode,
        // Expose sandbox preview code only when external email/SMS provider is not active
        sandboxCode: deliveryMode === "sandbox-preview" ? code : undefined,
      },
      { status: 200, headers: rl.headers }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send verification code." },
      { status: 500 }
    );
  }
}
