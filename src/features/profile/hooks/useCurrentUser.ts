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

      // Trae los datos básicos del usuario
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Trae las profesiones del usuario
      const { data: professionsData } = await supabase
        .from("user_professional_services")
        .select("category_id, subcategory_id")
        .eq("user_id", userId);

      user.professions = professionsData || [];

      return user as User;
    },
    enabled: !!userId,
  });
}; 