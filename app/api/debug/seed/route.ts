import { NextResponse } from "next/server";
import { seedProducts } from "@/lib/scripts/seed-products";

export async function GET() {
  try {
    await seedProducts();
    return NextResponse.json({
      status: "success",
      message: "Products seeded successfully",
    });
  } catch (error) {
    console.error("Product seeding error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 