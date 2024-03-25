import { sql } from "@vercel/postgres";

process.loadEnvFile("./.env.postgressql");

export class ElementsModelPostgreSql {
  static async getAll() {
    const { rows: resultquery } = await sql`
    SELECT ElementsToMars.id::TEXT AS id, categorys.id as Category, 
    ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
    FROM ElementsToMars
    JOIN categorys ON ElementsToMars.Category = Categorys.id`;

    return resultquery;
  }

  static async create({ data }) {
    console.log(data);
    try {
      const resultOfQuery = await sql`
        SELECT * FROM ElementsToMars
        `;

      resultOfQuery.rows.map((element) => {
        if (element.name === data.name) {
          throw new Error("Element already exists");
        }
      });
    } catch (error) {
      return false;
    }

    try {
      const result = await sql`
        INSERT INTO ElementsToMars (id, Category, name, weight, description) VALUES 
        (uuid_generate_v4(), (SELECT id FROM categorys WHERE id = ${data.category.id}), ${data.name}, ${data.weight}, ${data.description})
        RETURNING id
        `;
      console.log(result, "result");
      const elementId = result.rows[0].id;

      const rows = await sql`
        SELECT id, Category, name, weight, description
        FROM ElementsToMars WHERE id = ${elementId}
        `;
      console.log(rows, "rows");
      return rows.rows[0];
    } catch (error) {
      throw new Error("Error creating Element");
    }
  }

  static async update({ id, data }) {
    const elementsToUpdate = await sql`
    SELECT *
    FROM elementstomars
    WHERE
    id = ${id}
    `;

    if (elementsToUpdate.rows.length === 0) return false;
    console.log(elementsToUpdate.rows[0], "elementsToUpdate");
    data = {
      ...data,
      category: data.category
        ? data.category.id
        : elementsToUpdate.rows[0].category,
    };

    elementsToUpdate.rows[0] = {
      ...elementsToUpdate.rows[0],
      id: id,
      ...data,
    };
    console.log(elementsToUpdate.rows[0], "elementsToUpdate");
    try {
      const updatedRows = await sql`
        UPDATE elementstomars
        SET
        Category = (SELECT id FROM categorys WHERE id = ${elementsToUpdate.rows[0].category}),
        name = ${elementsToUpdate.rows[0].name},
        weight = ${elementsToUpdate.rows[0].weight},
        description = ${elementsToUpdate.rows[0].description}
        WHERE id = ${id}
        RETURNING *
        `;

      return updatedRows.rows[0];
    } catch (error) {
      throw new Error("Error updating Element");
    }
  }

  static async delete(id) {
    const elementsToDelete = await sql`
    SELECT *
    FROM elementstomars
    WHERE
    id = ${id}
    `;

    if (elementsToDelete.rows.length === 0) return false;

    try {
      await sql`
        DELETE
        FROM elementstomars
        WHERE
        id = ${id}
        `;
    } catch (error) {
      throw new Error("Error deleting Element");
    }

    return true;
  }
}
