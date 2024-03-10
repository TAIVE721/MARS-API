import z from "zod";

const ElementSchema = z.object({
  Category: z.object({
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
  }),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  weight: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive()
    .min(1),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .optional(),
});

export function validateElement(element) {
  return ElementSchema.safeParse(element);
}

const result = validateElement({
  Category: { id: 1, Priority: 1, CategoryName: "Propulsion" },
  name: "Element 1",
  weight: 200,
  description: "Element 1 description",
});

console.log(result);
