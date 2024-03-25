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
      await connection.query(`SELECT BIN_TO_UUID(ElementsToMars.id) AS id, categorys.id AS Category,
    ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
    FROM ElementsToMars
    JOIN Categorys ON ElementsToMars.Category = Categorys.id`);

    return resultquery;
  }

  static async create({ data }) {
    try {
      const [resultOfQuery] = await connection.query(
        `SELECT * FROM ElementsToMars`
      );

      resultOfQuery.map((element) => {
        if (element.name === data.name) {
          throw new Error("Element already exists");
        }
      });
    } catch (error) {
      return false;
    }

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

    const [[rows]] = await connection.query(
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
      Category: data.Category ? data.Category.id : ElementToUpdate[0].Category,
    };

    ElementToUpdate[0] = {
      ...ElementToUpdate[0],
      id: id,
      ...data,
    };

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
    };

    return ElementToUpdate[0];
  }

  static async delete(id) {
    const { rows: elementsToDelete } = await connection.query(
      `
      SELECT *
      FROM elementstomars
      WHERE
      id = $1
      `,
      [id]
    );

    if (elementsToDelete.length === 0) return false;

    try {
      await connection.query(
        `
        DELETE
        FROM elementstomars
        WHERE
        id = $1
        `,
        [id]
      );
    } catch (error) {
      throw new Error("Error deleting Element");
    }

    return true;
  }
}
