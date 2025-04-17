import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAddressById, deleteAddress } from "@/lib/address";
import { prisma } from "@/lib/db";

// Delete address via POST (for form submissions)
export async function POST(
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
    
    // Redirect back to addresses page
    return NextResponse.redirect(new URL("/account/addresses", req.url));
  } catch (error) {
    console.error("[ADDRESS_DELETE_POST]", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
} 