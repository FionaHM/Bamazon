var inquirer = require('inquirer');
var cp = require('child_process');
var connection = require('./connection.js');


function startApplication(){
	inquirer.prompt([{
		type: "list",
		name: "action",
		message: "Please select an option:",
		choices: ["Customer", "Manager", "Supervisor", "Exit Program"]

	}]).then(function(answers){
		switch (answers.action){
			case "Customer":
				cp.fork(__dirname + '/bamazonCustomer.js');
			break;
			case "Manager":
				cp.fork(__dirname + '/bamazonManager.js');
			break;
			case "Supervisor":
				cp.fork(__dirname + '/bamazonSupervisor.js');
			break;
			case "Exit Program":
				exitApplication();
			break;
			default:
			    console.log("Not a valid option");
		}

	})
}

function exitApplication(){
		inquirer.prompt([{
		type: "confirm",
		name: "action",
		message: "Are you sure you wish to exit?(Y/n)",
		default: "yes"
	}]).then(function(answers){
		// confirm user wants to exit
		if (answers.action === false){
			startApplication();
		} else {
			// close database connection
			connection.end();
		}
	})
}
// begin here  - this function allows the user to select whether they are a customer, supervisor or manager
// the appropriate file is then run to allow the user to carry out actions.
startApplication();
