import { Router } from "express";
import { ElementsController } from "../controllers/ElementsController.js";

export const createElementsRouter = ({ ElementsModel }) => {
  const elementsRouter = Router();

  const ElementsControllerCreated = new ElementsController({ ElementsModel });

  elementsRouter.get("/", ElementsControllerCreated.getAll);
  elementsRouter.post("/", ElementsControllerCreated.create);
  elementsRouter.patch("/:id", ElementsControllerCreated.update);
  elementsRouter.delete("/:id", ElementsControllerCreated.delete);

  return elementsRouter;
};
