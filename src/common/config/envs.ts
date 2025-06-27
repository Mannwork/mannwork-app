import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: z.string(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

export const envs = envSchema.parse(process.env);
