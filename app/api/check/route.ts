import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("user_id");
    
    if (!userIdCookie || !userIdCookie.value) {
      return NextResponse.json({ authorized: false });
    }
    
    return NextResponse.json({ authorized: true });
  } catch (error) {
    console.error("Authorization check error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}