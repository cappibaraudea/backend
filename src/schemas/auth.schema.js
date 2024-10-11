import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser texto",
    }),
    email: z
      .string({
        required_error: "El correo es requerido",
        invalid_type_error: "El correo debe ser texto",
      })
      .email({ invalid_type_error: "Correo inválido" }),
    password: z
      .string({
        invalid_type_error: "La contraseña tiene que ser texto",
        required_error: "La contraseña es requerida",
      })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  })
  .partial();

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a sting",
    })
    .email({ invalid_type_error: "Invalid email" }),
  password: z
    .string({
      invalid_type_error: "Password must be a string",
      required_error: "Password is required",
    })
    .min(6, { message: "Password must be 6 caracters or long" }),
});
