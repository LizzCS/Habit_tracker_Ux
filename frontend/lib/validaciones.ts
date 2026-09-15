import * as z from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Correo electrónico inválido")
      .nonempty("El correo electrónico es obligatorio"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número",
      ),
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .regex(
        /^[a-zA-ZÀ-ÿ\s]+$/,
        "El nombre solo puede contener letras y espacios",
      )
      .nonempty("El nombre es obligatorio"),
    confirmpassword: z
      .string()
      .nonempty("La confirmación de contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Las contraseñas no coinciden",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .nonempty("El correo electrónico es obligatorio"),
  password: z.string().nonempty("La contraseña es obligatoria"),
});

export const habitSchema = z.object({
  name: z.string().min(1, "El nombre del hábito es obligatorio"),
  repeticiones: z.number().min(1, "El número de repeticiones es obligatorio"),
});
