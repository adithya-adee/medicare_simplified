import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// This handles the form POST requests for deleting products
export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  // Check auth
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = params.productId;

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    // Check if the product exists using $queryRaw instead of findUnique
    const productExists: any[] = await prisma.$queryRaw`
      SELECT id FROM "Product" WHERE id = ${productId} LIMIT 1
    `;

    if (productExists.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product using $executeRaw instead of delete
    await prisma.$executeRaw`
      DELETE FROM "Product" WHERE id = ${productId}
    `;

    // Redirect back to the products page after successful deletion
    return redirect("/admin/products");
  } catch (error) {
    console.error(`Failed to delete product ${productId}:`, error);
    
    // Return an error response
    return NextResponse.json({ 
      error: "Failed to delete product",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 