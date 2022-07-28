INSERT INTO department(id, department_name)
    VALUES
    (001, "Management"),
    (002, "Marketing"),
    (003, "Engineering"),
    (004, "Finance"),
    (005, "Sales"),
    (006, "HR"),
    (007, "Retail"),
    (008, "IT Services");

INSERT INTO role (id, title, salary, department_id)
    VALUES
    (10, "Operations Manager", 100.50, 001),
    (11, "Office Manager", 100.50, 001),
    (12, "CEO", 3000000.50, 001),
    (20, "Marketing Manager", 40.50, 002),
    (21, "Marketing Assistant", 40.10, 002),
    (30, "Engineering Manager", 200.00, 003),
    (15, "Software Engineering Lead", 168.00, 003),
    (31, "Senior Engineer", 90.50, 003),
    (32, "Junior Engineer", 80.50, 003),
    (40, "Finance Manager", 60.08, 004),
    (41, "Accountant", 58.06, 004),
    (50, "Sales Manager", 5.05, 005),
    (51, "Sales Assistant", 2.50, 005),
    (52, "Sales Associate", 1.00, 005),
    (60, "HR Manager", 20.08, 006),
    (61, "HR Rep", 18.69, 006);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES
    (1000, "Amir", "Hackett", 40, null),
    (1001, "Leon", "Kennedy", 10, null),
    (1002, "Bruce", "Wayne", 11, null),
    (1003, "Roland", "Dechain", 12, null),
    (2001, "Scott", "Derrickson", 20, null),
    (2002, "Peter", "Parker", 21, 2001),
    (2003, "Tony", "Stark", 21, 2001),
    (2004, "Greg", "Miller", 21, 2001),
    (3001, "Jason", "Todd", 30, null),
    (3002, "Harry", "Potter", 31, 3001),
    (3003, "Mark", "Millar", 32, 3001),
    (3004, "Ginny", "Weasly", 33, 3001),
    (3005, "Carter", "Morgan", 33, 3001),
    (3006, "Steve", "Rogers", 33, 3001),
    (4001, "Alfred", "Pennyworth", 40, null),
    (4002, "Andrew", "Schultz", 41, 4001),
    (4003, "Fred", "Flintstone", 41, 4001),
    (5001, "Raj", "Rai", 50, null),
    (5002, "Meg", "Turney", 51, 5001),
    (5003, "John", "Stewart", 52, 5001),
    (5004, "Selina", "Kyle", 52, 5001),
    (6001, "Cuthbert", "Allgood", 60, null),
    (6002, "Clark", "Kent", 61, 6001),
    (6003, "Reed", "Richards", 61, 6001),
    (6004, "Victor", "Doom", 61, 6001);