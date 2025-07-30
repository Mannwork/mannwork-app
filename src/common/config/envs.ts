import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: z.string(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_MP_PUBLIC_KEY: z.string(),
  EXPO_PUBLIC_MP_CLIENT_ID: z.string(),
  EXPO_PUBLIC_MP_CLIENT_SECRET: z.string(),
  EXPO_PUBLIC_MP_ACCESS_TOKEN: z.string(),
  EXPO_PUBLIC_REDIRECT_URL: z.string(),
});

export const envs = envSchema.parse(process.env);
