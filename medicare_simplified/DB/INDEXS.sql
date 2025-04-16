-- Index definitions to improve performance
CREATE INDEX idx_product_category ON "Product"("categoryId");
CREATE INDEX idx_product_price ON "Product"("price");
CREATE INDEX idx_product_featured ON "Product"("featured");
CREATE INDEX idx_product_stock ON "Product"("stock");
CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_order_status ON "Order"("status");
CREATE INDEX idx_review_product ON "Review"("productId");
CREATE INDEX idx_cart_item_cart ON "CartItem"("cartId");
CREATE INDEX idx_address_user ON "Address"("userId");
CREATE INDEX idx_order_item_order ON "OrderItem"("orderId");
CREATE INDEX idx_product_name_gin ON "Product" USING gin(to_tsvector('english', "name"));
CREATE INDEX idx_product_description_gin ON "Product" USING gin(to_tsvector('english', COALESCE("description", '')));