
var inquirer = require('inquirer');

function verifyFile(constructorFile){
		var fs = require('fs');
		if ((fs.existsSync(constructorFile))){ 
			var product = require(constructorFile);
			var currentProduct = new product();
			return currentProduct;
		}
}

function placeOrder(){
	var currentProduct = verifyFile('./products.js');
	// display all items in products table
	// pass minvalue of 0 for customer view
	currentProduct.readAllProducts(0, "customer").then(function(){

		inquirer.prompt([
			{
				type: "input",
				name: "itemID",
				message: "Which item would you like to order (input Item ID):",
				validate: function(str){
					return isNaN(str) === false;  // make sure it is a number
				},
			},
			{
				type: "input",
				name: "itemQty",
				message: "How many units of this item would you like to order (input quantity):",
				validate: function(str){
					return isNaN(str) === false;  // make sure it is a number
				},
			}
		]).then(function(answers){
			// order this product
			// pass view === "customer" as customer orders will decrease the inventory
			currentProduct.setQuantityByID(answers.itemID, answers.itemQty, "customer").then(function(response){
				// console.log(response);
				var departments = verifyFile('./departments.js');
				// var departments = require('./departments.js');
				// console.log(response);
				departments.updateTotalSales(response[0], response[1]);

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
						
						currentProduct.exit();
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
