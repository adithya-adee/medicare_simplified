"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { UserCog, Search, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  image: string | null;
  _count: {
    orders: number;
  };
};

type PaginationData = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
};

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(search);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) {
        params.set("search", search);
      }
      
      const response = await axios.get(`/api/admin/users?${params.toString()}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [page, search]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    params.set("page", "1"); // Reset to first page on new search
    router.push(`/admin/users?${params.toString()}`);
  };
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/users?${params.toString()}`);
  };
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      
      {/* Search bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({pagination.totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Anonymous"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={user.role} 
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">
                            <Badge variant="secondary">USER</Badge>
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            <Badge variant="default">ADMIN</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{user._count.orders}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <UserCog className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 