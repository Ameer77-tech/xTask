import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let token = url.searchParams.get("token");

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
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }

  const response = NextResponse.redirect(new URL("/tasks", request.url));
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
