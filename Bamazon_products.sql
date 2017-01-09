CREATE database bamazon_db;

use bamazon_db;

CREATE table products (
item_id integer auto_increment NOT NULL,
product_name varchar(64) NOT NULL,
department_name varchar(64) NOT NULL,
price dec(6,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity ) values 
("Treadmill", "FITNESS", 999, 500),
("3PCS Motion Sensor Light, Kohree Battery-Operated", "ELECTRONICS", 11.99, 1000),
("Fireflyhome Rechargeable 4 LED Light", "ELECTRONICS", 999, 500),
("Simplete Bento Lunch Box - Set of 5", "KITCHEN", 7.80, 50),
("Kattee Women's Pure Color Leather Hobo Tote Shoulder Bag", "ACCESSORIES", 39.99, 20),
("Kitchen Shears, Take Apart for Cleaning", "KITCHEN", 10.99, 45),
("BBQ Coverpro - Waterproof BBQ Grill Cover", "HOME", 15.19, 10),
("Barbie Collector Divergent Tris Doll", "TOYS", 10.15, 30),
("Disney/Pixar Toy Story Talking Jessie", "TOYS", 16.17, 10),
("Paw Patrol - Rescue Racer - Jungle Chase", "TOYS", 4.72, 100);

select item_id from products


