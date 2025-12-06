import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, reply: "No token found" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/feedback`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: `${token.name}=${token.value}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    const res = await response.json();
    if (!res.success) {
      return NextResponse.json(
        { reply: res.reply, success: false },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { reply: res.reply, success: true },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json({ reply: err, success: false }, { status: 500 });
  }
}
