import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Debug route that doesn't require authentication
export async function GET() {
  try {
    // Basic query to check if we can access the database
    const productCount = await prisma.product.count();
    
    // Sample query to check if we can retrieve products
    const sampleProducts = await prisma.product.findMany({
      take: 2,
      include: { category: true }
    });
    
    return NextResponse.json({
      status: "success",
      message: "Debug endpoint working",
      productCount,
      sampleProducts
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 