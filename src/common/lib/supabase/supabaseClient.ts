import "react-native-url-polyfill/auto";

import { createClient } from '@supabase/supabase-js';

import { envs } from '@/common/config/envs';

import { getClerkAccessToken } from '../clerk/clerkTokenManager';
import { ExpoSecureStoreAdapter } from './storage.adapter';

const { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } = envs;

// Cliente de Supabase configurado para trabajar con Clerk
export const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  accessToken: getClerkAccessToken,
});

export type SupabaseClientType = typeof supabase;