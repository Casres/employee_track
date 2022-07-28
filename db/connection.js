const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  // console.log(`🔌 🔋 Data base ${process.env.DB_NAME} connected`)
);

module.exports = db;
