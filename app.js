import express, { json } from "express";
import { CorsMiddleware } from "./middlewares/CorsMidleware.js";
import { createElementsRouter } from "./routes/Elements.js";
import { createCategoriesRouter } from "./routes/Categories.js";

export const CreateApp = ({ CategoriesModel, ElementsModel }) => {
  const app = express();
  app.use(json());
  app.use(CorsMiddleware());
  app.disable("x-powered-by");

  app.use("/elements", createElementsRouter({ ElementsModel }));
  app.use("/categories", createCategoriesRouter({ CategoriesModel }));

  const PORT = process.env.PORT || 1234;

  app.listen(PORT, () => {
    console.log(`LIstening on port http://localhost:${PORT}`);
  });
};
