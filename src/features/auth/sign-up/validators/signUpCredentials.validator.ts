import { z } from "zod";

export const signUpCredentialsScheme = z.object(
    {
        email: z.string({ message: "El email es obligatorio."}).email({ message: "El email no es válido." }),
        password: z.string({ message: "La contraseña es obligatoria."})
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres."})
        .max(32, { message: "La contraseña debe tener como máximo 32 caracteres."})
        .regex(/(?=.*[A-Z])/, { message: "La contraseña debe contener al menos una letra mayúscula." })
        .regex(/(?=.*\d)/, { message: "La contraseña debe contener al menos un número." }),
        "repeat-password": z.string({ message: "Confirmar contraseña es obligatorio."})
    }
).refine((data) => data.password === data["repeat-password"], {
    message: "Las contraseñas no coinciden.",
    path: ["repeat-password"],
});

export type SignUpFields = z.infer<typeof signUpCredentialsScheme>;