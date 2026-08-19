import { queryDb } from './db';

/**
 * Initializes the Neon PostgreSQL database schema for Care & Beauty E-Commerce.
 */
export async function initializeDatabaseSchema() {
  console.log('[DB MIGRATION] Starting database schema initialization...');

  const schemaSql = `
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255),
      password_hash VARCHAR(255),
      full_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories Table
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Products Table
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      compare_price NUMERIC(10, 2),
      stock_quantity INT DEFAULT 0,
      image_url TEXT,
      images JSONB DEFAULT '[]',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders Table (Cashfree PG tracking)
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
      cashfree_order_id VARCHAR(100),
      cashfree_session_id TEXT,
      customer_name VARCHAR(100),
      customer_email VARCHAR(255),
      customer_phone VARCHAR(20),
      total_amount NUMERIC(10, 2) NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
      order_status VARCHAR(50) DEFAULT 'PROCESSING' CHECK (order_status IN ('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
      shipping_address JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Order Items Table
    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(36) PRIMARY KEY,
      order_id VARCHAR(36) REFERENCES orders(id) ON DELETE CASCADE,
      product_id VARCHAR(36) REFERENCES products(id) ON DELETE SET NULL,
      quantity INT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Safe Column Additions for Existing Tables
    ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);
  `;

  try {
    await queryDb(schemaSql);
    console.log('✅ [DB MIGRATION] Schema initialized successfully in Neon PostgreSQL!');
    return { success: true, message: 'Database schema applied successfully' };
  } catch (error: any) {
    console.error('❌ [DB MIGRATION ERROR]', error.message || error);
    throw error;
  }
}
