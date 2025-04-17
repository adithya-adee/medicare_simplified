import Link from "next/link";
import { 
  Plus, 
  Pencil, 
  Trash2,
  Tag,
  DollarSign,
  Package
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/db";

// This is a server component - no "use client" directive needed

export default async function ProductsPage() {
  // Fetch products directly with Prisma
  const products: any[] = await prisma.$queryRaw`
    SELECT 
      p.*,
      c.id as "categoryId",
      c.name as "categoryName",
      c.description as "categoryDescription",
      c.image as "categoryImage"
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    ORDER BY p."updatedAt" DESC
  `;

  // Transform the raw query results to add the nested category object
  const formattedProducts = products.map((product: any) => ({
    ...product,
    category: product.categoryId ? {
      id: product.categoryId,
      name: product.categoryName,
      description: product.categoryDescription,
      image: product.categoryImage
    } : null
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      
      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({formattedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No products found. Try seeding the database with sample products.
                  </TableCell>
                </TableRow>
              ) : (
                formattedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        {product.category?.name || "No Category"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        {formatCurrency(product.price)}
                        {product.discount && (
                          <span className="ml-2 text-sm text-red-500">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={product.stock < 10 ? "text-red-500" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        {/* For deletion, we need a separate client component since server components can't handle events */}
                        <form action={`/api/admin/products/${product.id}/delete`} method="post">
                          <Button 
                            type="submit"
                            variant="outline" 
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Debug link */}
      <div className="text-sm text-gray-500 mt-4">
        <Link href="/admin/products/debug" className="hover:underline">
          Debug Products
        </Link>
      </div>
    </div>
  );
}