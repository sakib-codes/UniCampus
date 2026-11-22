import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientRateLimitKey } from "@/lib/scalability/rateLimiter";

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  try {
    const rl = await checkRateLimit(getClientRateLimitKey(req, "pay:sslcz:callback"), {
      capacity: 25,
      refillPerSecond: 1,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many gateway callbacks." },
        { status: 429, headers: rl.headers }
      );
    }
    let status = "VALID";
    let tran_id = "";
    let val_id = "";

    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        status = formData.get("status")?.toString() || "VALID";
        tran_id = formData.get("tran_id")?.toString() || "";
        val_id = formData.get("val_id")?.toString() || "";
      } else {
        const json = await req.json().catch(() => ({}));
        status = json.status || "VALID";
        tran_id = json.tran_id || "";
        val_id = json.val_id || "";
      }
    } else {
      const { searchParams } = new URL(req.url);
      status = searchParams.get("status") || "VALID";
      tran_id = searchParams.get("tran_id") || "";
      val_id = searchParams.get("val_id") || "";
    }

    const redirectUrl = new URL("/payments", req.url);
    redirectUrl.searchParams.set("status", status);
    if (tran_id) redirectUrl.searchParams.set("tran_id", tran_id);
    if (val_id) redirectUrl.searchParams.set("val_id", val_id);

    return NextResponse.redirect(redirectUrl.toString(), 303);
  } catch {
    const fallbackUrl = new URL("/payments?status=CANCELLED", req.url);
    return NextResponse.redirect(fallbackUrl.toString(), 303);
  }
}
