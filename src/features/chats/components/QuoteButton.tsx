import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { getQuote } from "../services/get-quote";
import { postNewMessage } from "../services/post-new-message";

interface QuoteButtonProps {
  chatId: string;
  refetch: () => void;
  receptorId: string;
  requestId?: string;
  userRole: "client" | "professional";
  hasQuote?: boolean;
}

const QuoteButton = ({
  refetch,
  receptorId,
  userRole,
  hasQuote = false,
  chatId,
  requestId,
}: QuoteButtonProps) => {
  const { userId } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un bloqueo entre los usuarios
  useEffect(() => {
    const checkBlock = async () => {
      if (!userId || !receptorId) return;

      try {
        const { data } = await supabase
          .from("user_blocks")
          .select("id")
          .or(`blocker_id.eq.${userId},blocker_id.eq.${receptorId}`)
          .or(`blocked_id.eq.${userId},blocked_id.eq.${receptorId}`)
          .single();

        setIsBlocked(!!data);
      } catch (error) {
        console.error("Error checking block:", error);
        setIsBlocked(false);
      } finally {
        setLoading(false);
      }
    };

    checkBlock();
  }, [userId, receptorId]);

  const getButtonText = () => {
    if (userRole === "client") {
      return hasQuote ? "Ver cotización" : "Solicitar cotización";
    } else {
      return hasQuote ? "Ver cotización" : "Enviar cotización";
    }
  };

  const getButtonColor = () => {
    return hasQuote ? "bg-blue-500" : "bg-green-mannwork";
  };

  const handlePress = async () => {
    if (isBlocked) {
      alert("No puedes interactuar con este usuario");
      return;
    }

    if (hasQuote) {
      // Buscar el último mensaje tipo 'quote' para este chat
      const quote = await getQuote("", chatId);

      if (quote) {
        router.push({
          pathname: "/(protected)/(mainTabs)/chats/see-quote-modal",
          params: {
            quoteId: quote.id,
            quoteAmount: quote.price?.toString() || "0",
            quoteDescription: quote.descriptionservice || "",
            quoteProfessionalName: quote.professionalName || "",
            quoteProfessionalAvatar: quote.professionalAvatar || "",
            professionalAccessToken: quote.professionalAccessToken || "",
            requestId: requestId,
          },
        });
      }
    } else {
      await postNewMessage({
        content: "",
        chat_id: chatId,
        sender_id: userId as string,
        type: "quote_request",
        receptor_id: receptorId,
      });
      refetch();
    }
  };

  // Si está cargando, no mostrar nada
  if (loading) {
    return null;
  }

  // Si hay un bloqueo, no mostrar el botón
  if (isBlocked) {
    return null;
  }

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-3">
      <Pressable
        onPress={handlePress}
        className={`${getButtonColor()} rounded-lg py-3 px-4 flex-row items-center justify-center`}
      >
        <MaterialIcons
          name={hasQuote ? "receipt" : "request-quote"}
          size={20}
          color="#FFFFFF"
        />
        <Text className="text-white font-semibold text-base ml-2">
          {getButtonText()}
        </Text>
      </Pressable>
    </View>
  );
};

export default QuoteButton;
