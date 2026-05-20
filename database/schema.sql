-- Create the database
CREATE DATABASE IF NOT EXISTS pizza_app;
USE pizza_app;

-- 1. Users Table
-- Stores customer and admin information
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Will store hashed password
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table (Optional but good for structure)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Products Table
-- Stores pizza details
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Orders Table
-- Stores header information for each order
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT NOT NULL,
    status ENUM('Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Order Items Table
-- Linking table between Orders and Products (Many-to-Many relationship resolution)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_order DECIMAL(10, 2) NOT NULL, -- Storing price at time of order to handle price changes later
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 6. Seed Initial Data (For Testing)

-- Insert Categories
INSERT INTO categories (name) VALUES ('Veg'), ('Non-Veg'), ('Sides'), ('Drinks');

-- Insert Admin User
-- Password is 'admin123' (hashed with bcrypt in app, but here is raw for reference if inserting manually)
-- We will create the admin via the app API to ensure proper hashing.
-- For now, let's add some dummy products.

INSERT INTO products (name, description, price, image_url, category_id) VALUES 
('Margherita Pizza', 'Classic delight with 100% real mozzarella cheese', 10.99, 'https://source.unsplash.com/1600x900/?pizza,margherita', 1),
('Pepperoni Barbecue', 'Pepperoni and BBQ sauce delight', 14.99, 'https://source.unsplash.com/1600x900/?pizza,pepperoni', 2),
('Farmhouse', 'Delectable combination of onion, capsicum, mushroom & tomato', 12.99, 'https://source.unsplash.com/1600x900/?pizza,farmhouse', 1),
('Chicken Sausage', 'American sausage spiced up with Indian herbs', 13.50, 'https://source.unsplash.com/1600x900/?pizza,sausage', 2),
('Coca Cola', 'Refreshing drink', 2.99, 'https://source.unsplash.com/1600x900/?cola', 4);