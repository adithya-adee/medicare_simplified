import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getMedicines } from "@/lib/product";

export default async function Home() {
  const medicines = await getMedicines();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-blue-700 rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col justify-center z-20 p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your Trusted Online Pharmacy
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-md">
            Quality medicines and healthcare products delivered to your door.
          </p>
        </div>
      </section>

      {/* Medicines Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Medicines</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.length > 0 ? (
            medicines.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-zinc-500 py-12">
              No medicines found.
            </p>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-zinc-600">Reliable delivery for your health needs.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-zinc-600">Your transactions are safe and protected.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-zinc-600">Genuine products from trusted sources.</p>
          </div>
        </div>
      </section>
    </main>
  );
} 