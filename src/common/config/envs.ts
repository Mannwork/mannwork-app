import { z } from "zod";

console.log('Environment check:', {
  clerk: !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  google: !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
  supabaseUrl: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnon: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  sentry: !!process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN,
  expo: !!process.env.EXPO_PUBLIC_EXPO_ACCESS_TOKEN,
});

const envSchema = z.object({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: z.string(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_EXPO_ACCESS_TOKEN: z.string(),
});

export const envs = envSchema.parse({
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
   EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
   EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
   EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
   EXPO_PUBLIC_EXPO_ACCESS_TOKEN: process.env.EXPO_PUBLIC_EXPO_ACCESS_TOKEN,
});
