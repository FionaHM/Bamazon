var mysql =  require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '****',  // remove before handing in!
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

	// add to database
	this.saveNewProduct =  function(name, department, price, quantity){
		connection.query('insert into products (product_name, department_name, price, stock_quantity )  values (?,?,?,?)', [name, department, price, quantity] , function(err, rows) {
   		if (err) throw err;
  		console.log("saved");
		});
	}

	// read all from database 

	this.readAllProducts =  function(){
		// check connection
		this.connect;
		return new Promise(function(resolve, reject){
			// don't include  items with stock_quantity = 0
				connection.query('select department_name, item_id, product_name, price, stock_quantity from products group by department_name, item_id, product_name, price having stock_quantity > 0', function(err, rows) {
			   		if (err) reject(err);
			   		if (rows.length === 0 ){
			   			reject(err);
			   		} else {
			   			for (var i = 0; i < rows.length; i++){
						console.log("Department: 	" + rows[i].department_name + "	| Item ID:  " + rows[i].item_id + " | Product Name: " + rows[i].product_name +  " | Price: " +  rows[i].price );
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

	this.setQuantityByID =  function(id, quantity){
		return new Promise(function(resolve, reject){
			// check there is enough units available
			// *****update orders table
			// console.log(id, quantity);
			// connection.query('select count(*) from products where item_id = ? and stock_quantity > ?',[ id, quantity], function(err, rows) {
			// verify id exists
			connection.query('select count(*) from products where item_id = ? and stock_quantity > 0',[id], function(err, rows) {
				if (err) reject(err);
				if (rows[0]['count(*)'] === 0){
					var message = "Invalid Item ID" + id;
				   	resolve(message);
				} else {
				   	connection.query('select stock_quantity, price from products where item_id = ? ',[id], function(err, rows) {
				   		if (err) reject(err);
				   		// verify that we have enough units of the item 
				   		// console.log(rows[0].price);
				   		if (rows[0].stock_quantity >= quantity ){
				   			var total = rows[0].price * quantity;
							connection.query('update products set stock_quantity = stock_quantity - ? where item_id = ? and stock_quantity >= ?',[quantity, id, quantity], function(err, rows) {
						   		if (err) throw err;
						   		var message = "Order Successfully Placed! Total Cost: $" + total;
						   		resolve(message);
							});
				   		} else {
				   			// not enough left in stock to meet order quantity
					   		var message = "Only " + rows[0].stock_quantity + "remaining. Please order a smaller number";
				   			resolve(message);
				   		}
				   		
					});

				}

		   	})
		})
	}

	this.exit = function(){
		connection.end();
	}


}


module.exports = product;


 

 
