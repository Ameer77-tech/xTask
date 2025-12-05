// app/api/login/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1️⃣ Get login data from frontend
    const body = await request.json();

    // 2️⃣ Forward the request to your backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/verify-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const backendData = await backendRes.json();

    // 3️⃣ If backend login fails, return the error
    if (!backendData.success || !backendRes.ok) {
      return NextResponse.json(backendData, {
        status: backendRes.status || 401,
      });
    }

    // 4️⃣ Extract token from backend response
    const token = backendData.token || backendData.accessToken;

    if (token) {
      // 5️⃣ Set cookie on Next.js domain (vercel.app)
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true, // JS cannot access the cookie
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax", // "lax" is fine for first-party navigation
        path: "/", // Available everywhere
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      console.error(
        "Login successful, but no token found in backend response."
      );
    }

    // 6️⃣ Respond to frontend
    return NextResponse.json(backendData);
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, reply: "Internal Server Error" },
      { status: 500 }
    );
  }
}
