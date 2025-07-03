import { supabase } from "@/common/lib/supabase/supabaseClient";
import { User } from "@/common/types/user.interface";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["current-user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as User;
    },
    enabled: !!userId,
  });
}; 