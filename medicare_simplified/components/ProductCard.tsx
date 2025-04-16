"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, Category } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@//hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product & {
    category: Category;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async () => {
    try {
      setIsLoading(true);
      // This would typically be an API call to add to cart
      // For now, we'll just show a toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      
      // For now, let's pretend we added to cart
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Calculate the final price with discount
  const finalPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative bg-zinc-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400">
              No Image
            </div>
          )}
          {product.discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-zinc-500">{product.category.name}</p>
          {product.stock <= 0 && (
            <span className="text-sm text-red-500">Out of Stock</span>
          )}
        </div>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold mb-1">{product.name}</h3>
        </Link>
        {product.brand && (
          <p className="text-sm text-zinc-600 mb-2">Brand: {product.brand}</p>
        )}
        <div className="flex items-center gap-2">
          <p className="font-bold">${finalPrice.toFixed(2)}</p>
          {product.discount && (
            <p className="text-zinc-500 line-through text-sm">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={addToCart} 
          className="w-full" 
          disabled={product.stock <= 0 || isLoading}
          variant={product.stock <= 0 ? "outline" : "default"}
        >
          {isLoading 
            ? "Adding..." 
            : product.stock <= 0 
              ? "Out of Stock" 
              : "Add to Cart"
          }
        </Button>
      </CardFooter>
    </Card>
  );
} 