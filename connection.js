var mysql =  require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '01B00tKamp09',  // remove before handing in!
	database: 'bamazon_db'
});

module.exports = connection;
