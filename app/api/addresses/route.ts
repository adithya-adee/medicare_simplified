import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAddress, getUserAddresses } from "@/lib/address";

// Get all addresses for the authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const addresses = await getUserAddresses(session.user.id);
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESSES_GET]", error);
    return NextResponse.json(
      { error: "Failed to get addresses" },
      { status: 500 }
    );
  }
}

// Create a new address for the authenticated user
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { street, city, state, postalCode, country, isDefault } = body;

    if (!street || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const address = await createAddress(session.user.id, {
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || false,
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESSES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
