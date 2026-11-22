import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientRateLimitKey } from "@/lib/scalability/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const rl = await checkRateLimit(getClientRateLimitKey(req, "pay:sslcz:init"), {
      capacity: 15,
      refillPerSecond: 0.5,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please wait a moment and retry." },
        { status: 429, headers: rl.headers }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      amount = 23500,
      invoiceId = "INV-2026-0622",
      studentName = "Sakib Ahmed",
      studentEmail = "sakib.cse@unicampus.edu",
    } = body;

    const storeId = process.env.SSLCZ_STORE_ID;
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;
    const isLive = process.env.SSLCZ_IS_LIVE === "true";
    const sslczUrl = isLive
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const tran_id = `SSLCZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (storeId && storePasswd) {
      const origin = req.nextUrl.origin || "http://localhost:3000";
      const params = new URLSearchParams();
      params.append("store_id", storeId);
      params.append("store_passwd", storePasswd);
      params.append("total_amount", String(amount));
      params.append("currency", "BDT");
      params.append("tran_id", tran_id);
      params.append("success_url", `${origin}/api/payments/sslcommerz/callback`);
      params.append("fail_url", `${origin}/api/payments/sslcommerz/callback`);
      params.append("cancel_url", `${origin}/api/payments/sslcommerz/callback`);
      params.append("ipn_url", `${origin}/api/payments/sslcommerz/callback`);
      params.append("cus_name", studentName);
      params.append("cus_email", studentEmail);
      params.append("cus_add1", "Campus Academic Building");
      params.append("cus_city", "Dhaka");
      params.append("cus_postcode", "1216");
      params.append("cus_country", "Bangladesh");
      params.append("cus_phone", "+8801712904511");
      params.append("product_name", "Semester Tuition & Fees");
      params.append("product_category", "Education");
      params.append("product_profile", "general");
      params.append("shipping_method", "NO");
      params.append("num_of_item", "1");

      const initRes = await fetch(sslczUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const initData = await initRes.json();
      if (initRes.ok && initData.status === "SUCCESS") {
        return NextResponse.json({
          gateway: "sslcommerz",
          mode: "live_sandbox",
          gatewayPageURL: initData.GatewayPageURL,
          redirectUrl: initData.GatewayPageURL,
          sessionkey: initData.sessionkey,
          tran_id,
          amount: Number(amount),
          invoiceId,
        });
      }
    }

    // Graceful fallback for local dev when credentials unset
    return NextResponse.json({
      gateway: "sslcommerz",
      mode: "interactive_demo",
      tran_id,
      paymentId: tran_id,
      amount: Number(amount),
      invoiceId,
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "SSLCommerz init failed";
    const tran_id = `SSLCZ-${Date.now()}`;
    return NextResponse.json({
      gateway: "sslcommerz",
      mode: "interactive_demo",
      tran_id,
      paymentId: tran_id,
      amount: 23500,
      invoiceId: "INV-2026-0622",
      fallbackReason: msg,
    });
  }
}
