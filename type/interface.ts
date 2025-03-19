export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
  created_at?: Date;
  customer?: Customer;
}

export interface Customer {
  customer_id: string;
  address?: string;
  phone_no?: string;
  pincode?: number;
  age?: number;
  gender?: string;
  doctor_id?: string;
  user: User;
  cart?: Cart[];
  orders?: OrderTable[];
  payments?: Payment[];
  // Ignored in schema but included for completeness
  wishlist?: Wishlist[];
}

export interface Cart {
  cart_id: string;
  customer_id?: string;
  delivery_time?: Date;
  created_at?: Date;
  customer?: Customer;
  cart_items: CartItem[];
}
export interface CartItem {
  cart_id: string;
  product_id: string;
  quantity?: number;
  cart: Cart;
  product: Product;
}

export interface Product {
  product_id: string;
  product_name: string;
  product_type: string;
  product_quantity: string;
  product_img_link?: string;
  product_based_on_gender?: string;
  product_age_group?: string;
  product_price?: number;
  product_commission_percent?: number;
  product_mfg_date?: Date;
  product_exp_date?: Date;
  product_shop_id?: string;
  product_brand_id?: string;
  medicine_shop?: MedicineShop;
  brand?: Brand;
  cart_items?: CartItem[];
  order_items?: OrderItem[];
  // Ignored in schema but included for completeness
  wishlist?: Wishlist[];
}


export interface Brand {
  brand_id: string;
  brand_name: string;
  brand_location?: string;
  brand_official_phone?: string;
  products?: Product[];
}


export interface MedicineShop {
  shop_id: string;
  shop_name: string;
  shop_address: string;
  shop_phone_no?: string;
  products?: Product[];
}

export interface OrderTable {
  order_id: string;
  customer_id?: string;
  order_date?: Date;
  total_amount?: number;
  order_status: OrderStatus;
  shipping_address?: string;
  billing_address?: string;
  shipping_method?: string;
  customer?: Customer;
  order_items: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity?: number;
  price_per_unit?: number;
  order_table: OrderTable;
  product: Product;
}

export interface Payment {
  payment_id: string;
  order_id?: string;
  transaction_id?: string;
  total_price?: number;
  payment_method?: string;
  payment_status: PaymentStatus;
  payment_date?: Date;
  coupon_applied?: boolean;
  customer_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  customer?: Customer;
  order_table?: OrderTable;
}

export interface DoctorConsultation {
  doctor_id: string;
  doctor_name: string;
  doctor_address?: string;
  doctor_phone_no?: string;
  doctor_qualification: string;
  doctor_specialization: string;
  customers?: Customer[];
}

export interface Wishlist {
  customer_id: string;
  product_id: string;
  added_date?: Date;
  customer: Customer;
  product: Product;
}

/**
 * Request DTO for user creation/login
 */
export interface UserLoginRequest {
  id: string;
  email: string;
  name: string;
}

/**
 * Response DTO for user creation/login
 */
export interface UserLoginResponse {
  message: string;
  user: User;
}