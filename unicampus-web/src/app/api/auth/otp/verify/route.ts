import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientRateLimitKey } from "@/lib/scalability/rateLimiter";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { hashOtp, normalizeTarget, otpMemoryStore } from "../send/route";

export async function POST(req: NextRequest) {
  try {
    const rl = await checkRateLimit(getClientRateLimitKey(req, "auth:otp:verify"), {
      capacity: 15,
      refillPerSecond: 0.25,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please wait a moment." },
        { status: 429, headers: rl.headers }
      );
    }

    const body = await req.json().catch(() => ({}));
    const channel = body.channel === "phone" ? "phone" : body.channel === "email" ? "email" : null;
    const rawTarget = typeof body.target === "string" ? body.target.trim() : "";
    const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").trim() : "";

    if (!channel || !rawTarget || code.length !== 6) {
      return NextResponse.json(
        { error: "Please enter the full 6-digit verification code." },
        { status: 400 }
      );
    }

    const target = normalizeTarget(channel, rawTarget);
    const candidateHash = hashOtp(channel, target, code);
    const storeKey = `${channel}:${target}`;

    // 1. Check live Supabase Auth verifyOtp first when applicable
    if (isSupabaseConfigured()) {
      const serverClient = getSupabaseServerClient();
      if (serverClient) {
        try {
          const verifyRes =
            channel === "email"
              ? await serverClient.auth.verifyOtp({ email: target, token: code, type: "email" })
              : await serverClient.auth.verifyOtp({ phone: target, token: code, type: "sms" });

          if (!verifyRes.error && verifyRes.data) {
            return NextResponse.json(
              { verified: true, channel, target, verifiedAt: new Date().toISOString() },
              { status: 200, headers: rl.headers }
            );
          }
        } catch {
          // Fall through to hashed verification ledger
        }

        // 2. Check Postgres verification_otps table when service role is configured
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const { data: otpRow } = await serverClient
            .from("verification_otps")
            .select("*")
            .eq("channel", channel)
            .eq("target", target)
            .is("verified_at", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (otpRow) {
            if (new Date(otpRow.expires_at).getTime() < Date.now()) {
              return NextResponse.json(
                { error: "Verification code expired. Please request a new code." },
                { status: 400 }
              );
            }
            if (otpRow.attempts >= otpRow.max_attempts) {
              return NextResponse.json(
                { error: "Maximum attempts reached. Please request a new code." },
                { status: 429 }
              );
            }
            if (otpRow.code_hash === candidateHash) {
              const verifiedAt = new Date().toISOString();
              await serverClient
                .from("verification_otps")
                .update({ verified_at: verifiedAt })
                .eq("id", otpRow.id);
              return NextResponse.json(
                { verified: true, channel, target, verifiedAt },
                { status: 200, headers: rl.headers }
              );
            }
            await serverClient
              .from("verification_otps")
              .update({ attempts: otpRow.attempts + 1 })
              .eq("id", otpRow.id);
            return NextResponse.json(
              { error: "Incorrect 6-digit code. Please double-check and try again." },
              { status: 400 }
            );
          }
        }
      }
    }

    // 3. Fallback to in-memory hashed OTP ledger (dev / sandbox)
    const record = otpMemoryStore.get(storeKey);
    if (!record) {
      return NextResponse.json(
        { error: "No active verification code found. Please click Send Code first." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      otpMemoryStore.delete(storeKey);
      return NextResponse.json(
        { error: "Verification code expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (record.attempts >= record.maxAttempts) {
      otpMemoryStore.delete(storeKey);
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (record.codeHash !== candidateHash) {
      record.attempts += 1;
      return NextResponse.json(
        {
          error: `Incorrect code (${record.maxAttempts - record.attempts} attempts remaining).`,
        },
        { status: 400 }
      );
    }

    record.verified = true;
    otpMemoryStore.delete(storeKey);

    return NextResponse.json(
      {
        verified: true,
        channel,
        target,
        verifiedAt: new Date().toISOString(),
      },
      { status: 200, headers: rl.headers }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed." },
      { status: 500 }
    );
  }
}
