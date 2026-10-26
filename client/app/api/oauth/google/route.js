import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  let token = searchParams.get("token");

  if (code) {
    const backendUrl =
      process.env.XTASK_BACKEND_URL ||
      process.env.NEXT_PUBLIC_XTASK_BACKEND ||
      "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/auth/exchange-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.token) {
        token = data.token;
      }
    } catch (err) {
      console.error("Failed to exchange OAuth authorization code:", err);
    }
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url)
    );
  }

  const redirectTo = new URL("/", request.url);
  const res = NextResponse.redirect(redirectTo);

  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
