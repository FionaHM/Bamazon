
var inquirer = require('inquirer');
var connection = require('./connection.js');
var cp = require('child_process');

// node package for output in a table
require('console.table');


// checks file exists
function verifyFile(constructorFile){
		var fs = require('fs');
		if ((fs.existsSync(constructorFile))){ 
			var product = require(constructorFile);
			var currentProduct = new product();
			return currentProduct;
		}
}



// called when a customer tries to place anßß order
function placeOrder(){
	var currentProduct = verifyFile('./products.js');
	// display all items in products table
	// pass minvalue of 0 for customer view
	currentProduct.readAllProducts(0, "customer").then(function(response){
		console.table(response);
	}).then(function(){

		inquirer.prompt([
			{
				type: "input",
				name: "itemID",
				message: "Which item would you like to order (input Item ID):",
				validate: function(str){
					if ((str.trim().length !== 0) && (str !== "0")) { // can't be empty or 0
						return isNaN(str) === false; // make sure it is a number
					}	
					  
				},
			},
			{
				type: "input",
				name: "itemQty",
				message: "How many units of this item would you like to order (input quantity):",
				validate: function(str){
					if ((str.trim().length !== 0) && (str !== "0")) {  // can't be empty or 0
						return isNaN(str) === false; // make sure it is a number
					}				
				},
			}
		]).then(function(answers){
			// order this product
			// pass view === "customer" as customer orders will decrease the inventory
			currentProduct.setQuantityByID(answers.itemID, answers.itemQty, "customer").then(function(response){
				// verify the file departments.js exists and create new instance of object departments
				var departments = verifyFile('./departments.js');
				if (response[0] !== 0 ) {
					departments.updateTotalSales(response[0], response[1]);
				}
			}).then(function(){
				inquirer.prompt([
				{
					type: "confirm",
					name: "anotherOrder",
					message: "Would you like to place another order? (Y/n)",
					default: "Yes"
				}]).then(function(answers){
					if (answers.anotherOrder === true){
						placeOrder();
					} else {
						// exit database connection
						connection.end();
						// go back to main entry page 
						cp.fork(__dirname + '/bamazon.js');
					}
				}).catch(function(err){
					console.log(err)
				})	
			});

		}).catch(function(err){
			console.log(err)
		})
	})
}

// begin here


placeOrder();
