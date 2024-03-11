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
    res.json(categories);
  };

  create = async (req, res) => {
    const result = ValidateCategory(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newCategory = await this.CategoriesModel.create(result);

    if (newCategory === false) {
      return res.status(400).json({ error: "Category already exists" });
    }
    res.json(newCategory);
  };

  update = async (req, res) => {
    const result = ValidatePartialCategory(req.body);
    const { data } = result;
    const { id } = req.params;
    const CategoryPatch = await this.CategoriesModel.update({
      id: id,
      data: data,
    });

    if (CategoryPatch === undefined) {
      return res.status(400).json({ error: "Error Element not exist " });
    }

    res.json(CategoryPatch);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const CategoryisDelete = await this.CategoriesModel.delete(id);
    res.json(CategoryisDelete);
  };
}
