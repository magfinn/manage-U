INSERT INTO departments (name)
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

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
(1, "Gary", "Begary", 2, 1),
(2, "Beth", "MacBeth", 3, 2),
(3, "Karen", "Waren", 4, 3),
(4, "Bobby", "DeLobby", 5, 1),
(5, "Flav", "Aflav", 2, 5);
