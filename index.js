

// const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection')
const consoleTable = require('console.table');
const figlet = require('figlet');
const chalk = require('chalk');

db.connect(err => {
    if (err) {
        return console.error('error: ' + err.message);
    }
    
    console.log(chalk.yellow.bold(`----------------------------------------------------------------------------------------------`));
    console.log(``);
    console.log(chalk.cyan.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                                                                    ` + chalk.white.bold('Created By: Christian C'));
    console.log(``);
    console.log(chalk.yellow.bold(`----------------------------------------------------------------------------------------------`));    
    // mainMenu();
});