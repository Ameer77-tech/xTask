// app/api/signup/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token");


    if (!token) {
      return NextResponse.json(
        { success: false, reply: "Authentication token missing" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/tasks/add-task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${token.name}=${token.value}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, reply: data.reply },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reply: data.reply,
        created: data.created,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
