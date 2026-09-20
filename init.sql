CREATE DATABASE IF NOT EXISTS product_db;

USE product_db;

CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
);

INSERT INTO products (product_name, category, price, quantity)
VALUES
('Laptop', 'Electronics', 120000.00, 10),
('Smartphone', 'Electronics', 75000.00, 20),
('Headphones', 'Accessories', 5000.00, 30),
('Keyboard', 'Accessories', 3500.00, 15),
('Mouse', 'Accessories', 2000.00, 25);