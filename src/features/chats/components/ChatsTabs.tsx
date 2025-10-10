import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { getUnreadIndicators } from "../services/get-unread-indicator";

interface ChatsTabsProps {
    activeTab: "active" | "pending" | "completed";
    onTabChange: (tab: "active" | "pending" | "completed") => void;
}

const ChatsTabs = ({ activeTab, onTabChange }: ChatsTabsProps) => {
    const { userId } = useAuth();

    const queryClient = useQueryClient();
    const { data: unreadIndicators, isLoading } = useQuery({
        queryKey: ["unread-indicators", userId],
        queryFn: () => getUnreadIndicators(userId as string),
    });

    // Set up real-time subscription for new messages
    useEffect(() => {
        if (!userId) return;

        // First, get all chat IDs where the user is either client or professional
        const getChatIds = async () => {
            const { data: chats } = await supabase
                .from("chats")
                .select("id")
                .or(`client_id.eq.${userId},professional_id.eq.${userId}`);

            return chats?.map((chat) => chat.id) || [];
        };

        // Subscribe to new messages in chats where the user is a participant
        const setupSubscription = async () => {
            const chatIds = await getChatIds();
            if (chatIds.length === 0) return null;

            const subscription = supabase
                .channel("unread_messages")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `chat_id=in.(${chatIds.join(",")})`,
                    },
                    (payload) => {
                        // When a new message is received, refetch the unread indicators
                        // Only if the message is not from the current user
                        if (payload.new.sender_id !== userId) {
                            queryClient.invalidateQueries({
                                queryKey: ["unread-indicators", userId],
                            });
                        }
                    }
                )
                .subscribe();

            return subscription;
        };

        let subscription: any;
        setupSubscription().then((sub) => {
            subscription = sub;
        });

        // Cleanup subscription on unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [userId, queryClient]);

    const tabs = [
        { key: "active" as const, label: "Activos" },
        { key: "pending" as const, label: "Pendientes" },
        {
            key: "completed" as const,
            label: "Completados",
        },
    ];

    return (
        <View className="bg-white border-b border-gray-200">
            <View className="flex-row px-4">
                {tabs.map((tab) => (
                    <Pressable
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        className={`flex-1 py-4 border-b-2 ${
                            activeTab === tab.key
                                ? "border-green-mannwork"
                                : "border-transparent"
                        }`}
                    >
                        <View className="items-center">
                            <View className="flex-row items-center">
                                <Text
                                    className={`font-semibold text-sm ${
                                        activeTab === tab.key
                                            ? "text-green-mannwork"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {tab.label}
                                </Text>
                                {!isLoading &&
                                    unreadIndicators &&
                                    unreadIndicators[tab.key] === true && (
                                        <View
                                            className={`ml-2 rounded-full min-w-[12px] min-h-[12px] bg-green-mannwork`}
                                        ></View>
                                    )}
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

export default ChatsTabs;
