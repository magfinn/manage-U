INSERT INTO departments (name)
VALUES 
  ("Resource Development"),
  ("Communications"),
  ("Finance"),
  ("Legal"),
  ("Health and Human Services");

INSERT INTO roles (title, salary, department_id) 
VALUES
  ("Manager", 50000.00, 2),
  ("Executive Director", 100000.00, 1),
  ("Attorney", 85000.00, 4),
  ("Case Manager", 40000.00, 5),
  ("Controller", 75000.00, 3);

INSERT INTO employees (first_name, last_name) 
VALUES 
("Gary", "Begary"),
("Beth", "MacBeth"),
("Karen", "Waren"),
("Bobby", "DeLobby"),
("Flav", "Aflav");
