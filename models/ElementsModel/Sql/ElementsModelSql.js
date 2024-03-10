import mysql from "mysql2/promise";

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const connection = await mysql.createConnection(config);

export class ElementsModelSql {
  static async getAll() {
    const [resultquery] =
      await connection.query(`SELECT BIN_TO_UUID(ElementsToMars.id) AS ElementID, categorys.id , categorys.Priority ,categorys.CategoryName , 
    ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
    FROM ElementsToMars
    JOIN categorys ON ElementsToMars.Category = Categorys.id`);

    const result = resultquery.map((element) => {
      const TrueElement = {
        id: element.ElementID,
        category: {
          id: element.id,
          priority: element.Priority,
          categoryName: element.CategoryName,
        },
        name: element.name,
        weight: element.weight,
        description: element.description,
      };

      return TrueElement;
    });

    return result;
  }

  static async create({ data }) {
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      const result = await connection.query(
        `
      INSERT INTO ElementsToMars (id, Category, name, weight, description) VALUES 
      ( UUID_TO_BIN(?),(SELECT id FROM categorys WHERE id = ? ), ? , ?, ?)
      `,
        [uuid, data.Category.id, data.name, data.weight, data.description]
      );
    } catch (error) {
      throw new Error("Error creating Element");
    }

    const [rows] = await connection.query(
      `
      SELECT BIN_TO_UUID(id) as id , Category , name , weight , description
       FROM ElementsToMars WHERE id = UUID_TO_BIN(?)
      `,
      [uuid]
    );

    return rows[0];
  }

  static async update({ id, data }) {
    const [ElementToUpdate] = await connection.query(
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

    const [[CategoryToReturn]] = await connection.query(
      `
      SELECT * FROM categorys
        WHERE id = ?
      `,
      [ElementToUpdate[0].Category]
    );

    try {
      await connection.query(
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
      Category: {
        ...CategoryToReturn,
      },
    };

    return ElementToUpdate[0];
  }

  static async delete(id) {
    const [ElementToDelete] = await connection.query(
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
      await connection.query(
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
