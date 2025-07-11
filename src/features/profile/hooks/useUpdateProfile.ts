import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProfileData {
  name: string;
  last_name: string;
  profile_pic?: string;
  description?: string;
  professions?: {
    category_id: number;
    subcategory_id: string;
    category_name: string;
    subcategory_name: string;
  }[]; // Solo para profesionales
  service_radius?: number;
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
        ...(data.service_radius !== undefined && { service_radius: data.service_radius }),
      };

      // Si hay profesiones, actualiza la tabla intermedia user_professional_services
      if (data.professions) {
        // Elimina las profesiones actuales del usuario
        await supabase
          .from('user_professional_services')
          .delete()
          .eq('user_id', userId);

        // Inserta las nuevas profesiones
        for (const profession of data.professions) {
          // profession puede ser un string (nombre) o un objeto, depende de tu flujo
          // Aquí asumo que es un objeto { category_id, subcategory_id }
          // Si solo tienes el nombre, deberías mapearlo a los IDs antes de guardar
          await supabase
            .from('user_professional_services')
            .insert({
              user_id: userId,
              category_id: profession.category_id,
              subcategory_id: profession.subcategory_id,
            });
        }
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