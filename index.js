import e from "cors";
import mysql from "mysql2/promise";

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "elementsmars",
};

const connection = await mysql.createConnection(config);

const [ElementsModelSql] =
  await connection.query(`SELECT BIN_TO_UUID(ElementsToMars.id) AS ElementID, categorys.id , categorys.Priority ,categorys.CategoryName , 
  ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
  FROM ElementsToMars
  JOIN categorys ON ElementsToMars.Category = Categorys.id`);

const result = ElementsModelSql.map((element) => {
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

console.log(result);
