import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

import { getUserDataInSupabaseById } from "../services/get-user-supabase";

export const useUserDataSupabase = () => {
    const { userId } = useAuth();

    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userDataSupabase", userId],
        queryFn: () => {
            if (!userId) return null;
            return getUserDataInSupabaseById(userId);
        },
        enabled: !!userId,
    });

    return { user, isLoading, error };
};
