INSERT INTO departments (department_name)
VALUES 
  ("Resource Development"),
  ("Communications"),
  ("Finance"),
  ("Legal"),
  ("Health and Human Services");

INSERT INTO roles (title, salary, department_id) 
VALUES
  ("Manager", 50000, 2),
  ("Executive Director", 100000, 1),
  ("Attorney", 85000, 4),
  ("Case Manager", 40000, 5),
  ("Controller", 75000, 3);

INSERT INTO employees (first_name, last_name) 
VALUES 
("Gary", "Begary"),
("Beth", "MacBeth"),
("Karen", "Waren"),
("Bobby", "DeLobby"),
("Flav", "Aflav");
