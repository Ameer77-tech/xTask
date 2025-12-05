import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, reply: "No token found" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/delete-account`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Forward the cookie correctly
          Cookie: `${token.name}=${token.value}`,
        },
        credentials: "include",
      }
    );

    const resData = await backendRes.json();

    if (!resData.success) {
      return NextResponse.json(
        { success: false, reply: resData.reply },
        { status: backendRes.status || 500 }
      );
    }

    // Optionally delete the cookie on the frontend domain
    cookieStore.set("token", "", {
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Account Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
