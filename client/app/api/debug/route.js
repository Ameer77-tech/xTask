import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("token");
  console.log("SERVER COMPONENT RECEIVED COOKIE:", token);

  return Response.json({
    receivedCookie: token ?? null,
  });
}
