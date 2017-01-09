
// var mysql =  require('mysql');
// var constructorFile = "./products.js";
var inquirer = require('inquirer');

function verifyFile(constructorFile){
		var fs = require('fs');
		if ((fs.existsSync(constructorFile))){ 
			var product = require(constructorFile);
			var currentProduct = new product();
			return currentProduct;
		}

}



	// currentProduct.readAllProducts();

// // currentProduct.readAllProducts();
// currentProduct.saveNewProduct("Ski", "FITNESS", 100.99, 50);
// currentProduct.getQuantityByID(5);
// currentProduct.setQuantityByID(14, 3);


function placeOrder(){
	var currentProduct = verifyFile('./products.js');
	// display all items in products table
	currentProduct.readAllProducts().then(function(){

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
			currentProduct.setQuantityByID(answers.itemID, answers.itemQty).then(function(response){
				console.log(response);
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
