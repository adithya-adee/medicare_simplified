CREATE VIEW vw_products AS
SELECT 
  p.*,
  c.name AS category_name,
  c.description AS category_description,
  COALESCE(
    (SELECT AVG(r.rating) FROM "Review" r WHERE r."productId" = p.id),
    0
  ) AS average_rating,
  COALESCE(
    (SELECT COUNT(*) FROM "Review" r WHERE r."productId" = p.id),
    0
  ) AS review_count,
  CASE 
    WHEN p.discount IS NOT NULL THEN p.price - (p.price * p.discount)
    ELSE p.price
  END AS final_price
FROM "Product" p
JOIN "Category" c ON p."categoryId" = c.id;

-- View for categories with product counts
CREATE VIEW vw_categories AS
SELECT 
  c.*,
  COALESCE(COUNT(p.id), 0) AS product_count,
  COALESCE(AVG(p.price), 0) AS avg_product_price
FROM "Category" c
LEFT JOIN "Product" p ON c.id = p."categoryId"
GROUP BY c.id;

-- View for user orders with summary
CREATE VIEW vw_user_orders AS
SELECT 
  u.id AS user_id,
  u.name AS user_name,
  u.email AS user_email,
  COUNT(o.id) AS total_orders,
  COALESCE(SUM(o.total), 0) AS total_spent,
  MAX(o."createdAt") AS last_order_date
FROM "User" u
LEFT JOIN "Order" o ON u.id = o."userId"
GROUP BY u.id, u.name, u.email;

-- View for product inventory status
CREATE VIEW vw_inventory_status AS
SELECT 
  p.id,
  p.name,
  p.stock,
  c.name AS category,
  CASE 
    WHEN p.stock = 0 THEN 'Out of Stock'
    WHEN p.stock < 10 THEN 'Low Stock'
    WHEN p.stock < 50 THEN 'Moderate Stock'
    ELSE 'Well Stocked'
  END AS stock_status
FROM "Product" p
JOIN "Category" c ON p."categoryId" = c.id;
