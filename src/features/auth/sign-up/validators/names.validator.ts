import { z } from "zod";

export const namesScheme = z.object(
    {
        name: z.string({ message: "El nombre es obligatorio."}).min(2, { message: "El nombre debe tener al menos 2 caracteres."}),
        last_name: z.string({ message: "El apellido es obligatorio."}).min(2, { message: "El apellido debe tener al menos 2 caracteres."})
    }
);

export type NamesFields = z.infer<typeof namesScheme>;