#Bamazon
https://github.com/FionaHM/Bamazon

## About this application

This application allows for the ordering and management of inventory, it simulates an online store front for ordering goods. It also incorporates the management of inventory at the manager and supervisor level.  As such it has three modes of operation: Customer, Manager and Supervisor. 


## Usage
The application is started on the commandline as follows:
`> node bamazon.js`

This will bring up a menu with four options as follows: 
![Image of Screen1.png]
(Screenshots/Screen1.png)

`? Please select an option:
> Customer
  Manager
  Supervisor
  Exit Program `


### Customer

This is the customer view. This allows customers to order in-stock items from the products inventory. It is just a SELECT query on the whole table where stock_quantity > 0 in sql.

The customer is initially presented with a view of the products in a table and then asked to select the product they with to purchase by entering the product Item ID followed by the quantity required.

![Image of Screen2.png]
(Screenshots/Screen2.png)

`? Please select an option: Customer
Item ID  Product Name                                              Department   Price ($)
-------  --------------------------------------------------------  -----------  ---------
1        Treadmill                                                 FITNESS      $999     
2        3PCS Motion Sensor Light, Kohree Battery-Operated         ELECTRONICS  $11.99   
3        Fireflyhome Rechargeable 4 LED Light                      ELECTRONICS  $9.99    
4        Simplete Bento Lunch Box - Set of 5                       KITCHEN      $7.8     
5        Kattee Women's Pure Color Leather Hobo Tote Shoulder Bag  ACCESSORIES  $39.99   
6        Kitchen Shears, Take Apart for Cleaning                   KITCHEN      $10.99   
7        BBQ Coverpro - Waterproof BBQ Grill Cover                 HOME         $15.19   
8        Barbie Collector Divergent Tris Doll                      TOYS         $10.15   
9        Disney/Pixar Toy Story Talking Jessie                     TOYS         $16.17   
10       Paw Patrol - Rescue Racer - Jungle Chase                  TOYS         $4.72    
11       Table                                                     KITCHEN      $200.99  

? Which item would you like to order (input Item ID): 1
? How many units of this item would you like to order (input quantity): 1
Order Successfully Placed! Total Cost: $999
`
When a customer places an order successfully they are presented with a confirmation message and the total cost.

`Order Successfully Placed! Total Cost: $999`


If for some reason they order more than the quantity of an in-stock item, an error message will appear as follows:

![Image of Screen3.png]
(Screenshots/Screen3.png)

`? Which item would you like to order (input Item ID): 1
? How many units of this item would you like to order (input quantity): 500
Only 499 remaining. Please order 499 units or less.
? Would you like to place another order? (Y/n) `

In the background, two tables are involved in this operation: products table and departments table. This is a view of the database before the update:

stock_quantity for item_id 1 = 500

![Image of Screen4.png]
(Screenshots/Screen4.png)

Here is the database after the successful update (and failed update above too):

stock_quantity for item_id 1 = 499.

As the ordered quantity is 1, this action runs an sql UPDATE command is run on the products table setting the stock_quantity = stock_quantity - 1. Since it was 500 now it is 499.

![Image of Screen5.png]
(Screenshots/Screen5.png)

The other table that is modified is the departments table - the field product_sales and total_sales will be updated by $999 for the department_name "FITNESS" (in the database this is updated by department_id).  This is also achieved by an sql UPDATE command on the fields total_sales and product_sales where department_id 1.  After the update these values are now $999, from $0 initially.

![Image of Screen6.png]
(Screenshots/Screen6.png)

The departments table did not update when the order failed due to low inventory - this is as expected.

After each order the user is prompted to continue to place another order or to exit back to the main menu.  To continue the user must select "Y" or enter and to exit the user must select "n".
`? Would you like to place another order? (Y/n) (Y/n) `


### Manager
This is the manager view. This allows manager to manage the products inventory contained in the products table.

![Image of Screen7.png]
(Screenshots/Screen7.png)

`Please select an action from the list: (Use arrow keys)
❯ View Products for Sale 
View Low Inventory 
Add to Inventory 
Add New Products 
Exit Program `

* View Products for Sale 

This presents the Manager with a view of all the items in the products table - it includes low or zero inventory items. It is just a SELECT command on the whole table in sql.

`Item ID  Product Name                                              Department   Price ($)  Stock Level (No of Units)
-------  --------------------------------------------------------  -----------  --------- --------------------
1        Treadmill                                                 FITNESS      $999       499                      
2        3PCS Motion Sensor Light, Kohree Battery-Operated         ELECTRONICS  $11.99     1000                     
3        Fireflyhome Rechargeable 4 LED Light                      ELECTRONICS  $9.99      500                      
4        Simplete Bento Lunch Box - Set of 5                       KITCHEN      $7.8       50                       
5        Kattee Women's Pure Color Leather Hobo Tote Shoulder Bag  ACCESSORIES  $39.99     20                       
6        Kitchen Shears, Take Apart for Cleaning                   KITCHEN      $10.99     45                       
7        BBQ Coverpro - Waterproof BBQ Grill Cover                 HOME         $15.19     10                       
8        Barbie Collector Divergent Tris Doll                      TOYS         $10.15     30                       
9        Disney/Pixar Toy Story Talking Jessie                     TOYS         $16.17     10                       
10       Paw Patrol - Rescue Racer - Jungle Chase                  TOYS         $4.72      100                      

? Would you like to carry out another action? (Y/n) (Y/n) `

* View Low Inventory 

This presents the Manager with a view of all the low stock items (< 5) in the products table. It is just a SELECT command in sql where the field stock_quantity < 5.

If there are no items with low inventory the Manager will be presented with the message:
` ? Please select an action from the list: View Low Inventory
No inventory items less than 5 units.`

Now if a customer orders 499 of item_id 1, this will deplete the inventory for item_id 1.
![Image of Screen8.png]
(Screenshots/Screen8.png)

![Image of Screen9.png]
(Screenshots/Screen9.png)

Now as we have 0 of item 1 in the products table - this should be displayed when the Manager reselects 'View Low Inventory':
`? Please select an action from the list: View Low Inventory
1 item(s) with low inventory
item_id  product_name  department_name  price  stock_quantity
-------  ------------  ---------------  -----  --------------
1        Treadmill     FITNESS          999    0             

? Would you like to carry out another action? (Y/n) Yes`

![Image of Screen10.png]
(Screenshots/Screen10.png)

* Add to Inventory 

This allows the manager to add new units of an existing item to the products table. It is just an UPDATE command in sql run on the stock_quantity for a specified item_id.

The manger simply enters the item_id to be updated and the quantity.
`? Input ID of the item would you like to increase stock levels: 1
? How many units would you like to add? 100
Successfully increased item number 1 by 100 units.
? Would you like to carry out another action? (Y/n) (Y/n) `


![Image of Screen11.png]
(Screenshots/Screen11.png)

In the database the stock_quantity of item_id = 100.

![Image of Screen12.png]
(Screenshots/Screen12.png)

*  Add New Products

This allows the manager to append a totally new item to products table. It is just an INSERT command in sql and is appended to the end of the table. The item_id will be auto incremented to the next integer value. In this case item_id will be 11.

The Manager must enter the following:
- name
- department - selected from a predefined list of existing departments.

`Please enter the name of the item you wish to add? table
? Please select the department: 
FITNESS 
ELECTRONICS 
❯ KITCHEN 
ACCESSORIES 
HOME 
TOYS 
? How many units would you like to add? 150
? How much will each unit cost? 50
Update successful. 150 units of table added to department KITCHEN at $50 each.`

![Image of Screen13.png]
(Screenshots/Screen13.png)

The products table now has a new product called table as item_id = 13.

![Image of Screen14.png]
(Screenshots/Screen14.png)

### Supervisor

This is the Supervisor view. There is only one option: View Product Sales By Department.  This runs an sql query on the departments table selecting all the fields and creating one derived filed called total_profit from product_sales - over_head_costs.

`? Please select an option: Supervisor
? Please select an option: (Use arrow keys)
❯ View Product Sales By Department `

`? Please select an option: Supervisor
? Please select an option: View Product Sales By Department
Deparment ID  Department Name  Overhead Costs  Product Sales  Total Profit (+) / Loss (-)
------------  ---------------  --------------  -------------  ---------------------------
1             FITNESS          $1000           $499500        $498500                    
2             ELECTRONICS      $3000           $0             $-3000                     
3             KITCHEN          $5000           $0             $-5000                     
4             ACCESSORIES      $2000           $0             $-2000                     
5             HOME             $600            $0             $-600                      
6             TOYS             $800            $0             $-800                      


### Exit Program
This just stops the program and disconnects from the database.


##  Integration with other libraries

The following libraries were used and those that are not native to node should be included in package.json.

###  Inquirer
var inquirer = require('inquirer');

Used to present options and to grab user input from the command line. Needs to be added as a dependency in package.json so that it will be installed into  
node_modules folder when npm install is run.

package.json should include:

"dependencies": {
"inquirer": "^2.0.0"
}

###     fs
var fs = require('fs');

Used to for all file operations - read, write, delete, exists etc. 

###  table.console

This is used to present the data in a nice tablular format in the console. It takes an array of objects as input. It can take the entire response from a database query and display it without formatting.

### child_process

This was used to run separate node modules.


#  Files

The folder structure is flat - all files are in same parent folder.


## Application Entry:
* bamazon.js                -	parent node module used to start the application.
* bamazonManager.js         -   module that handles all customer interactions
* bamazonCustomer.js        -   module that handles all manager interactions
* bamazonSupervisor.js      -   module that handles all supervisor interactions
* connection.js             -   module that handles the database connection.

##   Constructor Modules:
* products.js               -  	constructor module. Used for all  interactions with the products table.
* departments.js            -	constructor module. Used for all  interactions with the departments table.

##   Data Input: 
database_init.sql           -   must be run to set up the database structure and populate it with seed data.

##   Other:
node_modules                -	folder that contains relevant node modules
package.json                - 	created when command ‘npm init’ is run.  Can be modified manually to include dependencies data or automatically when ‘npm install <library> --save’ is run e.g. ‘npm install inquirer --save’
README.md                   - 	this file containing relevant operational information.

*  License
Bamazon is released under the MIT license.
