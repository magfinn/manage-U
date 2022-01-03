//import & require express
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection({
      host: 'localhost',
      port: '3001',
      user: 'root',
      password: '',
      database: 'employee'
    });
connection.connect(function(err) {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId);
});

connection.query(
    'SELECT * FROM `employees`', function(err, results, fields) {
        if(error) throw err;
        console.log(results);
        console.log(fields);
    });

connection.destroy();

// connection.connect(function(err) {
//     if(err) throw err;
//     console.log(`Connected to the employee_db database.`)
//     beginPrompt();
//   });

//   function beginPrompt() {
//       inquirer.prompt([
//           {
//               type: "list",
//               message: "What action would you like to take?",
//               name: "choice",
//               choices: [
//                   "View All Employees",
//                   "View All Employees by Role",
//                   "View all Employees by Department", 
//                   "Update Employee",
//                   "Add Employee",
//                   "Add Employee Role",
//                   "Add Department"  
//               ]
//           }
//       ]).then(function(val) {
//           switch(val.choice) {
//             case "View All Employees":
//                 viewAllEmployees();
//                 break;
//             case "View All Employees by Role":
//                 viewAllRoles();
//                 break;
//             case "View all Employees by Department":
//                 viewAllDepartments();
//                 break;
//             case "Update Employee":
//                 updateEmployee();
//                 break;
//             case "Add Employee":
//                 addEmployee();
//                 break;
//             case "Add Employee Role":
//                 addRole();
//                 break;
//             case "Add Department":
//                 addDepartment();
//                 break;
//             }
//     }) 
// };
  // Query database
// db.query('SELECT * FROM departments', function (err, results) {
//     console.log(results);
//   });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });


//connection.js (modularize) inside db folder
//connection (credentials with mysql)