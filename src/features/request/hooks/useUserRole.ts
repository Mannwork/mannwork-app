import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

export const useUserRole = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["user-role", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID");

      const { data, error } = await supabase
        .from("users")
        .select("rol")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data.rol as "client" | "professional";
    },
    enabled: !!userId,
  });
}; 