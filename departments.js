// this module handles any action that reads from or writes to the products table.
// var mysql =  require('mysql');
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	port: 3306,
// 	user: 'root',
// 	password: '01B00tKamp09',  // remove before handing in!
// 	database: 'bamazon_db'
// });
var connection = require('./connection.js');

var departments = function(department_name, over_head_costs){
	this.department_name = department_name;
	this.over_head_costs = over_head_costs;
	this.total_sales = 0.0;
	this.product_sales = 0.0;

	this.connect = function(){
		connection.connect(function(err) {
	  	if (err) throw err;
	  		console.log("connected to database as id " + connection.threadId);
		});
	}
	// update with proceeds from sales
	this.updateTotalSales = function(newsale, department){
		// if not connected then connect to database
		if (!connection){
			this.connect;
		}
		// return new Promise(function(resolve, reject){
		var departmentID = 0;
		// check the count first - as it nothing returned there is an
		// need key for departments table to update it in safe mode
	    connection.query('select department_id from departments where department_name = ?', [department], function(err, rows) {
	   		if (err) throw err;
	   		// departmentID = rows[0].department_id;
	   		// console.log(rows);
	   		// console.log("department id "+ rows[0].department_id);
			connection.query('update departments set total_sales = total_sales + ?, product_sales = product_sales + ? where department_id = ?', [newsale, newsale, rows[0].department_id], function(err, rows) {
		   		if (err) throw err;
		   		// console.log(rows.changedRows);
			});
		});
	}		
}

module.exports = departments;