import "react-native-url-polyfill/auto";

import { createClient } from '@supabase/supabase-js';

import envs from '@/common/config/envs';

import { getClerkAccessToken } from '../clerk/clerkTokenManager';
import { ExpoSecureStoreAdapter } from './storage.adapter';

const { supabaseUrl, supabaseAnonKey } = envs;

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