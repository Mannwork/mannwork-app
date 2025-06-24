import { supabase } from "../lib/supabase/supabaseClient";

export const getOnboardingStatus = async (userId: string) => {
  console.log("userId", userId);
  
  const { data, error } = await supabase
    .from("users")
    .select("is_onboarding_complete")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to fetch onboarding status: " + error.message);
  }

  if (!data) {
    throw new Error("Error fetching data: data es falsy.");
    
  }
  console.log("data", data);

  return data?.is_onboarding_complete ?? false;
};