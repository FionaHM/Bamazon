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
		// verify the database is available
		connection.connect(function(err) {
		  	if (err) {
		  		console.log("Database is not available - please check settings.")
		  	} 
		  	else {
		  		// close the current connection - not required here.
		  		// otherwise the connection will hang if we move forward and try to kill it later
		  		connection.end();
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
						// stops inquirer and closed the database connection
					break;
					default:
					    console.log("Not a valid option");
				}
			}
		});	
	})
}

// begin here  - this function allows the user to select whether they are a customer, supervisor or manager
// the appropriate file is then run to allow the user to carry out actions.
startApplication();
