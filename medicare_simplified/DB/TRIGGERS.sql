CREATE TRIGGER update_user_timestamp BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_account_timestamp BEFORE UPDATE ON "Account" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_category_timestamp BEFORE UPDATE ON "Category" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_product_timestamp BEFORE UPDATE ON "Product" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_review_timestamp BEFORE UPDATE ON "Review" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_cart_timestamp BEFORE UPDATE ON "Cart" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_cartitem_timestamp BEFORE UPDATE ON "CartItem" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_address_timestamp BEFORE UPDATE ON "Address" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_payment_timestamp BEFORE UPDATE ON "Payment" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_order_timestamp BEFORE UPDATE ON "Order" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_orderitem_timestamp BEFORE UPDATE ON "OrderItem" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
