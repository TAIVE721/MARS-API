import {
  validateElement,
  validatePartialElement,
} from "../schemas/ElementSchema.js";

export class ElementsController {
  constructor({ ElementsModel }) {
    this.ElementsModel = ElementsModel;
  }

  getAll = async (req, res) => {
    const elements = await this.ElementsModel.getAll();
    res.json(elements);
  };

  create = async (req, res) => {
    const result = validateElement(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newElement = await this.ElementsModel.create(result);

    res.status(201).json(newElement);
  };

  update = async (req, res) => {
    const result = validatePartialElement(req.body);
    const { data } = result;
    const { id } = req.params;
    const ElementPatch = await this.ElementsModel.update({
      id: id,
      data: data,
    });
    res.json(ElementPatch);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const ElementisDelete = await this.ElementsModel.delete(id);
    res.json(ElementisDelete);
  };
}
