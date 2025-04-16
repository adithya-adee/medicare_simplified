import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

export default async function Home() {
  const featuredProducts = await db.product.findMany({
    where: {
      featured: true,
    },
    include: {
      category: true,
    },
    take: 6,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-zinc-900 rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col justify-center z-20 p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Shop the Latest Products
          </h1>
          <p className="text-xl text-zinc-200 mb-8 max-w-md">
            Discover our wide range of high-quality products at competitive prices.
          </p>
          <div>
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-zinc-500 py-12">
              No featured products found.
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            href="/products?category=electronics"
            className="bg-zinc-100 hover:bg-zinc-200 transition rounded-lg p-8 text-center"
          >
            <h3 className="text-xl font-semibold">Electronics</h3>
          </Link>
          <Link
            href="/products?category=clothing"
            className="bg-zinc-100 hover:bg-zinc-200 transition rounded-lg p-8 text-center"
          >
            <h3 className="text-xl font-semibold">Clothing</h3>
          </Link>
          <Link
            href="/products?category=home"
            className="bg-zinc-100 hover:bg-zinc-200 transition rounded-lg p-8 text-center"
          >
            <h3 className="text-xl font-semibold">Home & Kitchen</h3>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-zinc-600">Free delivery on orders over $50</p>
          </div>
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-zinc-600">Multiple payment methods accepted</p>
          </div>
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-zinc-600">Customer support available round the clock</p>
          </div>
        </div>
      </section>
    </main>
  );
} 