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
  static async getAll() {
    const [resultquery] =
      await connection.query(`SELECT id , Priority , CategoryName
    FROM Categorys`);

    return resultquery;
  }

  static async create({ data }) {
    try {
      const [result] = await connection.query(
        `
        INSERT INTO categorys (Priority, CategoryName)
        VALUES (
          ?,?
        )
      `,
        [data.Priority, data.CategoryName]
      );

      const [[NewCategory]] = await connection.query(
        `
        SELECT id, Priority, CategoryName FROM categorys
        WHERE id = ?
        `,
        [result.insertId]
      );

      return NewCategory;
    } catch (error) {
      throw new Error("Error creating Category");
    }
  }

  static async update({ id, data }) {
    const [[CategoryToUpdate]] = await connection.query(
      `
      SELECT * FROM categorys
        WHERE id = ?
      `,
      [id]
    );

    const Category = {
      ...CategoryToUpdate,
      ...data,
    };

    const result = await connection.query(
      `
      UPDATE categorys
      SET
      Priority = ?,
      CategoryName = ?
      WHERE
      id = ?
      `,
      [Category.Priority, Category.CategoryName, id]
    );

    if (result.length === 0) return false;

    return Category;
  }

  static async delete(id) {
    const result = await connection.query(
      `
      DELETE FROM categorys WHERE id = ?
      `,
      [id]
    );

    return true;
  }
}
