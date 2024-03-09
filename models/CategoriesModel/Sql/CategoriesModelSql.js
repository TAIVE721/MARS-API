import mysql from "mysql2/promise";

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const connection = await mysql.createConnection(config);

export class CategoriesModelSql {
  static async getAll() {}

  static async create(data) {}

  static async update({ id, data }) {}

  static async delete(id) {}
}
