var products = require('inquirer');
var inquirer = require('inquirer');

function verifyFile(constructorFile){
		var fs = require('fs');
		if ((fs.existsSync(constructorFile))){ 
			var product = require(constructorFile);
			var currentProduct = new product();
			return currentProduct;
		}

}


function managerView(){
	inquirer.prompt([
		{
			type: "list",
			name: "managerActions",
			message: "Please select an action from the list:",
			choices: ["View Products for Sale",
			"View Low Inventory", "Add to Inventory", "Add New Products", "Exit Program"]
	}]).then(function(answers){
		implementActions(answers);

	})
}

function implementActions(answers){
	var currentProduct = verifyFile('./products.js');
	switch (answers.managerActions) {
		case "View Products for Sale":
			// this option lists every available item for sale - including those with 0
			// pass minvalue of -1 for manager view to get all products, even those with 0 inventory
			currentProduct.readAllProducts(-1, "manager").then(function(){	
				nextAction(currentProduct);	
			})
		break;
			case "View Low Inventory":
			// pass minvalue of -1 for manager view to get all products, even those with 0 inventory
			currentProduct.lowInventory(5).then(function(message){
				console.log(message);
			}).then(function(){
				nextAction(currentProduct);	
			})
		break;
			case "Add to Inventory":
			// adds more of items currently in the store.
			addToExistingInventory(currentProduct)
			
		break;
			case "Add New Products":
			addNewProduct(currentProduct);
		break;
			case "Exit Program":
			currentProduct.exit();
		break;
		default:
			console.log("No answer selected");
	}
}

function nextAction(currentProduct){
	inquirer.prompt([
		{
			type: "confirm",
			name: "anotherAction",
			message: "Would you like to carry out another action? (Y/n)",
			default: "Yes"
		}]).then(function(answers){
			if (answers.anotherAction === true){
				managerView();
			} else {
				currentProduct.exit();
			}
		}).catch(function(err){
			console.log(err);
			nextAction(currentProduct);
		});
}

function addToExistingInventory(currentProduct){
	// manager select item_id and inputs quantity to add
	inquirer.prompt([
		{
			type: "input",
			name: "itemID",
			message: "Input ID of the item would you like to increase stock levels:",
			validate: function(str){
				return isNaN(str) === false;  // make sure it is a number
			},
		},
		{
			type: "input",
			name: "itemQty",
			message: "How many units would you like to add?",
			validate: function(str){
				return isNaN(str) === false;  // make sure it is a number
			},
		}]).then(function(answers){
			// note the view is now "manager" so that the quantity is added to the inventory
			currentProduct.setQuantityByID(answers.itemID, answers.itemQty, "manager").then(function(response){
				console.log(response);
			}).then(function(){
				nextAction(currentProduct);	
			});		
		}).catch(function(err){
			console.log(err);
			nextAction(currentProduct);
		});
}

function addNewProduct(currentProduct){
	// get the deparments then use to populate choices
	currentProduct.getDepartments().then(function(departmentsArr){
		inquirer.prompt([
			{
				type: "input",
				name: "itemName",
				message: "Please enter the name of the item you wish to add?",
				validate: function(str){
					return str !== " ";  // make sure it is not empty
				},
			},
			{
				type: "list",
				name: "itemDepartment",
				message: "Please select the department:",
				choices: departmentsArr
			},
			{
				type: "input",
				name: "itemQty",
				message: "How many units would you like to add?",
				validate: function(str){
					return isNaN(str) === false;  // make sure it is a number
				},
			},
			{
				type: "input",
				name: "itemPrice",
				message: "How much will each unit constructorFile?",
				validate: function(str){
					return isNaN(str) === false;  // make sure it is a number
				},
			}
			]).then(function(answers){

			currentProduct.saveNewProduct(answers.itemName, answers.itemDepartment, answers.itemPrice, answers.itemQty).then(function(){
				nextAction(currentProduct);
			}).catch(function(err){
				console.log(err);
				nextAction(currentProduct);
			});

		})

	})
	
}
// Start of application
managerView();