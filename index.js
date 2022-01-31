const db = require('./db/connection');
const inquirer = require('inquirer');
const con = require('console.table');

function runProgram() {
  console.log(`You have initated Manage U Employee Tracker!`);
  inquirer
    .prompt({
      type: 'list',
      name: 'mainMenu',
      message: 'Which would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'View Employees by Manager',
        'Add A Department',
        'Add A Role',
        'Add An Employee',
        'Update An Employee Role',
        'Update Employee Manager',
        'Exit Employee Tracker',
      ],
    })
    .then(function (selection) {
      //switch case for appropriate selection function
      switch (selection.mainMenu) {
        case 'View All Deparments':
          viewDepartments();
          break;

        case 'View All Roles':
          viewRoles();
          break;

        case 'View All Employees':
          viewEmployees();
          break;

        case 'View Employees by Manager':
          viewEmployeesByManager();
          break;

        case 'Add A Department':
          addDepartment();
          break;

        case 'Add A Role':
          addRole();
          break;

        case 'Add An Employee':
          addEmployee();
          break;

        case 'Update An Employee Role':
          updateRole();
          break;

        case 'Update Employee Manager':
          updateManager();
          break;

        case 'Exit Employee Tracker':
          quitProgram();
          break;
      }
    });
}

//VIEW all Departments
function viewDepartments() {
   const sql = `select * from departments;`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log(`Viewing all active departments.`);
        console.table(rows);
        quitOrContinue();
    })
};

//VIEW all Roles
function viewRoles() {
  const sql= `select roles.*, department.name AS department_name from roles LEFT JOIN departments ON roles.departments_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if(err) throw err;
    console.log(`Viewing all active roles.`);
    console.table(rows);
    quitOrContinue();
  });
};

//VIEW all Employees
function viewEmployees() {
  const sql= `select employees.*, roles.title AS role_title, roles.salary, department_id, departments.name AS department_name from employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if(err) throw err;
    console.log (`Viewing all active roles.`);
    console.table(rows);
    quitOrContinue();
  });
};

//VIEW Employees by Manager
function viewEmployeesByManager() {
  const curEmployee = `select employees.*, roles.title as role_title, roles.salary, department_id, departments.names as department_name from employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id;`;
  db.query(curEmployee, (err, rows) => {
    if(err) throw err;
        console.table('List of all employees:', rows);
        inquirer.prompt (
                {
                    type: "input",
                    name: "managerId",
                    message: "Enter the manager ID",
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        } else {
                            console.log ('Please enter the Manager ID.');
                            return false;
                        }
                    }
                }
            )
            .then (function(data) {
                const managerId = data.managerId;
                const sql = `select * from employees WHERE manager_id = ?`;
                const params = [managerId];
                //add to db
                db.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log(`Viewing all employees managed by Manager ${managerId}`);
                console.table(rows);
                quitOrContinue();
                });
            })
  })
}

//ADD Department
function addDepartment() {
  const sql= `select * from departments;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table('Department List:', rows);
    inquirer.prompt (
      {
        type: 'input',
        name: 'newDept',
        message: 'Enter name of new department.',
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log ('Please enter a valid department name');
            return false;
          }
        }
      }
    )
    .then (function(data) {
      const addDept = data.newDept;
      const sql = `INSERT INTO departments (name) VALUES (?)`;
            const params = [addDept];
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`You added a new department named ${addDepartment}!`);
        viewDepartments();
            });
        })
    });
};

//ADD Role
function addRole() {}

//ADD Employee
function addEmployee() {}

//UPDATE Role
function updateRole() {}

//UPDATE Manager
function updateManager() {}

//EXIT
function quitProgram() {}

//Prompt for next steps
function quitOrContinue() {
  inquirer.prompt ({
        type: "list",
        name: "quitOrContinue",
        message: "Would you like to exit out of the program or continue?",
        choices: 
            [
              'Continue', 
            'Exit'
            ]
    })
    .then (function(selection) {
    
        //switch case for appropriate selection function
        switch (selection.contOrExit) {
            case 'Continue':
                runProgram();
                break;

            case 'Exit':
                quitProgram();
                break;
        }
    })
};

}
