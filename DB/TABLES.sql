CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP,
  "hashedPassword" TEXT,
  "image" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  UNIQUE("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- CREATE TABLE "VerificationToken" (
--   "identifier" TEXT NOT NULL,
--   "token" TEXT NOT NULL UNIQUE,
--   "expires" TIMESTAMP NOT NULL,
--   UNIQUE("identifier", "token")
-- );

CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "images" TEXT[] NOT NULL DEFAULT '{}',
  "featured" BOOLEAN NOT NULL DEFAULT FALSE,
  "discount" DECIMAL(10, 2),
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE TABLE "Cart" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "userId" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "CartItem" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "quantity" INTEGER NOT NULL,
  "cartId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
);

CREATE TABLE "Address" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "userId" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "amount" DECIMAL(10, 2) NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "transactionId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "userId" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "total" DECIMAL(10, 2) NOT NULL,
  "addressId" TEXT NOT NULL,
  "paymentId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id"),
  FOREIGN KEY ("addressId") REFERENCES "Address"("id"),
  FOREIGN KEY ("paymentId") REFERENCES "Payment"("id")
);

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT generate_cuid(),
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
);



