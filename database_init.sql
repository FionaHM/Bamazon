
CREATE database bamazon_db;
 
use bamazon_db;

CREATE table bamazon_db.products (
item_id integer auto_increment NOT NULL,
product_name varchar(64) NOT NULL,
department_name varchar(64) NOT NULL,
price dec(6,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity ) values 
("Treadmill", "FITNESS", 999, 500),
("3PCS Motion Sensor Light, Kohree Battery-Operated", "ELECTRONICS", 11.99, 1000),
("Fireflyhome Rechargeable 4 LED Light", "ELECTRONICS", 9.99, 500),
("Simplete Bento Lunch Box - Set of 5", "KITCHEN", 7.80, 50),
("Kattee Women's Pure Color Leather Hobo Tote Shoulder Bag", "ACCESSORIES", 39.99, 20),
("Kitchen Shears, Take Apart for Cleaning", "KITCHEN", 10.99, 45),
("BBQ Coverpro - Waterproof BBQ Grill Cover", "HOME", 15.19, 10),
("Barbie Collector Divergent Tris Doll", "TOYS", 10.15, 30),
("Disney/Pixar Toy Story Talking Jessie", "TOYS", 16.17, 10),
("Paw Patrol - Rescue Racer - Jungle Chase", "TOYS", 4.72, 100);

-- create table called departments 
create table bamazon_db.departments (
department_id int auto_increment not null,
department_name varchar(20) not null,
over_head_costs dec(6,2) not null default 0,
total_sales dec(6,2) not null default 0,
primary key(department_id)

);

-- alter table to add product_sales column
alter table bamazon_db.departments
add column product_sales dec(6,2) not null default 0
after total_sales;

-- get distinct departments from products
select distinct(department_name) from bamazon_db.products;

-- populate departments table for existing departments
INSERT departments(department_name) SELECT DISTINCT department_name FROM bamazon_db.products;

-- add overhead costs are 50% for each department
update bamazon_db.departments set over_head_costs = 1000 where department_id = 1;
update bamazon_db.departments set over_head_costs = 3000 where department_id = 2;
update bamazon_db.departments set over_head_costs = 5000 where department_id = 3;
update bamazon_db.departments set over_head_costs = 2000 where department_id = 4;
update bamazon_db.departments set over_head_costs = 600 where department_id = 5;
update bamazon_db.departments set over_head_costs = 800 where department_id = 6;

select * from bamazon_db.departments;
  
select * from bamazon_db.products;


update departments set total_sales = total_sales + 600, product_sales = product_sales + 600 where department_id = 3