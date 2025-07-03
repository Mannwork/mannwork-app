import { supabase } from "../lib/supabase/supabaseClient";

import type { User } from "../types/user.interface";

export const getUserDataInSupabaseById = async (userId: string): Promise<User> => {  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to fetch user data: " + error.message);
  }

  if (!data) {
    throw new Error("Error fetching data: data is falsy.");
    
  }

  return data;
};