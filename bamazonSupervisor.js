var inquirer = require('inquirer');
var cp = require('child_process');
var connection = require('./connection.js');

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

function supervisorView(){
	inquirer.prompt([{
		type: "list",
		name: "action",
		message: "Please select an option:",
		choices: ["View Product Sales By Department"]

	}]).then(function(answers){
		switch (answers.action){
			case "View Product Sales By Department":
				viewSalesByDepartment();
			break;
			default:
			    console.log("Not a valid option");
		}

	})
}

function viewSalesByDepartment(){
	var departments = verifyFile('./departments.js');
	departments.viewSalesByDepartment().then(function(response){
		// put the data in a table
		console.log(response);
		var prodArr = [];
		for (var i = 0; i < response.length; i++){
			prodArr.push({"Deparment ID": response[i].department_id,
				"Department Name": response[i].department_name,
				"Overhead Costs": '$' + response[i]. over_head_costs,
				"Product Sales": '$' + response[i].product_sales,
				"Total Profit (+) / Loss (-)": '$' + response[i].total_profit
			});
		}
		console.table(prodArr);
	}).then(function(){
		exitApplication();
	}).catch(function(err){
		console.log(err);

	})
}

function exitApplication(){
		inquirer.prompt([{
		type: "confirm",
		name: "action",
		message: "Would you like to continue? (Y/n)",
		default: "yes"
	}]).then(function(answers){
		// confirm user wants to exit
		if (answers.action === true){
			supervisorView();
		} else {
			// exit database connection
			connection.end();
			// go back to the main program
			cp.fork(__dirname + '/bamazon.js');
		}
	})
}

// begin here  
supervisorView();
