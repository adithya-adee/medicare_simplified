// Doctor Consultation Interface
interface DoctorConsultation {
    doctor_id: string; // UUID
    doctor_name: string;
    doctor_address: string | null;
    doctor_phone_no: string | null;
    doctor_qualification: string;
    doctor_specialization: string;
  }
  
  // Customer Interface
  interface Customer {
    customer_id: string; // UUID
    name: string;
    address: string;
    phone_no: string | null;
    pincode: number;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    doctor_id: string | null; // UUID reference to doctor
  }
  
  // User Authentication Interface
  interface User {
    user_id: string; // UUID
    customer_id: string | null; // UUID reference to customer
    email: string;
    password: string | null; // Null for OAuth-only users
    created_at: Date;
    updated_at: Date;
  }
  
  // OAuth Account Interface
  interface Account {
    id: string; // UUID
    user_id: string; // UUID reference to user
    type: string;
    provider: string;
    provider_account_id: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
  }
  
  // Session Interface
  interface Session {
    id: string; // UUID
    session_token: string;
    user_id: string; // UUID reference to user
    expires: Date;
  }
  
  // Verification Token Interface
  interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
  }
  
  // Medicine Shop Interface
  interface MedicineShop {
    shop_id: string; // UUID
    shop_name: string;
    shop_address: string;
    shop_phone_no: string | null;
  }
  
  // Brand Interface
  interface Brand {
    brand_id: string; // UUID
    brand_name: string;
    brand_location: string | null;
    brand_official_phone: string | null;
  }
  
  // Product Interface
  interface Product {
    product_id: string; // UUID
    product_name: string;
    product_type: string;
    product_quantity: string;
    product_img_link: string | null;
    product_based_on_gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    product_age_group: 'INFANT' | 'CHILDREN' | 'ADULT' | 'ANY' | null;
    product_price: number;
    product_commission_percent: number;
    product_mfg_date: Date | null;
    product_exp_date: Date | null;
    product_shop_id: string; // UUID reference to shop
    product_brand_id: string; // UUID reference to brand
  }
  
  // Cart Interface
  interface Cart {
    cart_id: string; // UUID
    customer_id: string; // UUID reference to customer
    delivery_time: string | null; // Time in HH:MM:SS format
    created_at: Date;
  }
  
  // Cart Items Interface
  interface CartItem {
    cart_id: string; // UUID reference to cart
    product_id: string; // UUID reference to product
    quantity: number;
  }
  
  // Order Status Type
  type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  
  // Order Interface
  interface Order {
    order_id: string; // UUID
    customer_id: string; // UUID reference to customer
    order_date: Date;
    total_amount: number;
    order_status: OrderStatus;
    shipping_address: string | null;
    billing_address: string | null;
    shipping_method: string | null;
  }
  
  // Payment Status Type
  type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Payment Interface
  interface Payment {
    payment_id: string; // UUID
    order_id: string; // UUID reference to order
    transaction_id: string | null;
    total_price: number;
    payment_method: string | null;
    payment_status: PaymentStatus;
    payment_date: Date;
    coupon_applied: boolean;
    customer_id: string; // UUID reference to customer
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
  }
  
  // Order Items Interface
  interface OrderItem {
    order_id: string; // UUID reference to order
    product_id: string; // UUID reference to product
    quantity: number;
    price_per_unit: number;
  }
  
  // Wishlist Interface
  interface WishlistItem {
    customer_id: string; // UUID reference to customer
    product_id: string; // UUID reference to product
    added_date: Date;
  }
  