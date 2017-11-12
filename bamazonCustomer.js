// Storefront App | By Juliette Rapala
// =====================================================================================

  // Setup Variables 
  // =====================================================================================

    // NPM Packages
    var mysql = require("mysql");
    require('console.table');
    var inquirer = require('inquirer');

    // Connect to MySQL database
    var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,

      // Your username
      user: "root",

      // Your password
      password: "",
      database: "bamazon"
    });


  // Functions
  // =====================================================================================

    function readProducts() {
      console.log("Selecting all products...\n");
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        sellToUser();
        connection.end();
      });
    }

    function sellToUser() {
      inquirer.prompt([{
        name: "idOfProduct",
        type: "input",
        message: "Please enter the ID number of the product you wish to purchase:"
      },{
        name: "quantityOfProduct",
        type: "input",
        message: "Please enter the number of units you wish to purchase:"
      }]).then(function(response) {
        console.log(`You have purchased ${response.quantityOfProduct} units of ${response.idOfProduct}`);
      });
    }

  // Start up Function
  // =====================================================================================

    connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId + "\n");
      readProducts()
    });

