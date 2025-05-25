import "react-native-url-polyfill/auto";

import { createClient } from '@supabase/supabase-js';

// Adaptador para expo-secure-store compatible con la interfaz de Supabase
import { ExpoSecureStoreAdapter } from './storage.adapter';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is not defined. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase anonymous key is not defined. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Útil para React Native, ya que no hay URL para detectar la sesión
  },
});

export type SupabaseClientType = typeof supabase;