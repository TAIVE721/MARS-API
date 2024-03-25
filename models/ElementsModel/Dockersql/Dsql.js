import mysql from "mysql2/promise";

const poolconfig = {
  host: "mysqlversion",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const pool = mysql.createPool(poolconfig);

export class ElementsModelDSql {
  static async getAll() {
    console.log("hola desde model");
    const [resultquery] =
      await pool.query(`SELECT BIN_TO_UUID(ElementsToMars.id) AS ElementID, Categorys.id , Categorys.Priority ,Categorys.CategoryName , 
      ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
      FROM ElementsToMars
      JOIN Categorys ON ElementsToMars.Category = Categorys.id`);

    return resultquery;
  }

  static async create({ data }) {
    try {
      const [resultOfQuery] = await pool.query(`SELECT * FROM ElementsToMars`);

      resultOfQuery.map((element) => {
        if (element.name === data.name) {
          throw new Error("Element already exists");
        }
      });
    } catch (error) {
      return false;
    }

    const [uuidResult] = await pool.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      const result = await pool.query(
        `
        INSERT INTO ElementsToMars (id, Category, name, weight, description) VALUES 
        ( UUID_TO_BIN(?),(SELECT id FROM categorys WHERE id = ? ), ? , ?, ?)
        `,
        [uuid, data.Category.id, data.name, data.weight, data.description]
      );
    } catch (error) {
      throw new Error("Error creating Element");
    }

    const [[rows]] = await pool.query(
      `
        SELECT BIN_TO_UUID(id) as id , Category , name , weight , description
         FROM ElementsToMars WHERE id = UUID_TO_BIN(?)
        `,
      [uuid]
    );

    const NewElement = {
      ...rows,
    };

    return NewElement;
  }

  static async update({ id, data }) {
    const [ElementToUpdate] = await pool.query(
      `
      SELECT *
      FROM elementstomars
      WHERE
      id = UUID_TO_BIN(?)
      `,
      [id]
    );

    if (ElementToUpdate.length === 0) return false;

    data = {
      ...data,
      Category: data.Category.id,
    };

    ElementToUpdate[0] = {
      ...ElementToUpdate[0],
      id: id,
      ...data,
    };

    try {
      await pool.query(
        `
        UPDATE elementstomars
        SET
        Category = (SELECT id FROM categorys WHERE id = ?),
        name = ?,
        weight = ?,
        description = ?
        WHERE
        id = UUID_TO_BIN(?)
        `,
        [
          ElementToUpdate[0].Category,
          ElementToUpdate[0].name,
          ElementToUpdate[0].weight,
          ElementToUpdate[0].description,
          id,
        ]
      );
    } catch (error) {
      throw new Error("Error updating Element");
    }

    ElementToUpdate[0] = {
      ...ElementToUpdate[0],
    };

    return ElementToUpdate[0];
  }

  static async delete(id) {
    const [ElementToDelete] = await pool.query(
      `
      SELECT *
      FROM elementstomars
      WHERE
      id = UUID_TO_BIN(?)
      `,
      [id]
    );

    if (ElementToDelete.length === 0) return false;

    try {
      await pool.query(
        `
        DELETE
        FROM elementstomars
        WHERE
        id = UUID_TO_BIN(?)
        `,
        [id]
      );
    } catch (error) {
      throw new Error("Error deleting Element");
    }

    return true;
  }
}
