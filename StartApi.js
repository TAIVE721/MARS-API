import { CreateApp } from "./app.js";
import { CategoriesModelSql } from "./models/CategoriesModel/Sql/CategoriesModelSql.js";
import { ElementsModelSql } from "./models/ElementsModel/Sql/ElementsModelSql.js";

CreateApp({
  CategoriesModel: CategoriesModelSql,
  ElementsModel: ElementsModelSql,
});
