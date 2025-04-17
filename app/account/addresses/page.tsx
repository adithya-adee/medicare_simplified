"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Home, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

// Address type definition
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/account/addresses");
      return;
    }

    // Fetch addresses if authenticated
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/addresses");
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update default address");

      // Update addresses list
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${addressId}/delete`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to delete address");

      // Update addresses list
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Addresses</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <nav className="space-y-1">
              <Link
                href="/account"
                className="block w-full py-2 px-3 text-left rounded-md text-gray-700 hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link
                href="/account/orders"
                className="block w-full py-2 px-3 text-left rounded-md text-gray-700 hover:bg-gray-50"
              >
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="block w-full py-2 px-3 text-left rounded-md bg-blue-50 text-blue-700 font-medium"
              >
                My Addresses
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Link href="/account/addresses/new">
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </Link>
            </div>

            {addresses.length > 0 ? (
              <div className="grid gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 relative"
                  >
                    {address.isDefault && (
                      <Badge
                        className="absolute top-4 right-4"
                        variant="secondary"
                      >
                        Default
                      </Badge>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        {address.isDefault ? (
                          <Home className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MapPin className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-gray-600">{address.country}</p>

                        <div className="flex gap-4 mt-4">
                          <Link href={`/account/addresses/${address.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="mr-2 h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                          {!address.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDefaultAddress(address.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => deleteAddress(address.id)}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-dashed border-2 rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No addresses saved yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Add an address to make checkout faster and set delivery
                  locations.
                </p>
                <Link href="/account/addresses/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Address
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
