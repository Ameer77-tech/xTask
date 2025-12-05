import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  // 1. Get the username/password from the frontend
  const body = await request.json();

  try {
    // 2. Forward the request to your actual Render Backend
    // We use the environment variable for the backend URL here
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

    // 3. Check if the backend rejected the login
    if (!backendData.success || !backendRes.ok) {
      return NextResponse.json(backendData, {
        status: backendRes.status || 401,
      });
    }

    // 4. THIS IS THE CRITICAL PART
    // We get the token from the backend's JSON response.
    // NOTE: Ensure your backend sends the token in the body, e.g., { token: "..." }
    const token = backendData.token || backendData.accessToken;

    if (token) {
      // 5. Set the cookie on the Next.js Domain (vercel.app)
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true, // Javascript can't read it (secure)
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax", // Allows it to be sent on navigation
        path: "/", // Available everywhere in the app
        maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
      });
    } else {
      console.error(
        "Login successful, but no token found in backend response body."
      );
    }

    // 6. Respond to the frontend telling it everything went well
    return NextResponse.json(backendData);
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, reply: "Internal Server Error" },
      { status: 500 }
    );
  }
}
