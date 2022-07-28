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
  inquirer
    .prompt({
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
  connection.query(query, function (err, res) {
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` + chalk.blue.bold(`All Departments:`)
    );
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );

    console.table(res);
    mainMenu();
  });
}

function viewEmployees() {
  let query =
    "SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY id ASC";
  connection.query(query, function (err, res) {
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` + chalk.blue.bold(`Employees:`)
    );
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );

    console.table(res);
    mainMenu();
  });
}

function viewRoles() {
  let query = `SELECT role.id, role.title, department.department_name AS department, role.salary
              FROM role
              INNER JOIN department ON role.department_id = department.id`;

  connection.query(query, function (err, res) {
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` + chalk.blue.bold(`Employee Roles:`)
    );
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );

    console.table(res);
    mainMenu();
  });
}

function viewManagers() {
  let managerArr = [];

  promisemysql
    .createConnection(db)
    .then((connect) => {
      return connect.query(
        "SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id"
      );
    })
    .then(function (managers) {
      for (i = 0; i < managers.length; i++) {
        managerArr.push(managers[i].manager);
      }

      return managers;
    })
    .then((managers) => {
      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Which manager would you like to search?",
          choices: managerArr,
        })
        .then((answer) => {
          let managerID;

          for (i = 0; i < managers.length; i++) {
            if (answer.manager == managers[i].manager) {
              managerID = managers[i].id;
            }
          }

          const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        INNER JOIN role ON e.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE e.manager_id = ${managerID};`;

          connection.query(query, (err, res) => {
            if (err) return err;

            // Results displayed in console.table
            console.log("\n");
            console.log(
              chalk.yellow.bold(
                `====================================================================================`
              )
            );
            console.log(
              `                              ` +
                chalk.blue.bold(`Employees by Manager:`)
            );
            console.log(
              chalk.yellow.bold(
                `====================================================================================`
              )
            );

            console.table(res);

            mainMenu();
          });
        });
    });
}

function viewDeptEmployees() {
  // Set global array to store department names
  let deptArr = [];

  promisemysql
    .createConnection(db)
    .then((connect) => {
      // Query just names of department
      return connect.query("SELECT department_name FROM department");
    })
    .then(function (value) {
      // Place all names within deptArr
      deptQuery = value;
      for (i = 0; i < value.length; i++) {
        deptArr.push(value[i].department_name);
      }
    })
    .then(() => {
      // Prompt user to select department from array of department
      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to search?",
          choices: deptArr,
        })
        .then((answer) => {
          // Query all employees depending on selected department
          const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.department_name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.department_name = '${answer.department}' ORDER BY id ASC`;
          connection.query(query, (err, res) => {
            if (err) return err;

            // Results displayed in console.table
            console.log("\n");

            console.log(
              chalk.yellow.bold(
                `====================================================================================`
              )
            );
            console.log(
              `                              ` +
                chalk.blue.bold(`Employees by Department:`)
            );
            console.log(
              chalk.yellow.bold(
                `====================================================================================`
              )
            );

            console.table(res);

            mainMenu();
          });
        });
    });
}

function addDept() {
  inquirer
    .prompt([
      {
        name: "deptID",
        type: "input",
        message: "What is the ID of the new department?",
      },
      {
        name: "deptName",
        type: "input",
        message: "What is the name of the new department?",
      },
    ])

    .then(function (response) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          id: response.deptID,
          department_name: response.deptName,
        },
        function (err) {
          if (err) throw err;
          console.log("Your department was created successfully!");
          mainMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "roleID",
        type: "input",
        message: "What is the ID of the new role?",
      },
      {
        name: "roleTtile",
        type: "input",
        message: "What is the title of the new role?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of the new role?",
      },
      {
        name: "roleDepartment",
        type: "input",
        message: "What is the department ID of the new role?",
      },
    ])
    .then(function (response) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          id: response.roleID,
          title: response.roleTtile,
          salary: response.roleSalary,
          department_id: response.roleDepartment,
        },
        function (err) {
          if (err) throw err;
          console.log("Your new role was created successfully!");
          mainMenu();
        }
      );
    });
}
