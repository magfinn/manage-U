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
function viewDepartments() {}

//VIEW all Roles
function viewRoles() {}

//VIEW all Employees
function viewEmployees() {}

//VIEW Employees by Manager
function viewEmployeesByManager() {}

//ADD Department
function addDepartment() {}

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
