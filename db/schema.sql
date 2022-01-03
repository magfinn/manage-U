DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30),
);

CREATE TABLE employee_role(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30),
  salary DECIMAL;
  -- Sets relationship between role table and departments table --
  FOREIGN KEY (department)
  REFERENCES departments(id)
  ON DELETE SET NULL
  ,
);

CREATE TABLE employee(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id: INTEGER,
  -- Sets relationship between employees table and roles table and employee and employee manager --
  FOREIGN KEY (employee_role),(employee)
  REFERENCES employee_roles(id),(employee(manager_id))
  ON DELETE SET NULL
);
