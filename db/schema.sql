DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee; 

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER UNSIGNED NULL REFERENCES department(id)
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INTEGER UNSIGNED NOT NULL REFERENCES department(id),
    manager_id INTEGER UNSIGNED REFERENCES manager(id)
); 
