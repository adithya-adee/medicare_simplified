'use server';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Customer, User } from "@/type/interface"; // Importing interfaces

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'phone_no', 'pincode', 'age', 'gender', 'email', 'password'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate pincode and age according to schema CHECK constraints
    if (Number(data.pincode) < 100001 || Number(data.pincode) > 999998) {
      return NextResponse.json(
        { success: false, message: "Pincode must be between 100001 and 999998" },
        { status: 400 }
      );
    }
    
    if (Number(data.age) < 1 || Number(data.age) > 149) {
      return NextResponse.json(
        { success: false, message: "Age must be between 1 and 149" },
        { status: 400 }
      );
    }
    
    // Validate gender enum
    if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
      return NextResponse.json(
        { success: false, message: "Gender must be one of: MALE, FEMALE, OTHER" },
        { status: 400 }
      );
    }
    
    // Use a transaction to ensure both records are created or neither is
    const result = await prisma.$transaction(async (tx) => {
      // Create customer record
      const customer = await tx.customer.create({
        data: {
          name: data.name,
          address: data.address,
          phone_no: data.phone_no,
          pincode: Number(data.pincode),
          age: Number(data.age),
          gender: data.gender,
          doctor_id: data.doctor_id || null
        }
      });
      
      // Create user record linked to customer
      const user = await tx.users.create({
        data: {
          customer_id: customer.customer_id,
          email: data.email.toLowerCase(),
          password: data.password,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      // If this is OAuth registration, create account record
      if (data.auth_type !== 'email' && data.provider) {
        await tx.accounts.create({
          data: {
            user_id: user.user_id,
            type: 'oauth',
            provider: data.provider,
            provider_account_id: data.provider_account_id || data.email,
            // Add other fields as needed from OAuth provider
          }
        });
      }
      
      // Create empty cart for the customer
      await tx.cart.create({
        data: {
          customer_id: customer.customer_id,
        }
      });
      
      return { user, customer };
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Registration successful",
        user_id: result.user.user_id,
        customer_id: result.customer.customer_id
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('unique constraint')) {
      if (error.message.includes('email')) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Registration failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}