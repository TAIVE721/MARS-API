import mysql from "mysql2/promise";

const poolconfig = {
  host: "localhost",
  user: "root",
  port: 3308,
  password: "1234567",
};

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const connection = await mysql.createConnection(config);
const pool = mysql.createPool(poolconfig);

export class CategoriesModelSql {
  static async getAll() {
    const [resultquery] =
      await connection.query(`SELECT id , Priority , CategoryName
    FROM Categorys`);

    return resultquery;
  }

  static async create({ data }) {
    try {
      const [resultOfQuery] = await connection.query(`SELECT * FROM categorys`);

      resultOfQuery.map((element) => {
        if (element.CategoryName === data.CategoryName) {
          throw new Error("Element already exists");
        }
      });
    } catch (error) {
      return false;
    }

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
    if (CategoryToUpdate === undefined) return undefined;

    const Category = {
      ...CategoryToUpdate,
      ...data,
    };

    console.log(Category);

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
