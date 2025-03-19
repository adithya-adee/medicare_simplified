"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define a schema for input validation
const userSchema = z.object({
  id: z.string({ required_error: "User ID is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  name: z.string({ required_error: "Name is required" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, email, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });

    const cookieStore = await cookies();
    const userId = existingUser?.id || id;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week

    // Set cookie with recommended security options
    cookieStore.set({
      name: "user_id",
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User logged in successfully", user: existingUser },
        { status: 200 }
      );
    }

    // Create the user
    const createdUser = await prisma.user.create({
      data: { id, name, email },
    });

    return NextResponse.json(
      { message: "User created successfully", user: createdUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in login API:", error);

    // if (error.code === "P2002") {
    //   return NextResponse.json(
    //     { error: "A user with this email already exists" },
    //     { status: 409 }
    //   );
    // }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", user }, { status: 200 });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
