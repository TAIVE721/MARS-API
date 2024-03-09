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

  //falta checar mas el data y todo eso para que funcione

  static async create(data) {
    const result = await connection.query(
      `
    INSERT INTO elementstomars (Category, name, weight, description) VALUES 
  ((SELECT id FROM categorys WHERE id = ? ), "Hidrogen" , 1000, 'To power the ship'),
    `,
      []
    );
  }

  static async update({ id, data }) {}

  static async delete(id) {}
}
