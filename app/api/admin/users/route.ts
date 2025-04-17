import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    
    // Get query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause for search
    const where: Prisma.UserWhereInput = search 
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      } 
      : {};
    
    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          image: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    console.error("[ADMIN_GET_USERS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 