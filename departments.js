// this module handles any action that reads from or writes to the departments table.

// this is for the database connection module
var connection = require('./connection.js');

var departments = function(department_name, over_head_costs){
	this.department_name = department_name;
	this.over_head_costs = over_head_costs;
	this.total_sales = 0.0;
	this.product_sales = 0.0;

	// called to connect to database
	this.connect = function(){
		connection.connect(function(err) {
	  	if (err) throw err;
	  		console.log("connected to database as id " + connection.threadId);
		});
	}

	// queries departments table for all data and creates dynamic total_profit field
	this.viewSalesByDepartment = function(){
		return new Promise(function(resolve, reject){
			// if not connected then connect
			if (!connection){
				this.connect;
			}
			// run the query to view sales data from department table
		    connection.query('select department_id, department_name, over_head_costs, product_sales, (product_sales - over_head_costs) as total_profit from departments order by department_id asc', function(err, rows) {
		   		if (err) reject(err);
			   	resolve(rows);
			});
		})
	}

	// update with total sales from customer orders
	this.updateTotalSales = function(newsale, department){
		// if not connected then connect to database
		if (!connection){
			this.connect;
		}
		// need key for departments table to update it in safe mode - so first i select department_id
		// where we have the department name, then i use this to update the departments table
	    connection.query('select department_id from departments where department_name = ?', [department], function(err, rows) {
	   		if (err) throw err;
	   		// use department_id to update sales data for the relevant deparment
			connection.query('update departments set total_sales = total_sales + ?, product_sales = product_sales + ? where department_id = ?', [newsale, newsale, rows[0].department_id], function(err, rows) {
		   		if (err) throw err;
			});
		});
	}		
}

module.exports = departments;