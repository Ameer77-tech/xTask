import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/verify-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        // Important: forward cookies if needed
        credentials: "include",
      },
    );

    const data = await backendRes.json();

    // Create a Next.js response
    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          reply: data.reply,
        },
        { status: backendRes.status },
      );
    }
    // If backend sends cookies, forward them
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      return NextResponse.json(
        {
          success: true,
          reply: data.reply,
        },
        {
          status: backendRes.status,
          headers: {
            "Set-Cookie": setCookie,
          },
        },
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, reply: "Something went wrong." },
      { status: 500 },
    );
  }
}
