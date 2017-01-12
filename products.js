// this module handles any action that reads from or writes to the products table.
//
// this is for the database connection module
var connection = require('./connection.js');
var product = function(name, department, price, quantity){
	this.name = name;
	this.department = department;
	this.price = price;
	this.quantity = quantity;

	// verify database is available and can be connected to
	this.connect = function(){
		connection.connect(function(err) {
	  	if (err) throw err;
	  		console.log("connected to database as id " + connection.threadId);
		});
	}

	// add new product to the database
	this.saveNewProduct =  function(name, department, price, quantity){
		return new Promise(function(resolve, reject){
			connection.query('insert into products (product_name, department_name, price, stock_quantity )  values (?,?,?,?)', [name, department, price, quantity] , function(err, rows) {
		   		if (err) reject(err);
		   		console.log("Update successful. " + quantity + " units of " + name + " added to department " + department + " at $" + price + " each.")
		  		resolve();
			});
		})
	}

	// read all products from products table
	this.readAllProducts =  function(minvalue, view){
		// check connection
		this.connect;
		// view = "customers" and minvalue is 0 for customers - this brings back only in stock items
		// view = "manager" and minvalue is -1 for managers - this brings back all items
		return new Promise(function(resolve, reject){
			connection.query('select item_id, product_name, department_name, price, stock_quantity from products group by item_id, product_name, department_name, price having stock_quantity > ?', [minvalue], function(err, rows) {
		   		if (err) reject(err);
		   		if (rows.length === 0 ){
		   			reject(err);
		   		} else {
					resolve(rows);
				}
			});
		})
	}

	this.getQuantityByID = function(id){
	connection.query('select stock_quantity from products where item_id = ?',[id] ,function(err, rows) {
   		if (err) throw err;
   			console.log(rows[0].stock_quantity);
		});
	}

	this.setQuantityByID =  function(id, quantity, view){
		return new Promise(function(resolve, reject){
			// first verify item id exists
			connection.query('select count(*) from products where item_id = ?',[id], function(err, rows) {
				if (err) reject(err);
				if (rows[0]['count(*)'] === 0){
					var message =  "Item ID " + id + " does not exist, please enter an id from the inventory list.";
				   	console.log(message);
				   	resolve([0, ""]);
				} else {
				   	connection.query('select stock_quantity, department_name, price from products where item_id = ? ',[id], function(err, rows) {
				   		if (err) reject(err);
				   		if (view === "customer"){
				   			// verify that we have enough units of the item 
				   			var department = rows[0].department_name;
					   		if (rows[0].stock_quantity >= quantity ){
					   			// round to 2 decimals before saving
					   			var total = Math.round(rows[0].price * quantity * 100 )/ 100;
								connection.query('update products set stock_quantity = stock_quantity - ? where item_id = ? and stock_quantity >= ?',[quantity, id, quantity], function(err, rows) {
							   		if (err) throw err;
							   		// since we have no orders table we can just put order successful message here.
							   		if (rows.changedRows === 1) {
							   			var message = "Order Successfully Placed! Total Cost: $" + total;
							   			console.log(message);
							   			// send back information required to update department totals
							   			resolve([total, department]);
							   		} else {
							   			var message = "something went wrong with your order please contact customer services.";
							   			// console.log(message);
							   			reject(message);
							   		}						   		
								});
					   		} else {
					   			// not enough left in stock to meet order quantity
						   		var message = "Only " + rows[0].stock_quantity + " remaining. Please order "+ rows[0].stock_quantity + " units or less.";
					   			console.log(message);
					   			resolve([0, ""]);  // this is so there are no updates in the departments table
					   		}

				   		} else if (view === "manager"){
								connection.query('update products set stock_quantity = stock_quantity + ? where item_id = ?',[quantity, id], function(err, rows) {
							   		if (err) throw err;
							   		var message = "Successfully increased item number " + id + " by " + quantity + " units.";
							   		resolve(message);
								});

				   		}
				   		
				   		
					});

				}

		   	})
		})
	}
	// low inventory
	this.lowInventory =  function(minvalue){
		// check connection
		this.connect;
		// min value is 0 for customers - this brings back only in stock items
		// min value is -1 for managers - this brings back all items
		return new Promise(function(resolve, reject){
			// check the count first - as it nothing returned there is an
			connection.query('select item_id, product_name, department_name, price, stock_quantity from products group by item_id, product_name, department_name, price having stock_quantity < ?', [minvalue], function(err, rows) {
		   		if (err) reject(err);
		   		if (rows.length === 0 ){
		   			var message = "No inventory items less than " + minvalue + " units.";
		   			console.log(message);
		   			resolve();
		   		} else {
					var message = rows.length + " item(s) with low inventory";
					console.log(message);
					resolve(rows);
				}
			});
		})
	}


}


module.exports = product;


 

 
