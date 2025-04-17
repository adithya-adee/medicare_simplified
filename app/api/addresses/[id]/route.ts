import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAddressById, updateAddress, deleteAddress } from "@/lib/address";
import { prisma } from "@/lib/db";

// Get a specific address
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const address = await getAddressById(params.id);
    
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    
    // Ensure the user owns the address
    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESS_GET]", error);
    return NextResponse.json(
      { error: "Failed to get address" },
      { status: 500 }
    );
  }
}

// Update a specific address
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const address = await getAddressById(params.id);
    
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    
    // Ensure the user owns the address
    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    const body = await req.json();
    const { street, city, state, postalCode, country, isDefault } = body;
    
    const updatedAddress = await updateAddress(params.id, session.user.id, {
      ...(street !== undefined && { street }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(postalCode !== undefined && { postalCode }),
      ...(country !== undefined && { country }),
      ...(isDefault !== undefined && { isDefault }),
    });
    
    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("[ADDRESS_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// Delete a specific address
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const address = await getAddressById(params.id);
    
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    
    // Ensure the user owns the address
    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    // Prevent deletion of the default address if it's the only address
    if (address.isDefault) {
      const userAddresses = await prisma.address.findMany({
        where: { userId: session.user.id },
      });
      
      if (userAddresses.length === 1) {
        return NextResponse.json(
          { error: "Cannot delete the only address" },
          { status: 400 }
        );
      }
    }
    
    await deleteAddress(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADDRESS_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
} 