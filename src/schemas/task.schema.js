import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  date: z
    .string({
      required_error: "Date is required",
      invalid_type_error: "Date must be a string in YYYY-MM-DD format",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid date",
    }),
  hour: z
    .string({
      invalid_type_error: "Hour must be a string",
    })
    .optional(),
  url: z.string({
    required_error: "Url is required",
    invalid_type_error: "Url must be a string",
  }),
  attendees: z
    .array(
      z.object({
        nombre: z.string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        }),
        id: z.string({
          required_error: "ID is required",
          invalid_type_error: "ID must be a string",
        }),
      })
    )
    .optional(),
});
