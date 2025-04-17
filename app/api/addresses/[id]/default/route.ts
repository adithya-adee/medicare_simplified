import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAddressById, setDefaultAddress } from "@/lib/address";

// Set address as default
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
    
    // If already default, no action needed
    if (address.isDefault) {
      return NextResponse.json({ success: true, message: "Already default" });
    }
    
    await setDefaultAddress(session.user.id, params.id);
    
    return NextResponse.json({ 
      success: true,
      message: "Address set as default"
    });
  } catch (error) {
    console.error("[ADDRESS_SET_DEFAULT]", error);
    return NextResponse.json(
      { error: "Failed to set address as default" },
      { status: 500 }
    );
  }
} 