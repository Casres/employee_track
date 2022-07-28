const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");
const consoleTable = require("console.table");
const figlet = require("figlet");
const chalk = require("chalk");

db.connect((err) => {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log(
    chalk.yellow.bold(
      `----------------------------------------------------------------------------------------------`
    )
  );
  console.log(``);
  console.log(chalk.cyan.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(
    `                                                                    ` +
      chalk.white.bold("Created By: Christian C")
  );
  console.log(``);
  console.log(
    chalk.yellow.bold(
      `----------------------------------------------------------------------------------------------`
    )
  );
  mainMenu();
});

function mainMenu() {
  inquirer.prompt({
      name: "userAction",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Departments",
        "View Employees",
        "View Roles",
        "View Managers",
        "View Employees by Department",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Update Manager",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "View Department Budget",
        "Exit",
      ],
    })
    .then((response) => {
      switch (response.userAction) {
        case "View Departments":
          viewDepartments();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Managers":
          viewManagers();
          break;
        case "View Employees by Department":
          viewDeptEmployees();
          break;
        case "Add a Department":
          addDept();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Manager":
          updateManager();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "View Department Budget":
          viewBudget();
          break;
        case "Exit":
          process.exit();
        // break;
      }
    });
}

function viewDepartments() {
    let query = "SELECT * FROM  department";
    connection.query(query, function(err, res) {
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue.bold(`All Departments:`));
        console.log(chalk.yellow.bold(`====================================================================================`));

        console.table(res);
        mainMenu();
    });
};

function viewEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY id ASC";
    connection.query(query, function(err, res) {
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue.bold(`Employees:`));
        console.log(chalk.yellow.bold(`====================================================================================`));

        console.table(res);
        mainMenu();
    });
};