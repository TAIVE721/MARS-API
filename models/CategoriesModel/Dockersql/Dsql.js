import mysql from "mysql2/promise";

const poolconfig = {
  host: "mysqlversion",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const pool = mysql.createPool(poolconfig);

export class CategoriesModelDSql {
  static async getAll() {
    console.log("hola");
    const [resultquery] = await pool.query(`SELECT id , Priority , CategoryName
    FROM Categorys`);

    return resultquery;
  }

  static async create({ data }) {
    try {
      const [resultOfQuery] = await pool.query(`SELECT * FROM Categorys`);

      resultOfQuery.map((element) => {
        if (element.CategoryName === data.CategoryName) {
          throw new Error("Category already exists");
        }
      });
    } catch (error) {
      return false;
    }

    try {
      const [result] = await pool.query(
        `
        INSERT INTO Categorys (Priority, CategoryName)
        VALUES (
          ?,?
        )
      `,
        [data.Priority, data.CategoryName]
      );

      const [[NewCategory]] = await pool.query(
        `
        SELECT id, Priority, CategoryName FROM Categorys
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
    const [[CategoryToUpdate]] = await pool.query(
      `
        SELECT * FROM Categorys
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

    const result = await pool.query(
      `
      UPDATE Categorys
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
    const result = await pool.query(
      `
      DELETE FROM Categorys WHERE id = ?
      `,
      [id]
    );

    return true;
  }
}
