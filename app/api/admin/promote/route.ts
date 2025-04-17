import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// This route is specifically for making the first admin user
// Restricted by email to ensure security
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Check if there are any admins already
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });
    
    // Find the user to promote
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // If there are admins already, only existing admins can create new ones
    if (adminCount > 0) {
      const session = await auth();
      
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Not authorized. Only admins can promote users." },
          { status: 403 }
        );
      }
    }
    
    // Update the user to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" }
    });
    
    return NextResponse.json({
      success: true,
      message: `User ${email} has been promoted to ADMIN`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("[ADMIN_PROMOTE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 