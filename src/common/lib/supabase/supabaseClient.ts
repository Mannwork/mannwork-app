import "react-native-url-polyfill/auto";

import { createClient } from '@supabase/supabase-js';

// Adaptador para expo-secure-store compatible con la interfaz de Supabase
import { getClerkAccessToken } from '../clerk/clerkTokenManager';
import { ExpoSecureStoreAdapter } from './storage.adapter';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is not defined. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase anonymous key is not defined. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
}

// Cliente de Supabase configurado para trabajar con Clerk
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  accessToken: getClerkAccessToken,
});

export type SupabaseClientType = typeof supabase;