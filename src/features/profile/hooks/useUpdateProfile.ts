import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProfileData {
  name: string;
  last_name: string;
  profile_pic?: string;
  description?: string;
  professions?: string[]; // Solo para profesionales
}

export const useUpdateProfile = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!userId) throw new Error("No user ID");

      const updateData: any = {
        name: data.name,
        last_name: data.last_name,
        profile_pic: data.profile_pic,
        description: data.description,
      };

      // Si hay profesiones, agregarlas al update (solo para profesionales)
      if (data.professions) {
        updateData.professions = data.professions;
      }

      const { data: result, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ["current-user", userId] });
      queryClient.invalidateQueries({ queryKey: ["userDataSupabase", userId] });
    },
  });
}; 