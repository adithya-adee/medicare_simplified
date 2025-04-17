import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Users, Package, ShoppingCart, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [
    userCount,
    productCount,
    categoryCount,
    orderCount,
    totalRevenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: { status: { not: "CANCELLED" } }
    })
  ]);

  const revenue = totalRevenue._sum.total || 0;

  return {
    userCount,
    productCount,
    categoryCount,
    orderCount,
    revenue
  };
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        take: 1,
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
            <p className="text-xs text-muted-foreground">Available products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoryCount}</div>
            <p className="text-xs text-muted-foreground">Available Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The dashboard is currently in development. More analytics and data visualization will be added soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-orders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center">
                View All Orders
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">
                          Order #{order.id.substring(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.user.name || order.user.email}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(order.total)}</div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                              order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" : 
                              order.status === "SHIPPED" ? "bg-purple-100 text-purple-800" : 
                              order.status === "DELIVERED" ? "bg-green-100 text-green-800" : 
                              "bg-red-100 text-red-800"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                      View All Orders →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No orders have been placed yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 