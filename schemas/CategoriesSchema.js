import z from "zod";

const CategoriesSchema = z.object({
  id: z
    .number({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a number",
    })
    .positive()
    .min(1),
  Priority: z
    .number({
      required_error: "Category Priority is required",
      invalid_type_error: "Category Priority must be a number",
    })
    .min(1)
    .max(5),
  CategoryName: z.string({
    required_error: "Category Name is required",
    invalid_type_error: "Category Name must be a string",
  }),
});

export function ValidateCategory(category) {
  return CategoriesSchema.safeParse(category);
}

export function ValidatePartialCategory(category) {
  return CategoriesSchema.partial().safeParse(category);
}
