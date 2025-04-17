"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  Calendar,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

// Order status badge color mapping
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
};

type Order = {
  id: string;
  userId: string;
  addressId: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  address: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/admin/orders/${params.id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);
  
  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    
    try {
      await axios.patch(`/api/admin/orders/${order.id}`, { status: newStatus });
      
      // Update the order in local state
      setOrder({ ...order, status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">Loading order details...</div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">Order not found</div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/orders">Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/orders/${order.id}`}>
                {order.id.substring(0, 8)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
            <div className="text-muted-foreground flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(order.createdAt).toLocaleDateString()}
              <Clock className="h-4 w-4 ml-3 mr-1" />
              {new Date(order.createdAt).toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <Select 
                value={order.status} 
                onValueChange={updateOrderStatus}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.PENDING}`}>
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="PROCESSING">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.PROCESSING}`}>
                      Processing
                    </span>
                  </SelectItem>
                  <SelectItem value="SHIPPED">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.SHIPPED}`}>
                      Shipped
                    </span>
                  </SelectItem>
                  <SelectItem value="DELIVERED">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.DELIVERED}`}>
                      Delivered
                    </span>
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.CANCELLED}`}>
                      Cancelled
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">{order.user.name || "Guest"}</p>
            <p className="text-muted-foreground">{order.user.email}</p>
            <div className="mt-3">
              <Link 
                href={`/admin/users?search=${order.user.email}`} 
                className="text-blue-600 hover:underline text-sm flex items-center"
              >
                View Customer Details
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-green-600" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span className="text-green-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Order Items
          </CardTitle>
          <CardDescription>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/admin/products/${item.productId}/edit`}
                          className="font-medium hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          ID: {item.productId.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatCurrency(item.price)}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <div className="w-full sm:w-1/3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 