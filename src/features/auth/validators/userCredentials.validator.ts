import { z } from "zod";

export const userCredentialsScheme = z.object(
    {
        email: z.string({ message: "El email es obligatorio."}).email({ message: "El email no es válido." }),
        password: z.string({ message: "La contraseña es obligatoria."})
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres."})
        .max(32, { message: "La contraseña debe tener como máximo 32 caracteres."})
        .regex(/(?=.*[A-Z])/, { message: "La contraseña debe contener al menos una letra mayúscula." })
        .regex(/(?=.*\d)/, { message: "La contraseña debe contener al menos un número." })
    }
);