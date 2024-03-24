import express, { json } from "express";
import mysql from "mysql2/promise";
process.loadEnvFile("./.env.xd");

const configPool = {
  host: "mysqlversion",
  user: "root",
  port: process.env.MYSQLDPORT,
  password: "",
  database: process.env.MYSQLDB,
};

const connection = mysql.createPool(configPool);

const app = express();

app.use(json());
app.disable("x-powered-by");

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.get("/xd", async (req, res) => {
  const [result] = await connection.query("SELECT NOW()");

  //const [result2] = await connection.query("SELECT * FROM hola");
  res.send(result);
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
