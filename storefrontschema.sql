DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(10) NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products AUTO_INCREMENT=10000;

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("Pressure Cooker", "Kitchen and Dining", 74.96, 60),
("Meat Thermometer", "Kitchen and Dining", 19.19, 150),
("Clay Mask", "Beauty", 9.45, 250),
("Tweezers", "Beauty", 6.75, 325),
("Changing Pad", "Baby", 14.93, 50),
("Diapers", "Baby", 25.20, 500),
("Cards Against Humanity", "Toys and Games", 25.00, 100),
("Play-Doh", "Toys and Games", 7.99, 95),
("Elmer's Glue", "Office", 10.99, 113),
("Ink Cartridge", "Office", 542.99, 100);
