"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  ArrowLeft, 
  ArrowRight,
  Folder,
  ShoppingBag
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  _count: {
    products: number;
  };
};

export default function CategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (editingCategory) {
        await axios.patch(`/api/admin/categories/${editingCategory.id}`, data);
        toast({
          title: "Category Updated",
          description: "Category has been updated successfully.",
        });
      } else {
        await axios.post("/api/admin/categories", data);
        toast({
          title: "Category Created",
          description: "New category has been created successfully.",
        });
      }
      setOpenDialog(false);
      form.reset();
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axios.delete(`/api/admin/categories/${categoryId}`);
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. It may have associated products.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    form.reset({
      name: "",
      description: "",
      image: "",
    });
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 mr-2 text-blue-500" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
                        {category._count.products}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Edit the details of this category." 
                : "Create a new product category."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Medicines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of this category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenDialog(false);
                    form.reset();
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 