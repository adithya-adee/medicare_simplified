import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Simple query to fetch all products with their categories using raw SQL
    const products: any[] = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.id as "categoryId",
        c.name as "categoryName",
        c.description as "categoryDescription",
        c.image as "categoryImage"
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p."updatedAt" DESC
    `;

    // Transform the raw query results to add the nested category object
    const formattedProducts = products.map((product: any) => ({
      ...product,
      category: product.categoryId ? {
        id: product.categoryId,
        name: product.categoryName,
        description: product.categoryDescription,
        image: product.categoryImage
      } : null
    }));

    console.log(`Found ${formattedProducts.length} products`);
    
    // Return all products
    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
