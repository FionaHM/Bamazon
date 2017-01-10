// this module handles any action that reads from or writes to the products table.
var mysql =  require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '01B00tKamp09',  // remove before handing in!
	database: 'bamazon_db'
});

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

	this.getDepartments =  function(){
		return new Promise(function(resolve, reject){
			connection.query('select distinct(department_name) from products' , function(err, rows) {
	   		if (err) reject(err);
	   		console.log(rows);
	   		var departmentsArr = [];
	   		for (var i = 0; i < rows.length; i++){
	   			departmentsArr.push(rows[i].department_name)
	   		}
	  		resolve(departmentsArr);
			});
		})
	}

	// add to database
	this.saveNewProduct =  function(name, department, price, quantity){
		return new Promise(function(resolve, reject){
			connection.query('insert into products (product_name, department_name, price, stock_quantity )  values (?,?,?,?)', [name, department, price, quantity] , function(err, rows) {
	   		if (err) reject(err);
	  		resolve();
			});
		})
	}

	// read all products
	this.readAllProducts =  function(minvalue, view){
		// check connection
		this.connect;
		// min value is 0 for customers - this brings back only in stock items
		// min value is -1 for managers - this brings back all items
		return new Promise(function(resolve, reject){
			connection.query('select item_id, product_name, department_name, price, stock_quantity from products group by item_id, product_name, department_name, price having stock_quantity > ?', [minvalue], function(err, rows) {
		   		if (err) reject(err);
		   		if (rows.length === 0 ){
		   			reject(err);
		   		} else {
		   			for (var i = 0; i < rows.length; i++){
		   				// determine what to display based on who is asking - manager or customer
		   				if (view === "manager"){
		   					console.log(" Item ID:  " + rows[i].item_id + " | Product Name: " + rows[i].product_name +  " | Department: " + rows[i].department_name + " | Price: $" +  rows[i].price + " | Quantity: " + rows[i].stock_quantity);
		   				} else if (view === "customer"){
		   					console.log(" Item ID:  " + rows[i].item_id + " | Product Name: " + rows[i].product_name +  " | Department: " + rows[i].department_name + " | Price: $" +  rows[i].price );
		   				}
					
					}
					resolve(true);
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
			// first verify id exists - even if stock 0
			connection.query('select count(*) from products where item_id = ?',[id], function(err, rows) {
				if (err) reject(err);
				if (rows[0]['count(*)'] === 0){
					var message = "Invalid Item ID" + id;
				   	resolve(message);
				} else {
				   	connection.query('select stock_quantity, price from products where item_id = ? ',[id], function(err, rows) {
				   		if (err) reject(err);
				   		if (view === "customer"){
				   			// verify that we have enough units of the item 
					   		if (rows[0].stock_quantity >= quantity ){
					   			// Math.round(num * 100) / 100
					   			var total = Math.round(rows[0].price * quantity * 100 )/ 100;
								connection.query('update products set stock_quantity = stock_quantity - ? where item_id = ? and stock_quantity >= ?',[quantity, id, quantity], function(err, rows) {
							   		if (err) throw err;
							   		// since we have no orders table we can just put order successful message here.
							   		var message = "Order Successfully Placed! Total Cost: $" + total;
							   		resolve(message);
								});
					   		} else {
					   			// not enough left in stock to meet order quantity
						   		var message = "Only " + rows[0].stock_quantity + "remaining. Please order a smaller number";
					   			resolve(message);
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

	this.exit = function(){
		connection.end();
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
		   			resolve(message);
		   		} else {
		   			for (var i = 0; i < rows.length; i++){
						console.log(" Item ID:  " + rows[i].item_id + " | Product Name: " + rows[i].product_name +  " | Department: 	" + rows[i].department_name + " | Price: " +  rows[i].price + " | Quantity: " +  rows[i].stock_quantity );
					}
					var message = rows.length + " item(s) with low inventory";
					resolve(message);
				}
			});
		})
	}


}


module.exports = product;


 

 
