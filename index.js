const db = require('./db/connection');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log(`Connected to the employee_db database.`);
});

function beginPrompt() {
  inquirer
    .prompt({
      type: 'list',
      message: 'Select the action you wish to perform.',
      name: 'choice',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View All Employees by Manager',
        'View all Employees by Department',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Employee',
        'Add Employee Role',
        'Add Department',
      ],
    })
    .then((val) => {
      switch (val.navigation) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View Employees by Manager':
          viewEmployeesByManager();
          break;
        case 'View all Employees by Department':
          viewEmployeesByDepartment();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          updateEmployeeManager();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Add Employee Role':
          addRole();
          break;
        case 'Add Department':
          addDepartment();
          break;
      }
    });
}

//View all employees
function viewAllEmployees() {
  db.query('SELECT * FROM employee', (err, rows) => {
    if (err) throw err;
    console.log(`Viewing all Employees`);
    console.table(rows);
    nextPrompt();
  });
}

//View all roles
function viewAllRoles() {
  db.query(`SELECT * FROM roles;`, (err, rows) => {
    if (err) throw err;
    console.log(`Viewing all Roles`);
    console.table(rows);
    nextPrompt();
  });
}

//View all departments
function viewAllDepartments() {
  db.query(`SELECT * FROM departments;`, (err, rows) => {
    if (err) throw err;
    console.log(`Viewing all Departments`);
    console.table(rows);
    nextPrompt();
  });
}

//View employees by manager id
function viewEmployeesByManager() {
  let currentEmployees = `SELECT employees.*, roles.title AS role_title, roles.salary, department_id, departments.name AS department_name
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.departments_id = departments.id;`;

  db.query(currentEmployees, (err, rows) => {
    if (err) throw err;
    console.table('Current Employees', rows);

    inquirer
      .prompt({
        type: 'input',
        name: 'managerId',
        message: 'Input the manager Id you wish to look-up',
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log('You must enter a valid Manager Id');
            return false;
          }
        },
      })
      .then(function (data) {
        const managerId = data.managerId;
        const sql = `SELECT * FROM employees WHERE manager_id = ?`;
        const params = [managerId];

        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(`Employees of Manager ${managerId}`);
          console.table(rows);
          nextPrompt();
        });
      });
  });
}

//view employees by department id
function viewEmployeesByDepartment() {
  const sqlShowDepartments = `SELECT *
  FROM departments
  LEFT JOIN employees ON employees.department_id = employee_departments.id
  LEFT JOIN departments ON departments.departments_id = departments.id;`;

  db.query(sqlShowDepartments, (err, rows) => {
    if (err) throw err;
    console.table('Current Employees', rows);

    inquirer
      .prompt({
        type: 'input',
        name: 'departmentId',
        message: 'Input the department Id you wish to look-up',
        validate: (departmentInput) => {
          if (departmentInput) {
            return true;
          } else {
            console.log('You must enter a valid Department Id');
            return false;
          }
        },
      })
      .then(function (data) {
        const departmentId = data.departmentId;
        const sql = `SELECT * FROM employees WHERE department_id = ?`;
        const params = [departmentId];

        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(`Employees of Department ${departmentId}`);
          console.table(rows);
          nextPrompt();
        });
      });
  });
}

//update employee role by employee id
function updateEmployeeRole() {
  const currentEmployees = `SELECT employees.*, roles.title AS role_title, roles.salary, department_id, departments.name AS department_name
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.departments_id = departments.id;`;

  db.query(currentEmployees, (err, rows) => {
    if (err) throw err;
    console.table('List of all Employees', rows);
  });

  let sqlShowRoles = `SELECT roles.*, departments.name AS department_name
  FROM roles
  LEFT JOIN departments ON roles.department_id = departments.id;`;

  db.query(sqlShowRoles, (err, rows) => {
    if (err) throw err;
    console.table('List of all Roles', rows);

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the employee ID you wish to update',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a valid Employee ID');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: `"Enter the new Role ID for Employee ${employee.name}"`,
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a valid Role ID.');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const employeeId = data.employeeId;
        const newRoleId = data.newRoleId;

        const sql = `UPDATE employees SET role_id = ? WHERE id= ?`;
        const params = [newRoleId, employeeId];

        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            `You successfully updated employee ${employeeId}'s employee role to ${newRoleId}`
          );
          viewAllEmployees();
        });
      });
  });
}

//update employee manager by manager id
function updateEmployeeManager() {
  let currentEmployees = `SELECT employees.*, roles.title AS role_title, roles.salary, department_id, departments.name AS department_name
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id;`;

  db.query(currentEmployees, (err, rows) => {
    if (err) throw err;
    console.table('List of all employees', rows);

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the employee ID you wish to update',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a valid Employee ID');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newManagerId',
          message: 'Enter new manager ID',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a valid Manager Id');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const employeeId = data.employeeId;
        const newManagerId = data.newManagerId;
        const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
        const params = [newManagerId, employeeId];

        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            `You successfully updated Employee ${employeeId}'s Manager to Manager ${newManagerId}`
          );
          viewAllEmployees;
        });
      });
  });
}

//add employee
function addEmployee() {
  currentEmployees = `SELECT employees.*, roles.title AS role_title,
    roles.salary, department_id, departments.name AS department_name
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id;`;
  db.query(currentEmployees, (err, rows) => {
    if (err) throw err;
    console.table('All Current Employees', rows);
  });

  sqlCurrentRoles = `SELECT roles.*, departments.name AS department_name
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id;`;

  db.query(sqlCurrentRoles, (err, rows) => {
    if (err) throw err;
    console.table('All Roles', rows);

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'newFirstName',
          message: 'Enter employees first name',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log(
                "This is a required field. Please enter new employee's first name"
              );
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newLastName',
          message: "Enter employee's last name",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log(
                "This is a required field. Please enter new employee's last name"
              );
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: "Enter employee's Role ID",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid Role ID for this new employee');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newManagerId',
          message: "Enter employee's manager ID ",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter a valid manager ID');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const newFirstName = data.newFirstName;
        const newLastName = data.newLastName;
        const newRoleId = data.newRoleId;
        const newManagerId = data.newManagerId;

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [newFirstName, newLastName, newRoleId, newManagerId];

        // to add new role info to db
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            ` You successfully added ${newFirstName} ${newLastName} to the database`
          );

          viewAllEmployees();
        });
      });
  });
}

//add employee role
function addRole() {
  sqlCurrentRoles = `SELECT roles.*, departments.name AS department_name
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id;`;

  db.query(sqlCurrentRoles, (err, rows) => {
    if (err) throw err;
    console.table('All Current Roles', rows);
  });

  sqlCurrentDepartment = `SELECT * FROM departments`;

  db.query(sqlCurrentDepartment, (err, rows) => {
    if (err) throw err;
    console.table('All Departments', rows);

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'newTitle',
          message: 'Enter the title of this new role.',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a title for this role.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newSalary',
          message: 'Enter the salary for this new role.',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a salary for this role.');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'newDepartmentId',
          message: 'Enter the department ID for this new role.',
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log('You must enter a department ID for this role.');
              return false;
            }
          },
        },
      ])
      .then(function (data) {
        const newRoleTitle = data.newTitle;
        const newRoleSalary = data.newSalary;
        const newRoleDeptId = data.newDepartmentId;

        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [newRoleTitle, newRoleSalary, newRoleDeptId];

        // to add new role info to db
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            `You successfully added ${newRoleTitle} to the database.`
          );

          viewAllRoles();
        });
      });
  });
}

//add department
function addDepartment() {
  const sql = `SELECT * FROM departments;`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table('All Departments', rows);

    inquirer
      .prompt({
        type: 'input',
        name: 'newDepartment',
        message: 'Enter the name of the department you wish to add.',
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log('You must enter a name for new departments.');
            return false;
          }
        },
      })
      .then(function (data) {
        const newDepartment = data.newDepartment;
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        const params = [newDepartment];

        // to add new department name to db
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log(
            ` You successfully added ${newDepartment} to the database.`
          );

          viewAllDepartments();
        });
      });
  });
}

//function to exit the program
function endProgram() {
  console.log(
    `You have exited Manage-U Employee Tracker. Enter 'npm start' in the console to restart.`
  );
  db.end();
  return;
}

//asks whether the user wants to make another selection or exit the program
function nextPrompt() {
  inquire
    .prompt({
      type: 'list',
      name: 'next',
      message: 'what would you like to do next?',
      choices: ['More choices', 'Quit'],
    })
    .then(function (selection) {
      switch (selection.next) {
        case 'More choices':
          beginPrompt();
          break;

        case 'Quit':
          endProgram();
          break;
      }
    });
}

//Starts program
beginPrompt();
