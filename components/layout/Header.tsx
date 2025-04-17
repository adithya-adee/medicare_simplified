"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Categories",
    href: "/categories",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Medicare Simplified
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                
              </Button>
            </Link>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Orders</Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold" onClick={() => setOpen(false)}>
                      Medicare Simplified
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`text-sm font-medium transition-colors ${
                          pathname === route.href
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 