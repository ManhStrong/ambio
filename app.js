const express = require("express");
const cors = require("cors");
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
    operatorsAliases: false,
  }
);

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectionDatabase();

const initRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running", process.env.APP_PORT);
});
