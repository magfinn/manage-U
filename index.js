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
        case 'View All Departments':
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
//EXIT
function quitProgram() {
  console.log(`Bye! See you next time!`);
  db.end();
  return;
}

//Prompt after each action taken
function quitOrContinue() {
  inquirer
    .prompt({
      type: 'list',
      name: 'quitOrContinue',
      message: 'Would you like to exit out of the program or continue?',
      choices: ['Continue', 'Exit'],
    })
    .then(function (selection) {
      //switch case for appropriate selection function
      switch (selection.quitOrContinue) {
        case 'Continue':
          runProgram();
          break;

        case 'Exit':
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
  });
}

//VIEW all Roles
function viewRoles() {
  const sql = `select roles.*, departments.name AS department_name from roles LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(`Viewing all active roles.`);
    console.table(rows);
    quitOrContinue();
  });
}

//VIEW all Employees
function viewEmployees() {
  const sql = `select employees.*, roles.title AS role_title, roles.salary, department_id, departments.name AS department_name from employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(`Viewing all active roles.`);
    console.table(rows);
    quitOrContinue();
  });
}

//VIEW Employees by Manager
function viewEmployeesByManager() {
  const curEmployee = `select employees.*, roles.title as role_title, roles.salary, department_id, departments.name as department_name from employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id;`;
  db.query(curEmployee, (err, rows) => {
    if (err) throw err;
    console.table('List of all employees:', rows);
    inquirer
      .prompt({
        type: 'input',
        name: 'managerId',
        message: 'Enter the manager ID',
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log('Please enter the Manager ID.');
            return false;
          }
        },
      })
      .then(function (data) {
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
      });
  });
}

//ADD Department
function addDepartment() {
  const sql = `select * from departments;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table('Department List:', rows);
    inquirer
      .prompt({
        type: 'input',
        name: 'newDept',
        message: 'Enter name of new department.',
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log('Please enter a valid department name');
            return false;
          }
        },
      })
      .then(function (data) {
        const addDept = data.newDept;
        const sql = `insert into departments (name) VALUES (?)`;
        const params = [addDept];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(`You added a new department named ${addDept}!`);
          viewDepartments();
        });
      });
  });
}

//ADD Role
function addRole() {
  const sqlRole = `select roles.*, departments.name as department_name from roles LEFT JOIN departments on roles.department_id;`;
  db.query(sqlRole, (err, rows) => {
    if (err) throw err;
    console.table('List of active roles:', rows);
  });
  const sqlDept = `select * from departments`;
  db.query(sqlDept, (err, rows) => {
    console.table('List of departments for reference:', rows);
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'newTitle',
          message: 'Enter the new role title.',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid title.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newSalary',
          message: 'Enter salary for this new role.',
          validate: (numInput) => {
            if (numInput) {
              return true;
            } else {
              console.log('Please enter a valid amount.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newDeptId',
          message: 'Enter the department ID associated with this new role.',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid id.');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const newTitle = data.newTitle;
        const newSalary = data.newSalary;
        const newDept = data.newDeptId;
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [newTitle, newSalary, newDept];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(`You added ${newTitle} to the database.`);
          viewRoles();
        });
      });
  });
}

//ADD Employee
function addEmployee() {
  const sqlEmployee = `select employees.*, roles.title as role_title, roles.salary, department_id, departments.name as department_name from employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(sqlEmployee, (err, rows) => {
    if (err) throw err;
    console.table('Current employees:', rows);
  });
  const sqlRoles = `select roles.*, departments.name AS department_name from roles LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(sqlRoles, (err, rows) => {
    console.table('List of all Roles:', rows);
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'newFirstName',
          message: "Enter employee's first name.",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a name.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newLastName',
          message: "Enter employee's last name.",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a name.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: "Enter employee's new role by ID.",
          validate: (numInput) => {
            if (numInput) {
              return true;
            } else {
              console.log('Please enter a valid id.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newManagerId',
          message: "Enter employee's manager by ID.",
          validate: (numInput) => {
            if (numInput) {
              return true;
            } else {
              console.log('Please enter a valid id.');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const firstName = data.newFirstName;
        const lastName = data.newLastName;
        const roleId = data.newRoleId;
        const managerId = data.newManagerId;
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [firstName, lastName, roleId, managerId];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(`You added ${firstName} ${lastName} to the database.`);
          viewEmployees();
        });
      });
  });
}

//UPDATE Role
function updateRole() {
  let sqlCurrentEmp = `select employees.*, roles.title as role_title, roles.salary, department_id, departments.name as department_name from employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(sqlCurrentEmp, (err, rows) => {
    if (err) throw err;
    console.table('Current Employees:', rows);
  });
  let sqlCurrentRoles = `select roles.*, departments.name as department_name from roles LEFT JOIN departments on roles.department_id = departments.id;`;
  db.query(sqlCurrentRoles, (err, rows) => {
    if (err) throw err;
    console.table('Current Roles:', rows);
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the employee you would like to update by Id',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid Id');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'roleId',
          message: 'Enter the new role Id for this employee',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid Id');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        let newEmployeeId = data.employeeId;
        let newRoleId = data.roleId;
        let sql = `update employees set role_id = ? where id= ?`;
        const params = [newRoleId, newEmployeeId];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            `You successfully updated employee ${newEmployeeId} to role ${newRoleId}`
          );
          viewEmployees();
        });
      });
  });
}

//UPDATE Manager
function updateManager() {
  let currentEmp = `select employees.*, roles.title as role_title, roles.salary, department_id, departments.name as department_name from employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(currentEmp, (err, rows) => {
    if (err) throw err;
    console.table('Current employees:', rows);
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the employee you would like to update by Id',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid Id');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'managerId',
          message: "Enter this employee's new manager by Id.",
          validate: (numInput) => {
            if (numInput) {
              return true;
            } else {
              console.log('Please enter a valid Id');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        let managerId = data.managerId;
        let sql = `select * from employees where manager_id= ?`;
        const params = [managerId];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            `You successfully updated manager ${managerId}. View all current employees managed by ${managerId}`
          );
          quitOrContinue();
        });
      });
  });
}

//Start the program with function
runProgram();
