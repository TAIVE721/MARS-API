import { ElementsModelPostgreSql } from "./models/ElementsModel/Psql/Psql.js";
import { CategorysModelPostgreSql } from "./models/CategoriesModel/Psql/Psql.js";
import { CreateApp } from "./app.js";

CreateApp({
  CategoriesModel: CategorysModelPostgreSql,
  ElementsModel: ElementsModelPostgreSql,
});
