import {
  ValidateCategory,
  ValidatePartialCategory,
} from "../schemas/CategoriesSchema.js";

export class CategoriesController {
  constructor({ CategoriesModel }) {
    this.CategoriesModel = CategoriesModel;
  }

  getAll = async (req, res) => {
    const categories = await this.CategoriesModel.getAll();
    res(categories);
  };

  create = async (req, res) => {
    const { data } = ValidateCategory(req.body);
    const newCategory = await this.CategoriesModel.create(data);
    res(newCategory);
  };

  update = async (req, res) => {
    const { data } = ValidatePartialCategory(req.body);
    const { id } = req.params;
    const CategoryPatch = await this.CategoriesModel.update({
      id: id,
      data: data,
    });
    res(CategoryPatch);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const CategoryisDelete = await this.CategoriesModel.delete(id);
    res(CategoryisDelete);
  };
}
