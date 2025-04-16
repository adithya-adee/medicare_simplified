"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Medicare Simplified</h3>
            <p className="text-muted-foreground">
              Your one-stop shop for everything you need.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Categories</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="text-muted-foreground">Medicare Simplified</p>
            <p className="text-muted-foreground">Email: adithya25905@gmail.com</p>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Medicare Simplified. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 