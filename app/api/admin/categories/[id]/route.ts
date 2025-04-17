import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Get a specific category
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }
    
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORY_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a category
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { name, description, image } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Check if a different category with the same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        NOT: { id: params.id }
      }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Another category with this name already exists" },
        { status: 400 }
      );
    }
    
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description,
        image,
      }
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORY_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }
    
    // Check if category has any products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { products: true } }
      }
    });
    
    if (!categoryWithProducts) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated products" },
        { status: 400 }
      );
    }
    
    await prisma.category.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 