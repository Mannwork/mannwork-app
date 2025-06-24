import { z } from "zod";

export const confirmationCodeSchema = z.object({
    code: z.string({ message: "El código de verificación es obligatorio." }).min(6, { message: "El código de verificación debe tener 6 dígitos." }),
});

export type ConfirmationCodeSchema = z.infer<typeof confirmationCodeSchema>;