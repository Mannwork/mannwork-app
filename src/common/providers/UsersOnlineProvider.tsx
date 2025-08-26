import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

// El estado onlineUsers ahora guardará directamente los IDs como strings
interface UsersOnlineContextType {
    onlineUsers: string[];
    loading: boolean;
}

const UsersOnlineContext = createContext<UsersOnlineContextType>({
    onlineUsers: [],
    loading: true,
});

export const UsersOnlineProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { userId, isSignedIn } = useAuth();

    // El estado guardará un array de strings (los user_id)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mejor usar el tipo RealtimeChannel para tener autocompletado y seguridad
        let channel: RealtimeChannel | null = null;

        if (userId && isSignedIn) {
            channel = supabase.channel("online-users", {
                config: {
                    presence: {
                        key: userId, // Usar userId como clave única de presencia
                    },
                },
            });

            // Evento 'sync': Se dispara una vez al conectarse y te da la lista completa
            channel.on("presence", { event: "sync" }, () => {
                const presenceState = channel!.presenceState();

                const userIds = Object.values(presenceState)
                    .flat()
                    .map((p: any) => p.user_id);

                setOnlineUsers(userIds);
                setLoading(false);
            });

            // Evento 'join': Se dispara cuando un nuevo usuario se une al canal
            channel.on("presence", { event: "join" }, ({ newPresences }) => {
                setOnlineUsers((prevUsers) => {
                    const newIds = newPresences.map((p: any) => p.user_id);
                    // Evitar duplicados y añadir los nuevos usuarios
                    return [...new Set([...prevUsers, ...newIds])];
                });
            });

            // Evento 'leave': Se dispara cuando un usuario se desconecta
            channel.on("presence", { event: "leave" }, ({ leftPresences }) => {
                setOnlineUsers((prevUsers) => {
                    const leftIds = leftPresences.map((p: any) => p.user_id);
                    // Filtrar y quitar los usuarios que se fueron
                    return prevUsers.filter((id) => !leftIds.includes(id));
                });
            });

            channel.subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    // Cuando la suscripción es exitosa, trackea al usuario actual
                    await channel!.track({
                        user_id: userId,
                    });
                }
            });
        } else {
            setLoading(false);
        }

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [userId, isSignedIn]);

    return (
        <UsersOnlineContext.Provider value={{ onlineUsers, loading }}>
            {children}
        </UsersOnlineContext.Provider>
    );
};

export const useUsersOnline = () => {
    return useContext(UsersOnlineContext);
};
