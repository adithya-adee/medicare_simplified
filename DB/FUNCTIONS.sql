-- Enable UUID extension for CUID generation simulation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to generate CUID-like IDs
CREATE OR REPLACE FUNCTION generate_cuid()
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    'c' || 
    encode(gen_random_bytes(4), 'hex') || 
    to_char(NOW(), 'YYYYMMDDHH24MISS') || 
    encode(gen_random_bytes(4), 'hex')
  );
END;
$$ LANGUAGE plpgsql;


-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id TEXT,
  p_status "OrderStatus"
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE "Order"
  SET "status" = p_status,
      "updatedAt" = CURRENT_TIMESTAMP
  WHERE "id" = p_order_id;
  
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to search products with various filters
CREATE OR REPLACE FUNCTION search_products(
  p_query TEXT DEFAULT NULL,
  p_category_id TEXT DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_min_rating INTEGER DEFAULT NULL,
  p_in_stock BOOLEAN DEFAULT TRUE,
  p_sort_by TEXT DEFAULT 'name',
  p_sort_order TEXT DEFAULT 'asc',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  price DECIMAL,
  final_price DECIMAL,
  stock INTEGER,
  images TEXT[],
  featured BOOLEAN,
  discount DECIMAL,
  category_id TEXT,
  category_name TEXT,
  average_rating DECIMAL,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    CASE 
      WHEN p.discount IS NOT NULL THEN (p.price - (p.price * p.discount))::DECIMAL(10, 2)
      ELSE p.price
    END AS final_price,
    p.stock,
    p.images,
    p.featured,
    p.discount,
    p.categoryId AS category_id,
    c.name AS category_name,
    COALESCE(AVG(r.rating), 0)::DECIMAL(10, 2) AS average_rating,
    COUNT(r.id) AS review_count
  FROM "Product" p
  JOIN "Category" c ON p.categoryId = c.id
  LEFT JOIN "Review" r ON p.id = r.productId
  WHERE 
    (p_query IS NULL OR p.name ILIKE '%' || p_query || '%' OR p.description ILIKE '%' || p_query || '%') AND
    (p_category_id IS NULL OR p.categoryId = p_category_id) AND
    (p_min_price IS NULL OR p.price >= p_min_price) AND
    (p_max_price IS NULL OR p.price <= p_max_price) AND
    (NOT p_in_stock OR p.stock > 0)
  GROUP BY p.id, p.name, p.description, p.price, p.stock, p.images, p.featured, p.discount, p.categoryId, c.name
  HAVING (p_min_rating IS NULL OR COALESCE(AVG(r.rating), 0) >= p_min_rating)
  ORDER BY 
    CASE WHEN p_sort_by = 'name' AND p_sort_order = 'asc' THEN p.name END ASC,
    CASE WHEN p_sort_by = 'name' AND p_sort_order = 'desc' THEN p.name END DESC,
    CASE WHEN p_sort_by = 'price' AND p_sort_order = 'asc' THEN p.price END ASC,
    CASE WHEN p_sort_by = 'price' AND p_sort_order = 'desc' THEN p.price END DESC,
    CASE WHEN p_sort_by = 'rating' AND p_sort_order = 'asc' THEN AVG(r.rating) END ASC,
    CASE WHEN p_sort_by = 'rating' AND p_sort_order = 'desc' THEN AVG(r.rating) END DESC,
    CASE WHEN p_sort_by = 'created' AND p_sort_order = 'asc' THEN p.createdAt END ASC,
    CASE WHEN p_sort_by = 'created' AND p_sort_order = 'desc' THEN p.createdAt END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

