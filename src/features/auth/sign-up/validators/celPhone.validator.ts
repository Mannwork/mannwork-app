import { z } from 'zod';

// This regex checks for a 10-digit number, which is the standard for Argentinian mobile numbers without the country code.
const argentinianPhoneNumberRegex = /^\d{10}$/;

export const celPhoneSchema = z.object({
  phoneNumber: z
    .string({
        required_error: 'El número de celular es requerido.'
    })
    .trim()
    .refine(
    (phone) => {
      const cleaned = phone.replace(/[\s-()]/g, '');
      return argentinianPhoneNumberRegex.test(cleaned);
    },
    {
      message: 'El número de celular debe ser un número válido de 10 dígitos, incluido su código de área.',
    }
  ),
});

export type CelPhoneSchema = z.infer<typeof celPhoneSchema>;
