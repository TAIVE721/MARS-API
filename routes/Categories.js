import { Router } from "express";
import { CategoriesController } from "../controllers/CategoriesController.js";

export const createCategoriesRouter = ({ CategoriesModel }) => {
  const categoriesRouter = Router();

  const CategoriesControllerCreated = new CategoriesController({
    CategoriesModel,
  });

  categoriesRouter.get("/", CategoriesControllerCreated.getAll);
  categoriesRouter.post("/", CategoriesControllerCreated.create);
  categoriesRouter.patch("/:id", CategoriesControllerCreated.update);
  categoriesRouter.delete("/:id", CategoriesControllerCreated.delete);

  return categoriesRouter;
};
