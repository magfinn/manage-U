DROP DATABASE IF EXISTS 
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INT PRIMARY KEY NOT NULL,
  department_name VARCHAR(30),
);

CREATE TABLE role(
  id INT PRIMARY KEY,
  role_title VARCHAR(30),
  salary DECIMAL;
  department_id INT NOT NULL,
);

CREATE TABLE employee(
  id INT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id: INT,
  manager_id: INT,
);