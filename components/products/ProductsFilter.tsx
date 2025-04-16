"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface ProductsFilterProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSort?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default function ProductsFilter({
  categories,
  selectedCategory,
  selectedSort,
  minPrice,
  maxPrice,
}: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localMinPrice, setLocalMinPrice] = useState(minPrice || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || "");
  const [localCategory, setLocalCategory] = useState(selectedCategory || "");
  const [localSort, setLocalSort] = useState(selectedSort || "newest");

  // Update local state when URL params change
  useEffect(() => {
    setLocalMinPrice(minPrice || "");
    setLocalMaxPrice(maxPrice || "");
    setLocalCategory(selectedCategory || "");
    setLocalSort(selectedSort || "newest");
  }, [minPrice, maxPrice, selectedCategory, selectedSort]);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or remove category
    if (localCategory) {
      params.set("category", localCategory);
    } else {
      params.delete("category");
    }

    // Set or remove sort
    if (localSort) {
      params.set("sort", localSort);
    } else {
      params.delete("sort");
    }

    // Set or remove price range
    if (localMinPrice) {
      params.set("min", localMinPrice);
    } else {
      params.delete("min");
    }

    if (localMaxPrice) {
      params.set("max", localMaxPrice);
    } else {
      params.delete("max");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalCategory("");
    setLocalSort("newest");
    router.push("/products");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="font-medium">Categories</h3>
          <RadioGroup
            value={localCategory}
            onValueChange={(value) => setLocalCategory(value)}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="category-all" />
                <Label htmlFor="category-all" className="cursor-pointer">
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.name} id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-3">
          <h3 className="font-medium">Price Range</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="min-price">Min Price</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="$0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Max Price</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="$1000"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sort Filter */}
        <div className="space-y-3">
          <h3 className="font-medium">Sort By</h3>
          <RadioGroup
            value={localSort}
            onValueChange={(value) => setLocalSort(value)}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest" className="cursor-pointer">
                  Newest
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low-high" id="sort-price-low-high" />
                <Label htmlFor="sort-price-low-high" className="cursor-pointer">
                  Price: Low to High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high-low" id="sort-price-high-low" />
                <Label htmlFor="sort-price-high-low" className="cursor-pointer">
                  Price: High to Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-a-z" id="sort-name-a-z" />
                <Label htmlFor="sort-name-a-z" className="cursor-pointer">
                  Name: A to Z
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-z-a" id="sort-name-z-a" />
                <Label htmlFor="sort-name-z-a" className="cursor-pointer">
                  Name: Z to A
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 