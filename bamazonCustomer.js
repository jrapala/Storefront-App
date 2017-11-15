// Storefront App | By Juliette Rapala
// =====================================================================================

  // Setup  
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

    // Read database
    function readProducts() {
      // Display all products in the store
      console.log("\nSelecting all products...\n");
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // Sell function
        sellToUser();
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
        // Error handling
        if (err) throw err;
      });
    };

    function promptUser() {
      inquirer.prompt([{
        name: "buyAgain",
        type: 'list',
        message: "Would you like to buy another product?",
        choices: ['Yes', 'No']
    }]).then(function(response) {
      if (response.buyAgain === "Yes") {
        readProducts();
      } else {
        console.log("\nThank you! Have a good day!\n");
        process.exit(); 
      }
    })
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
            process.exit(); 
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
            process.exit(); 
          } else if (isNumber(userInput)) {
            return true;
          } else {
            console.log("\n\nYou did not choose a numerical quantity. Please try again!\n");
            return false;
          }
      }}]).then(function(response) {
        // Looks up product in database
        connection.query("SELECT * FROM products where item_id=?", [response.idOfProduct], function(err, res) {
          // Set up variables
          var productName;
          var currentQuantity;
          var desiredQuantity = response.quantityOfProduct;
          // Error handling
          if (err) throw err;
          // Find product name and current quantity
          for (var i = 0; i < res.length; i++) {
            productName = res[i].product_name;
            currentQuantity = res[i].stock_quantity;
          };
          // If desired quantity in stock, purchase product and update database.
          if (currentQuantity >= desiredQuantity) {
            var newQuantity = currentQuantity - desiredQuantity;
            updateProduct(response.idOfProduct, newQuantity);
            console.log(`\nSuccessfully purchased ${desiredQuantity} unit(s) of ${productName}(s).\n`);
            // Ask user if they would like to purchase another product
            promptUser();
          // If desired quantity not in stock, user cannot purchase item
          } else {
            if (productName === undefined) {
              console.log(`\nSorry, we do not have a product with that ID number.\n`);
              promptUser();
            } else {
              console.log(`\nSorry, we do not have ${desiredQuantity} unit(s) of ${productName}.\n`);
              // Ask user if they would like to purchase another product
              promptUser();
            }
          }
        });
      });       
    }



  // Start up Function
  // =====================================================================================

    connection.connect(function(err) {
      if (err) throw err;
    });
    readProducts();

