const inquirer = require("inquirer");
// const mysql = require("mysql2");
const db = require("./db/connection");
const promisemysql = require("promise-mysql");
// const consoleTable = require("console.table");
const figlet = require("figlet");
const chalk = require("chalk");

// the banner
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
  db.query(query, function (err, res) {
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
  db.query(query, function (err, res) {
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

  db.query(query, function (err, res) {
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
    .then((db) => {
      return db.query(
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

          db.query(query, (err, res) => {
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
    .then((db) => {
      // Query just names of department
      return db.query("SELECT department_name FROM department");
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
          db.query(query, (err, res) => {
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
      db.query(
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
      db.query(
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

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "employeeID",
        type: "input",
        message: "What is the ID of the new employee?",
      },
      {
        name: "empFirstName",
        type: "input",
        message: "What is the first name of the new employee?",
      },
      {
        name: "empLastName",
        type: "input",
        message: "What is the last name of the new employee?",
      },
      {
        name: "empRole",
        type: "input",
        message: "What is the role ID for the new employee?",
      },
      {
        name: "empManager",
        type: "input",
        message: "What is id of the new employee's manager?",
      },
    ])

    .then(function (response) {
      db.query(
        "INSERT INTO employee SET ?",
        {
          id: response.employeeID,
          first_name: response.empFirstName,
          last_name: response.empLastName,
          role_id: response.empRole,
          manager_id: response.empManager,
        },
        function (err) {
          if (err) throw err;
          console.log("Your new employee was created successfully!");
          mainMenu();
        }
      );
    });
}

function updateRole() {
  // create employee and role array
  let employeeArr = [];
  let roleArr = [];

  promisemysql
    .createConnection(db)
    .then((db) => {
      return Promise.all([
        // query all roles and employee
        db.query("SELECT id, title FROM role ORDER BY title ASC"),
        db.query(
          "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([roles, employees]) => {
      // place all roles in array
      for (i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].title);
      }

      // place all empoyees in array
      for (i = 0; i < employees.length; i++) {
        employeeArr.push(employees[i].Employee);
      }

      return Promise.all([roles, employees]);
    })
    .then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            // prompt user to select employee
            name: "employee",
            type: "list",
            message: "Who would you like to edit?",
            choices: employeeArr,
          },
          {
            // Select role to update employee
            name: "role",
            type: "list",
            message: "What is their new role?",
            choices: roleArr,
          },
        ])
        .then((answer) => {
          let roleID;
          let employeeID;

          /// get ID of role selected
          for (i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
              roleID = roles[i].id;
            }
          }

          // get ID of employee selected
          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          // update employee with new role
          db.query(
            `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) return err;

              // confirm update employee
              console.log(
                `\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `
              );

              mainMenu();
            }
          );
        });
    });
}

function updateManager() {
  // set global array for employees
  let employeeArr = [];

  db.query(
    "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC",
    function (err, employees) {
      // place employees in array
      for (i = 0; i < employees.length; i++) {
        employeeArr.push(employees[i].Employee);
      }

      inquirer
        .prompt([
          {
            // prompt user to selected employee
            name: "employee",
            type: "list",
            message: "Who would you like to edit?",
            choices: employeeArr,
          },
          {
            // prompt user to select new manager
            name: "manager",
            type: "list",
            message: "Who is their new Manager?",
            choices: employeeArr,
          },
        ])
        .then((answer) => {
          let employeeID;
          let managerID;

          // get ID of selected manager
          for (i = 0; i < employees.length; i++) {
            if (answer.manager == employees[i].Employee) {
              managerID = employees[i].id;
            }
          }

          // get ID of selected employee
          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          // update employee with manager ID
          db.query(
            `UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) return err;

              // confirm update employee
              console.log(
                `\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`
              );

              mainMenu();
            }
          );
        });
    }
  );
}

function deleteEmployee() {
  // Create global employee array
  let employeeArr = [];

  db.query(
    "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC",
    function (err, res) {
      // Place all employees in array
      for (i = 0; i < res.length; i++) {
        employeeArr.push(res[i].employee);
      }

      inquirer
        .prompt([
          {
            // prompt user of all employees
            name: "employee",
            type: "list",
            message: "Who would you like to delete?",
            choices: employeeArr,
          },
          {
            // confirm delete of employee
            name: "yesNo",
            type: "list",
            message: "Confirm deletion",
            choices: ["NO", "YES"],
          },
        ])
        .then((answer) => {
          if (answer.yesNo == "YES") {
            let employeeID;

            // if confirmed, get ID of employee selected
            for (i = 0; i < res.length; i++) {
              if (answer.employee == res[i].employee) {
                employeeID = res[i].id;
              }
            }

            // deleted selected employee
            db.query(
              `DELETE FROM employee WHERE id=${employeeID};`,
              (err, res) => {
                if (err) return err;

                // confirm deleted employee
                console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);

                mainMenu();
              }
            );
          } else {
            // if not confirmed, go back to main menu
            console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

            mainMenu();
          }
        });
    }
  );
}

function deleteRole() {
  // Create role array
  let roleArr = [];

  // query all roles
  db.query("SELECT role.id, title FROM role", function (err, res) {
    // add all roles to array
    for (i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

    inquirer
      .prompt([
        {
          // confirm to continue to select role to delete
          name: "continueDelete",
          type: "list",
          message:
            "*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?",
          choices: ["NO", "YES"],
        },
      ])
      .then((answer) => {
        // if not, go to main menu
        if (answer.continueDelete === "NO") {
          mainMenu();
        }
      })
      .then(() => {
        inquirer
          .prompt([
            {
              name: "role",
              type: "list",
              message: "Which role would you like to delete?",
              choices: roleArr,
            },
            {
              // confirm to delete role by typing role exactly
              name: "confirmDelete",
              type: "Input",
              message:
                "Type the role title EXACTLY to confirm deletion of the role",
            },
          ])
          .then((answer) => {
            if (answer.confirmDelete === answer.role) {
              // get role id of of selected role
              let roleID;
              for (i = 0; i < res.length; i++) {
                if (answer.role == res[i].title) {
                  roleID = res[i].id;
                }
              }

              // delete role
              db.query(
                `DELETE FROM role WHERE id=${roleID};`,
                (err, res) => {
                  if (err) return err;

                  // confirm role has been added
                  console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                  mainMenu();
                }
              );
            } else {
              // if not confirmed, do not delete
              console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

              mainMenu();
            }
          });
      });
  });
}

function deleteDepartment() {
  // department array
  let deptArr = [];

  db.query(
    "SELECT id, department_name FROM department",
    function (err, depts) {
      // add all department to array
      for (i = 0; i < depts.length; i++) {
        deptArr.push(depts[i].department_name);
      }

      inquirer
        .prompt([
          {
            // confirm to continue to select department to delete
            name: "continueDelete",
            type: "list",
            message:
              "*** WARNING *** Deleting a department will delete all role and employees associated with the department. Do you want to continue?",
            choices: ["NO", "YES"],
          },
        ])
        .then((answer) => {
          // if not, go back to main menu
          if (answer.continueDelete === "NO") {
            mainMenu();
          }
        })
        .then(() => {
          inquirer
            .prompt([
              {
                // prompt user to select department
                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArr,
              },
              {
                // confirm with user to delete
                name: "confirmDelete",
                type: "Input",
                message:
                  "Type the department name EXACTLY to confirm deletion of the department: ",
              },
            ])
            .then((answer) => {
              if (answer.confirmDelete === answer.dept) {
                // if confirmed, get department id
                let deptID;
                for (i = 0; i < depts.length; i++) {
                  if (answer.dept == depts[i].department_name) {
                    deptID = depts[i].id;
                  }
                }

                // delete department
                db.query(
                  `DELETE FROM department WHERE id=${deptID};`,
                  (err, res) => {
                    if (err) return err;

                    // confirm department has been deleted
                    console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                    mainMenu();
                  }
                );
              } else {
                // do not delete department if not confirmed and go back to main menu
                console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                mainMenu();
              }
            });
        });
    }
  );
}

function viewBudget() {
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(
    `                              ` + chalk.blue.bold(`Budget By Department:`)
  );
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );

  const sql = `SELECT department_id AS id, 
    department.department_name AS department,
              SUM(salary) AS budget
              FROM  role 
              INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );

    mainMenu();
  });
}
