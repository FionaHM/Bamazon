// this module handles any action that reads from or writes to the products table.
var mysql =  require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '01B00tKamp09',  // remove before handing in!
	database: 'bamazon_db'
});

var departments = function(department_name, over_head_costs){
	this.department_name = department_name;
	this.over_head_costs = over_head_costs;
	this.total_sales = 0.0;
	this.product_sales = 0.0;

	// update with proceeds from sales
	this.updateTotalSales = function(newsale, department){
		// return new Promise(function(resolve, reject){
			// connect to database
			
			// check the count first - as it nothing returned there is an
			connection.query('update departments set total_sales = total_sales + ? where department_name = ?', [newsale, department], function(err, rows) {
		   		if (err) throw err;
			});
			// end the current connection
			connection.end();
	}		
}

module.exports = departments;