import {
  validateElement,
  validatePartialElement,
} from "../schemas/ElementSchema.js";

export class ElementsController {
  constructor({ ElementsModel }) {
    this.ElementsModel = ElementsModel;
  }

  getAll = async (req, res) => {
    console.log("ola");
    const elements = await this.ElementsModel.getAll();
    res.json(elements);
  };

  create = async (req, res) => {
    const { data } = validateElement(req.body);
    const newElement = await this.ElementsModel.create(data);
    res(newElement);
  };

  update = async (req, res) => {
    const { data } = validatePartialElement(req.body);
    const { id } = req.params;
    const ElementPatch = await this.ElementsModel.update({
      id: id,
      data: data,
    });
    res(ElementPatch);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const ElementisDelete = await this.ElementsModel.delete(id);
    res(ElementisDelete);
  };
}
