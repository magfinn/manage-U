const db = require('./db/connection');
const inquirer = require('inquirer');
const con = require('console.table');

db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log(`Connected to the employees_db database.`);
  mainMenu();
});

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'View employee by manager',
        'View employee by department',
        'View budget by department',
        'Add a department',
        'Add a roles',
        'Add an employees',
        'Update an employees roles',
        'Update an employees manager',
        'Exit',
      ],
    },
  ]);
  // view all departments
  if (answers.mainMenu === 'View all departments') {
    let departmentQuery = 'SELECT * FROM departments ORDER BY 1';
    db.query(departmentQuery, function (err, res) {
      if (err) return err;
      console.table(res);
      mainMenu();
    });
  }
  // view all roles
  if (answers.mainMenu === 'View all roles') {
    let rolesQuery = 'SELECT * FROM roles ORDER BY 1';
    db.query(rolesQuery, function (err, res) {
      if (err) return err;
      console.table(res);
      mainMenu();
    });
  }
  // view all employee
  if (answers.mainMenu === 'View all employees') {
    let employeesQuery = 'SELECT	* FROM employees ORDER BY 1;';
    db.query(employeesQuery, function (err, res) {
      if (err) return err;
      console.table(res);
      mainMenu();
    });
  }
  // view employee by manager
  if (answers.mainMenu === 'View employee by manager') {
    employeeByManager();
  }
  // view employee by department
  if (answers.mainMenu === 'View employee by department') {
    employeeByDepartment();
  }
  if (answers.mainMenu === 'View budget by department') {
    budgetByDepartment();
  }
  // add a department
  if (answers.mainMenu === 'Add a department') {
    addDepartment();
  }
  // add a roles
  if (answers.mainMenu === 'Add a roles') {
    addRoles();
  }
  // add an employees
  if (answers.mainMenu === 'Add an employees') {
    addEmployee();
  }
  // update an employees
  if (answers.mainMenu === 'Update an employees roles') {
    updateEmployeeRole();
  }
  if (answers.mainMenu === 'Update an employees manager') {
    updateEmployeeManager();
  }
  if (answers.mainMenu === 'Exit') {
    con.end();
  }
}

function employeeByManager() {
  let query =
    "select DISTINCT CONCAT (manager.first_name, ' ', manager.last_name) AS manager, manager.id FROM employees LEFT JOIN employees manager ON employees.manager_id = manager.id WHERE employees.manager_id IS NOT NULL ORDER BY manager.id;";

  // connection
  db.query(query, function (err, res) {
    if (err) return err;

    // assign array to response from connection
    let employeesIdArr = res;

    // map it
    let managers = res.map((m) => m.manager);

    // inquirer
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'Select Manager:',
          choices: managers,
        },
      ])
      .then(function (answers) {
        // declare empty Id variable
        let managerId = '';

        for (i = 0; i < employeesIdArr.length; i++) {
          if (employeesIdArr[i].manager === answers.manager) {
            // assign id from answer to empty variale
            managerId = employeesIdArr[i].id;
          }
        }
        let employeeByManagerQuery = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department,roles.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE manager.id = ${managerId} ORDER BY 1;`;
        db.query(employeeByManagerQuery, function (err, res) {
          if (err) return err;
          console.table(res);
          // return to main menu
          mainMenu();
        });
      });
  });
}

function employeeByDepartment() {
  let query = 'SELECT id, name FROM departments';

  // connection
  db.query(query, function (err, res) {
    if (err) return err;

    // assign array to response from connection
    let departmentIdArr = res;

    // map it
    let departments = res.map((d) => d.name);

    // inquirer
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departments',
          message: 'Select Department:',
          choices: departments,
        },
      ])
      .then(function (answers) {
        // declare empty Id variable
        let departmentId = '';

        for (i = 0; i < departmentIdArr.length; i++) {
          if (departmentIdArr[i].name === answers.departments) {
            // assign id from answer to empty variale
            departmentId = departmentIdArr[i].id;
          }
        }
        let employeesDeptQuery = `SELECT	employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department,roles.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN departments ON roles.departments_id = departments.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE departments.id = ${departmentId} ORDER BY 1`;
        db.query(employeesDeptQuery, function (err, res) {
          if (err) return err;
          console.table(res);
          // return to main menu
          mainMenu();
        });
      });
  });
}

function budgetByDepartment() {
  let query = 'SELECT id, name FROM departments';

  // connection
  db.query(query, function (err, res) {
    if (err) return err;

    // assign array to response from connection
    let departmentArr = res;

    // map it
    let department = res.map((departments) => departments.name);

    // inquirer
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Select Department:',
          choices: department,
        },
      ])
      .then(function (answers) {
        // declare empty Id variable
        let departmentId = '';

        for (i = 0; i < departmentArr.length; i++) {
          if (departmentArr[i].name === answers.department) {
            // assign id from answer to empty variale
            departmentId = departmentArr[i].id;
          }
        }
        let employeesDeptQuery = `SELECT departments.id, departments.name AS departments_name, (select SUM(roles.salary) from roles where roles.departments_id = departments.id) AS total_salaries FROM departments WHERE departments.id = (${departmentId}) ORDER BY 1`;
        db.query(employeesDeptQuery, function (err, res) {
          if (err) return err;
          console.table(res);
          // return to main menu
          mainMenu();
        });
      });
  });
}

async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: 'Enter Department Name:',
    },
  ]);
  let insertStatement = `INSERT INTO departments (name) VALUES ('${answers.addDepartment}')`;
  db.query(insertStatement, function (err, res) {
    if (err) return err;
    console.log('\n Department added! \n');
    // return to main menu
    mainMenu();
  });
}

function addRoles() {
  // query
  let query = 'SELECT * FROM departments ORDER BY 1';

  // connection
  db.query(query, function (err, res) {
    if (err) return err;

    // array that equals res
    let departmentArr = res;

    // map it
    let department = res.map((departments) => departments.name);

    // inquirer
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the Role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter Salary:',
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select Department:',
          choices: department,
        },
      ])
      .then(function (answers) {
        // get Ids of selected options

        let departmentId = '';

        for (i = 0; i < departmentArr.length; i++) {
          if (departmentArr[i].name === answers.department) {
            departmentId = departmentArr[i].id;
          }
        }

        let insertRoles = `INSERT INTO roles (title,salary,department_id) VALUES ('${answers.title}','${answers.salary}', ${departmentId})`;
        db.query(insertRoles, function (err, res) {
          if (err) return err;
          console.log('\n Roles added! \n');
          mainMenu();
        });
      });
  });
}

function addEmployee() {
  // queries
  let rolesQuery = 'SELECT id, title FROM roles ORDER BY 1';
  let employeesQuery =
    "SELECT id, concat(first_name, ' ', last_name) AS name, roles_id, manager_id FROM employee ORDER BY 1";

  // connections
  db.query(rolesQuery, function (err, res) {
    if (err) return err;

    let rolesArr = res;
    let role = res.map((roles) => roles.title);

    db.query(employeesQuery, function (err, res) {
      if (err) return err;
      let employeesArr = res;
      let employee = res.map((employees) => employees.name);
      employee.push('None');

      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter Employee's First Name:",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter Employee's Last Name:",
          },
          {
            type: 'list',
            name: 'roles',
            message: 'Select Role:',
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager',
            message: 'Select Manager:',
            choices: employees,
          },
        ])
        .then(function (answers) {
          let rolesId = '';
          for (i = 0; i < rolesArr.length; i++) {
            if (rolesArr[i].title === answers.roles) {
              rolesId = rolesArr[i].id;
            }
          }
          let employeesId = '';
          for (i = 0; i < employeesArr.length; i++) {
            if (employeesArr[i].name === answers.manager) {
              employeesId = employeesArr[i].id;
            }
          }
          let addEmployeeManager = `INSERT INTO employees (first_name,last_name,roles_id,manager_id) VALUES ('${answers.first_name}','${answers.last_name}', ${rolesId}, ${employeesId})`;

          let addEmployeeOnly = `INSERT INTO employees (first_name,last_name,roles_id) VALUES ('${answers.first_name}','${answers.last_name}', ${rolesId})`;

          if (answers.manager === 'None') {
            db.query(addEmployeeOnly, function (err, res) {
              if (err) return err;
              console.log('\n employees added \n');
              mainMenu();
            });
          }

          if (answers.manager != 'None') {
            db.query(addEmployeeManager, function (err, res) {
              if (err) return err;
              console.log('\n Employee added! \n');
              mainMenu();
            });
          }
        });
    });
  });
}

function updateEmployeeRole() {
  let employeesQuery =
    "SELECT id, concat(first_name, ' ', last_name) AS name FROM employees ORDER BY 1";
  let rolesQuery = 'SELECT id, title FROM roles ORDER BY 1';

  // create connections
  db.query(employeesQuery, function (err, res) {
    if (err) return err;
    let employeesArr = res;
    let employee = res.map((employees) => employees.name);

    db.query(rolesQuery, function (err, res) {
      if (err) return err;
      let rolesArr = res;
      let role = res.map((roles) => roles.title);

      //restart prompts
      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'employees',
            message: 'What employees would you like to update?',
            choices: employee,
          },
          {
            type: 'list',
            name: 'roles',
            message: 'What is the new roles?',
            choices: role,
          },
        ])
        .then(function (answers) {
          let employeesId = '';
          for (i = 0; i < employeesArr.length; i++) {
            if (employeesArr[i].name === answers.employees) {
              employeesId = employeesArr[i].id;
            }
          }
          let rolesId = '';

          for (i = 0; i < rolesArr.length; i++) {
            if (rolesArr[i].title === answers.roles) {
              rolesId = rolesArr[i].id;
            }
          }
          let employeesUpdate =
            'UPDATE employees SET roles_id = ? WHERE id = ?';

          db.query(
            employeesUpdate,
            [rolesId, employeesId],
            function (err, res) {
              if (err) return err;

              console.log('\n Employee role updated! \n');
              mainMenu();
            }
          );
        });
    });
  });
}

function updateEmployeeManager() {
  // queries
  let employeesQuery =
    "SELECT id, concat(first_name, ' ', last_name) AS name FROM employees ORDER BY 1";

  // create connections
  db.query(employeesQuery, function (err, res) {
    if (err) return err;

    let employeesArr = res;

    let employee = res.map((employees) => employees.name);

    // inquirer questions with arrays plugged in
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employees',
          message: 'What employees would you like to update?',
          choices: employee,
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Select Manager:',
          choices: employee,
        },
      ])
      .then(function (answers) {
        // get Ids of selected options

        let employeesId = '';
        let managerId = '';

        for (i = 0; i < employeesArr.length; i++) {
          if (employeesArr[i].name === answers.employees) {
            employeesId = employeesArr[i].id;
          }
          if (employeesArr[i].name === answers.manager) {
            managerId = employeesArr[i].id;
          }
        }
        // create connection for update statement
        let employeesUpdate =
          'UPDATE employees SET manager_id = ? WHERE id = ?';

        db.query(
          employeesUpdate,
          [managerId, employeesId],
          function (err, res) {
            if (err) return err;

            console.log('\n employees manager updated \n');

            // return to main menu
            mainMenu();
          }
        );
      });
  });
}
