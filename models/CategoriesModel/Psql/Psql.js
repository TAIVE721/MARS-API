import { sql } from "@vercel/postgres";

process.loadEnvFile("./.env.postgressql");

export class CategorysModelPostgreSql {
  static async getAll() {
    const resultquery = await sql`
      SELECT id , Priority , CategoryName
      FROM Categorys
    `;

    return resultquery.rows;
  }

  static async create({ data }) {
    const resultOfQuery = await sql`SELECT * FROM categorys`;

    resultOfQuery.map((element) => {
      if (element.CategoryName === data.CategoryName) {
        throw new Error("Category already exists");
      }
    });

    const result = await sql`
      INSERT INTO categorys (Priority, CategoryName)
      VALUES (
        ${data.Priority},
        ${data.CategoryName}
      )
      RETURNING id
    `;

    const NewCategory = await sql`
      SELECT id, Priority, CategoryName FROM categorys
      WHERE id = ${result[0].id}
    `;

    return NewCategory[0];
  }

  static async update({ id, data }) {
    const CategoryToUpdate = await sql`
      SELECT * FROM categorys
      WHERE id = ${id}
    `;

    if (CategoryToUpdate.length === 0) return undefined;

    const Category = {
      ...CategoryToUpdate[0],
      ...data,
    };

    await sql`
      UPDATE categorys
      SET
      Priority = ${Category.Priority},
      CategoryName = ${Category.CategoryName}
      WHERE
      id = ${id}
    `;

    return Category;
  }

  static async delete(id) {
    await sql`
      DELETE FROM categorys WHERE id = ${id}
    `;

    return true;
  }
}
