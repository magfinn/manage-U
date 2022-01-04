//import & require express
const express = require('express');
const mysql = require('mysql2');

// const inquirer = require('inquirer');
// const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'workplace'
    },
    console.log ('Connected to the workplace database.')
);
// db.connect(function(err) {
//     if(err) throw err;
//     console.log('connected as id ' + db.threadId);
//     // beginPrompt();
// });

//get all employees
app.get('/api/employees', (req, res) => {
    const sql = `SELECT * FROM employees`;
    
    db.query(sql,(err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Get a single employee
app.get('/api/employee/:id', (req,res) => {
    const sql = `SELECT * FROM employees WHERE id=?`;
    const params = [req.params.id];

    db.query(sql,params, (err,row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//get all departments
app.get('/api/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql,(err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//deleting an employee
app.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

//creating a new employee
app.post('/api/employee', ({body}, res) => {
    const errors = inputCheck(
        body,
        'first_name',
        'last_name',
        'industry_connected'
      );
      if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO employees(first_name, last_name, manager_id) 
        VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.manager_id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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
  
