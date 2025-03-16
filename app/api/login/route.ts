'use server'

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get email from URL query parameters instead of request body
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // First find the user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (!user.customer_id) {
      return NextResponse.json({ error: "Customer ID is not available" }, { status: 404 });
    }

    // Get comprehensive customer data with all relations
    const customerData = await prisma.customer.findUnique({
      where: { customer_id: user.customer_id },
      include: {
        // Include doctor information
        doctor_consultation: true,
        
        // Include cart and cart items with product details
        cart: {
          include: {
            cart_items: {
              include: {
                product: {
                  include: {
                    medicine_shop: true,
                    brand: true
                  }
                }
              }
            }
          }
        },
        
        // Include orders with payment and order items
        order_table: {
          include: {
            payment: true,
            order_items: {
              include: {
                product: true
              }
            }
          }
        },
        
        // Include wishlist items with product details
        wishlist: {
          include: {
            product: true
          }
        }
      }
    });

    if (!customerData) {
      return NextResponse.json({ error: "Customer data not found" }, { status: 404 });
    }

    return NextResponse.json({ customer: customerData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
