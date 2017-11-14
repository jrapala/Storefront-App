// Storefront App | By Juliette Rapala
// =====================================================================================

  // Setup Variables 
  // =====================================================================================

    // NPM Packages
    var mysql = require("mysql");
    require('console.table');
    var inquirer = require('inquirer');
    var isNumber = require('is-number');

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
        //connection.end();
      });
    }

    // Update product
    function updateProduct(productId, newQuantity) {
      connection.query("UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuantity
        },
        {
          item_id: productId
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
      });
    };

    // Let a customer purchase a product
    function sellToUser() {
      inquirer.prompt([{
        // Prompt for ID number
        name: "idOfProduct",
        type: "input",
        message: "What is the ID number of the product you wish to purchase? (Press Q to Quit)",
        // If Q, quit. If any other letter, ask for numerical input.
        validate: function(userInput) {
          if (userInput.toUpperCase() === "Q") {
            console.log("\n\nThank you! Have a good day!");
            connection.end();
          } else if (isNumber(userInput)) {
            return true;
          } else {
            console.log("\n\nYou did not choose a numerical ID. Please try again!\n");
            return false;
          }
        }},{
        // Prompt for quantity 
        name: "quantityOfProduct",
        type: "input",
        message: "How many units would you like to purchase? (Press Q to Quit)",
        // If Q, quit. If any other letter, ask for numerical input.
        validate: function(userInput) {
          if (userInput.toUpperCase() === "Q") {
            console.log("\n\nThank you! Have a good day!");
            connection.end();
          } else if (isNumber(userInput)) {
            return true;
          } else {
            console.log("\n\nYou did not choose a numerical quantity. Please try again!\n");
            return false;
          }
      }}]).then(function(response) {
        // Looks up product in database
        connection.query("SELECT * FROM products where item_id=?", [response.idOfProduct], function(err, res) {
          var productName;
          var currentQuantity;
          var desiredQuantity = response.quantityOfProduct;
          if (err) throw err;
          // Find product name and current quantity
          for (var i = 0; i < res.length; i++) {
            productName = res[i].product_name;
            currentQuantity = res[i].stock_quantity;
          };
          // If desired quantity in stock..
          if (currentQuantity >= desiredQuantity) {
            //updateProduct();
            var newQuantity = currentQuantity - desiredQuantity;
            updateProduct(response.idOfProduct, newQuantity);
            console.log(`Successfully purchased ${desiredQuantity} unit(s) of ${productName}(s).`);
            connection.end();
          // If desired quantity not in stock..
          } else {
            console.log(`Sorry, we do not have ${desiredQuantity} unit(s) of ${productName}.`)
            sellToUser();
          }

        });

      });

        
    }


    //   console.log(`Successfully purchased ${productId} ${quantity}(s).`);
    //   var query = connection.query(
    //   "UPDATE products SET ? WHERE ?", {quantity: 100}, function(err, res) {

    //   });
    // }


  // Start up Function
  // =====================================================================================

    connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId + "\n");
      readProducts()
    });

