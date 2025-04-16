import { User, Role } from "@prisma/client";

export type ExtendedUser = User & {
  role: Role;
};

// NextAuth types extension
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

// Product related types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface CartWithItems {
  id: string;
  items: CartItem[];
  total: number;
}

// Form related types
export interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  discount?: number;
} 