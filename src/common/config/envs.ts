const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Clerk Publishable Key is not defined. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file."
  );
}

if (!supabaseUrl) {
  throw new Error(
    "Supabase URL is not defined. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Supabase anonymous key is not defined. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file."
  );
}

if (!googlePlacesApiKey) {
  throw new Error(
    "Google Places API Key is not defined. Please set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your .env file."
  );
}

const envs = {
  clerkPublishableKey,
  supabaseUrl,
  supabaseAnonKey,
  googlePlacesApiKey,
};

export default envs;
