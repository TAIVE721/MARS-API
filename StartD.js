import { ElementsModelDSql } from "./models/ElementsModel/Dockersql/Dsql.js";
import { CategoriesModelDSql } from "./models/CategoriesModel/Dockersql/Dsql.js";
import { CreateApp } from "./app.js";

CreateApp({
  CategoriesModel: CategoriesModelDSql,
  ElementsModel: ElementsModelDSql,
});
