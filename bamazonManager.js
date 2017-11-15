// Storefront App | By Juliette Rapala
// =====================================================================================

// To Do

// If a manager selects View Low Inventory, then it should list all items with an inventory 
// count lower than five.

// If a manager selects Add to Inventory, your app should display a prompt that will let the 
// manager "add more" of any item currently in the store.

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.


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

    // Prompt user for action
    function promptUser() {
      inquirer.prompt([{
          name: "action",
          type: 'list',
          message: "Please select an option:",
          choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
      }]).then(function(response) {
        switch (response.action) {
          case ('View Products for Sale'):
            viewProducts();
            break;
          case ('View Low Inventory'):
            viewLowInventory();
            break;
          case ('Add to Inventory'):
            addToInventory();
            break;
          case ('Add New Product'):
            console.log('Option 4');
            //addNewProduct();
            break;
          case ('Quit'):
            console.log("\nThank you! Have a good day!\n");
            process.exit();
            break;
          default:
            console.log('Nothing chosen');
            break;
        }
      })
    };

    // Read database
    function viewProducts() {
      // Display all products in the store
      console.log("\nSelecting all products...\n");
      connection.query("SELECT * FROM products", function(err, res) {
        // Error handling
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // Return to prompts
        promptUser();
      });
    }

    // View low product inventory
    function viewLowInventory() {
      connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        // Error handling
        if (err) throw err;
        // Message if all products have at least 5 items in stock.
        if (res.length === 0) {
          console.log("\nAll products have at least 5 items in stock.\n")
          promptUser();
        // Display any products that have less than 5 items in stock.
        } else {
          console.log(" ");
          console.table(res);
          // Return to prompts
          promptUser();
        }
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


    function addToInventory() {
      inquirer.prompt([{
        // Prompt for ID number
        name: "idOfProduct",
        type: "input",
        message: "What is the ID number of the product you wish to increase the inventory of? (Press Q to Exit)",
        // If Q, quit. If any other letter, ask for numerical input.
        validate: function(userInput) {
          if (userInput.toUpperCase() === "Q") {
            console.log("\n\n");
            promptUser();
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
        message: "How many units would you add? (Press Q to Exit)",
        // If Q, quit. If any other letter, ask for numerical input.
        validate: function(userInput) {
          if (userInput.toUpperCase() === "Q") {
            console.log("\n\n");
            promptUser();
          } else if (isNumber(userInput)) {
            return true;
          } else {
            console.log("\nYou did not choose a numerical quantity. Please try again!\n");
            return false;
          }
      }}]).then(function(response) {  
        // Variables
        var productId = response.idOfProduct;
        var productName;
        var quantityToAdd = parseInt(response.quantityOfProduct);
        var currentQuantity;
        var newQuantity;
        connection.query("SELECT * FROM products WHERE item_id = ?", [productId], function(err, res) {
          // Error handling
          if (err) throw err;
          // Find current quantity of product
          for (var i = 0; i < res.length; i++) {
            productName = res[i].product_name;
            currentQuantity = parseInt(res[i].stock_quantity);
          };
          // Handler if product is not in the database
          if (productName === undefined) {
            console.log(`\nSorry, we do not have a product with that ID number.\n`);
            promptUser();
          } else {
            // Find new quantity of product
            newQuantity = currentQuantity + quantityToAdd;
            // Update product in database
            updateProduct(productId, newQuantity);
            console.log(`\n${quantityToAdd} units of ${productName} added. The new quantity in stock is ${newQuantity}.\n`)
            // Return to prompts
            promptUser();
          }
        });
      });
    };


    //     // Get current inventory
    //     connection.query("UPDATE products SET ? WHERE ?",
    //   [
    //     {
    //       stock_quantity: newQuantity
    //     },
    //     {
    //       item_id: productId
    //     }
    //   ],
    //   function(err, res) {
    //     // Error handling
    //     if (err) throw err;
    //   });

    //     var productId = response
    // }

    // // Update product
    // function updateProduct(productId, newQuantity) {
    //   connection.query("UPDATE products SET ? WHERE ?",
    //   [
    //     {
    //       stock_quantity: newQuantity
    //     },
    //     {
    //       item_id: productId
    //     }
    //   ],
    //   function(err, res) {
    //     // Error handling
    //     if (err) throw err;
    //   });
    // };



    // // Let a customer purchase a product
    // function sellToUser() {
    //   inquirer.prompt([{
    //     // Prompt for ID number
    //     name: "idOfProduct",
    //     type: "input",
    //     message: "What is the ID number of the product you wish to purchase? (Press Q to Quit)",
    //     // If Q, quit. If any other letter, ask for numerical input.
    //     validate: function(userInput) {
    //       if (userInput.toUpperCase() === "Q") {
    //         console.log("\n\nThank you! Have a good day!");
    //         process.exit(); 
    //       } else if (isNumber(userInput)) {
    //         return true;
    //       } else {
    //         console.log("\n\nYou did not choose a numerical ID. Please try again!\n");
    //         return false;
    //       }
    //     }},{
    //     // Prompt for quantity 
    //     name: "quantityOfProduct",
    //     type: "input",
    //     message: "How many units would you like to purchase? (Press Q to Quit)",
    //     // If Q, quit. If any other letter, ask for numerical input.
    //     validate: function(userInput) {
    //       if (userInput.toUpperCase() === "Q") {
    //         console.log("\n\nThank you! Have a good day!");
    //         process.exit(); 
    //       } else if (isNumber(userInput)) {
    //         return true;
    //       } else {
    //         console.log("\n\nYou did not choose a numerical quantity. Please try again!\n");
    //         return false;
    //       }
    //   }}]).then(function(response) {
    //     // Looks up product in database
    //     connection.query("SELECT * FROM products where item_id=?", [response.idOfProduct], function(err, res) {
    //       // Set up variables
    //       var productName;
    //       var productPrice;
    //       var currentQuantity;
    //       var desiredQuantity = response.quantityOfProduct;
    //       var grandTotal;
    //       // Error handling
    //       if (err) throw err;
    //       // Find product name and current quantity
    //       for (var i = 0; i < res.length; i++) {
    //         productName = res[i].product_name;
    //         productPrice = res[i].price;
    //         currentQuantity = res[i].stock_quantity;
    //       };
    //       // If user requests 0 units to buy, no purchase is made.
    //       if (desiredQuantity === '0') {
    //         console.log("\nQuantity purchased is 0. No purchase made.\n");
    //         promptUser();
    //       // If desired quantity in stock, purchase product, show grand total, and update database.
    //       } else if (currentQuantity >= desiredQuantity) {
    //         var newQuantity = currentQuantity - desiredQuantity;
    //         var grandTotal = desiredQuantity * parseFloat(productPrice);
    //         updateProduct(response.idOfProduct, newQuantity);
    //         console.log(`\nSuccessfully purchased ${desiredQuantity} unit(s) of ${productName}(s).`);
    //         console.log(`Your total is $${grandTotal}.\n`);
    //         // Ask user if they would like to purchase another product
    //         promptUser();
    //       // If desired quantity not in stock, user cannot purchase item
    //       } else {
    //         // Handler if product is not in the database
    //         if (productName === undefined) {
    //           console.log(`\nSorry, we do not have a product with that ID number.\n`);
    //           promptUser();
    //         } else {
    //           console.log(`\nSorry, we do not have ${desiredQuantity} unit(s) of ${productName}.\n`);
    //           // Ask user if they would like to purchase another product
    //           promptUser();
    //         }
    //       }
    //     });
    //   });       
    // }



  // Start up Function
  // =====================================================================================

    connection.connect(function(err) {
      if (err) throw err;
    });
    promptUser();

