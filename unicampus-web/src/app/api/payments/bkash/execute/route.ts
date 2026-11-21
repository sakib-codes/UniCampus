import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { paymentID, otp, pin, mode = "interactive_demo" } = body;

    const baseUrl =
      process.env.BKASH_BASE_URL ||
      "https://tokenized.sandbox.bka.sh/v1.2.0-beta";
    const appKey = process.env.BKASH_APP_KEY;
    const appSecret = process.env.BKASH_APP_SECRET;
    const username = process.env.BKASH_USERNAME;
    const password = process.env.BKASH_PASSWORD;

    if (
      mode === "live_sandbox" &&
      appKey &&
      appSecret &&
      username &&
      password
    ) {
      const tokenRes = await fetch(
        `${baseUrl}/tokenized/checkout/token/grant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username,
            password,
          },
          body: JSON.stringify({
            app_key: appKey,
            app_secret: appSecret,
          }),
        }
      );
      const tokenData = await tokenRes.json();
      if (tokenRes.ok && tokenData.id_token) {
        const execRes = await fetch(
          `${baseUrl}/tokenized/checkout/execute`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: tokenData.id_token,
              "X-APP-Key": appKey,
            },
            body: JSON.stringify({ paymentID }),
          }
        );
        const execData = await execRes.json();
        if (execRes.ok && execData.statusCode === "0000") {
          return NextResponse.json({
            status: "Completed",
            trxID:
              execData.trxID || `BK${Date.now().toString().slice(-8)}`,
            paymentID,
            paidAt: new Date().toISOString(),
          });
        }
        return NextResponse.json(
          {
            status: "Failed",
            message:
              execData.statusMessage || "Payment execution failed",
          },
          { status: 400 }
        );
      }
    }

    // Interactive Demo validation: Test OTP 123456, Test PIN 12121
    if (otp !== undefined && String(otp).trim() !== "123456") {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invalid bKash sandbox OTP. Use test OTP: 123456",
        },
        { status: 400 }
      );
    }

    if (pin !== undefined && String(pin).trim() !== "12121") {
      return NextResponse.json(
        {
          status: "Failed",
          message: "Invalid bKash sandbox PIN. Use test PIN: 12121",
        },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const generatedTrxId = `BK${datePart}${randomSuffix}`;

    return NextResponse.json({
      status: "Completed",
      trxID: generatedTrxId,
      paymentID: paymentID || `TR-BKASH-${Date.now()}`,
      paidAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Execution failed";
    return NextResponse.json(
      { status: "Failed", message: msg },
      { status: 500 }
    );
  }
}
