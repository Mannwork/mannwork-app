import OptionsMenu from "@/common/components/OptionsMenu";
import ReportModal from "@/common/components/ReportModal";
import { supabase } from "@/common/lib/supabase/supabaseClient";
import { categoryIcons } from "@/common/types/categories.interface";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActualChatData } from "../store/chat.store";

const ChatHeader = ({
  onlineUsers,
  actualChatData,
}: {
  onlineUsers: string[];
  actualChatData: ActualChatData;
}) => {
  const { userId } = useAuth();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<{
    isBlocked: boolean;
    isBlocker: boolean;
  }>({ isBlocked: false, isBlocker: false });
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const getCategoryIcon = (categoryName: string) => {
    return categoryIcons[categoryName] || "category";
  };

  const categoryIcon = getCategoryIcon(
    (actualChatData.mainCategory as string) || ""
  );

  const formatName = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names[names.length - 1];
      return `${firstName} ${lastName.charAt(0)}.`;
    }
    return fullName;
  };

  const getStatusColor = () => {
    if (userId === actualChatData.professional_id) {
      if (onlineUsers.includes(actualChatData.client_id as string)) {
        return "bg-green-500";
      } else {
        return "bg-gray-500";
      }
    } else {
      if (onlineUsers.includes(actualChatData.professional_id as string)) {
        return "bg-green-500";
      } else {
        return "bg-gray-500";
      }
    }
  };

  const getStatusText = () => {
    // Si el usuario actual es el profesional
    if (userId === actualChatData.professional_id) {
      return onlineUsers.includes(actualChatData.client_id as string)
        ? "Activo"
        : "Desconectado";
    } else {
      // Si el usuario actual es el cliente
      return onlineUsers.includes(actualChatData.professional_id as string)
        ? "Activo"
        : "Desconectado";
    }
  };

  useEffect(() => {
    const checkBlock = async () => {
      if (
        !userId ||
        !actualChatData.professional_id ||
        !actualChatData.client_id
      )
        return;

      try {
        // Obtener el ID del otro usuario en el chat
        const otherUserId =
          userId === actualChatData.professional_id
            ? actualChatData.client_id
            : actualChatData.professional_id;

        // Verificar si hay un bloqueo entre estos dos usuarios específicos
        const { data } = await supabase
          .from("user_blocks")
          .select("id, blocker_id, blocked_id")
          .or(
            `and(blocker_id.eq.${userId},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${userId})`
          )
          .single();

        if (data) {
          const isBlocker = data.blocker_id === userId;
          const isBlocked = data.blocked_id === userId;

          setIsBlocked(true);
          setBlockInfo({ isBlocked, isBlocker });
        } else {
          setIsBlocked(false);
          setBlockInfo({ isBlocked: false, isBlocker: false });
        }
      } catch (error) {
        console.error("Error checking block:", error);
        setIsBlocked(false);
        setBlockInfo({ isBlocked: false, isBlocker: false });
      }
    };

    checkBlock();
  }, [userId, actualChatData.professional_id, actualChatData.client_id]);

  const handleReportSubmit = useCallback(
    async (reason: string, details: string) => {
      if (!userId) {
        console.error(
          "Debes estar autenticado para enviar un reporte.",
          "error"
        );
        return;
      }

      const reportedUserId =
        userId === actualChatData.professional_id
          ? actualChatData.client_id
          : actualChatData.professional_id;

      try {
        const response = await fetch(
          "https://iuufdqgudfrkisywsnuc.supabase.co/functions/v1/create-report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",

              "x-user-id": userId,
            },
            body: JSON.stringify({
              reportedUserId: reportedUserId,
              reason: reason,
              details: details.trim() || null,
              reportedContentId: actualChatData.chatId,
              reportedContentType: "chat_message",
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error al enviar el reporte.");
        }
      } catch (error) {
        console.error("Error al enviar el reporte:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Algo salió mal.";
        console.error("Error", errorMessage);
      }
    },
    [userId, actualChatData]
  );

  const handleBlockUser = useCallback(async () => {
    if (!userId) {
      console.error(
        "Debes estar autenticado para bloquear un usuario.",
        "error"
      );
      return;
    }

    const blockedUserId =
      userId === actualChatData.professional_id
        ? actualChatData.client_id
        : actualChatData.professional_id;

    try {
      const response = await fetch(
        "https://iuufdqgudfrkisywsnuc.supabase.co/functions/v1/block-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({
            blockedUserId: blockedUserId,
            action: "block",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al bloquear el usuario.");
      }

      // Mostrar mensaje de confirmación
      console.log("Usuario bloqueado exitosamente");
      Alert.alert("Exito", "Usuario bloqueado exitosamente");

      // Regresar a la lista de chats
      router.replace("/(protected)/(mainTabs)/chats");
    } catch (error) {
      console.error("Error al bloquear el usuario:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Algo salió mal.";
      console.error("Error", errorMessage);
    }
  }, [userId, actualChatData, router]);

  const handleUnblockUser = useCallback(async () => {
    if (!userId) {
      console.error(
        "Debes estar autenticado para desbloquear un usuario.",
        "error"
      );
      return;
    }

    const blockedUserId =
      userId === actualChatData.professional_id
        ? actualChatData.client_id
        : actualChatData.professional_id;

    try {
      const response = await fetch(
        "https://iuufdqgudfrkisywsnuc.supabase.co/functions/v1/block-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({
            blockedUserId: blockedUserId,
            action: "unblock",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al desbloquear el usuario.");
      }

      console.log("Usuario desbloqueado exitosamente");
      Alert.alert("Exito", "Usuario desbloqueado exitosamente");

      // Actualizar el estado local
      setIsBlocked(false);
    } catch (error) {
      console.error("Error al desbloquear el usuario:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Algo salió mal.";
      console.error("Error", errorMessage);
    }
  }, [userId, actualChatData]);

  const handleProfessionalPress = (userId: string) => {
    router.push({
      pathname: "/(protected)/users/[userId]",
      params: { userId },
    });
  };

  const menuActions = [
    {
      title: "Reportar conversación",
      icon: "alert-circle-outline" as const,
      isDestructive: true,
      onPress: () => {
        setMenuVisible(false);
        setReportModalVisible(true);
      },
    },
    // Solo mostrar opciones de bloqueo/desbloqueo si el usuario actual fue quien bloqueó
    ...(blockInfo.isBlocker
      ? [
          {
            title: "Desbloquear usuario",
            icon: "checkmark-circle" as const,
            onPress: () => {
              setMenuVisible(false);
              handleUnblockUser();
            },
          },
        ]
      : !isBlocked
      ? [
          {
            title: "Bloquear usuario",
            icon: "remove-circle" as const,
            isDestructive: true,
            onPress: () => {
              setMenuVisible(false);
              handleBlockUser();
            },
          },
        ]
      : []),
    // Solo mostrar "Ver perfil" si no hay bloqueo
    ...(isBlocked
      ? []
      : [
          {
            title: "Ver perfil",
            icon: "person-circle-outline" as const,
            onPress: () => {
              const userIdRedirect =
                userId === actualChatData.professional_id
                  ? actualChatData.client_id
                  : actualChatData.professional_id;
              handleProfessionalPress(userIdRedirect as string);
            },
          },
        ]),
  ];

  useEffect(() => {}, [actualChatData]);

  return (
    <>
      <View
        className="bg-green-mannwork px-4 py-3"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.replace("/(protected)/(mainTabs)/chats")}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View className="flex-1 flex-row items-center">
            <View className="relative">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center overflow-hidden">
                {actualChatData.professionalImage ? (
                  <Image
                    source={{
                      uri: actualChatData.professionalImage,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialIcons name="person" size={24} color="#2D7A3E" />
                )}
              </View>

              <View
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-white font-bold text-lg">
                {formatName(actualChatData.professionalName)}
              </Text>
              <View className="flex-row items-center mt-1">
                {/* <View
                className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}
              /> */}
                <Text className="text-white/80 text-sm ml-1">
                  {getStatusText()}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => setMenuVisible(true)}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View className="mt-3 bg-white/10 rounded-lg px-3 py-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white/90 text-sm font-medium">
                {actualChatData.mainCategory}
              </Text>
              <Text className="text-white/70 text-xs mt-1">
                {actualChatData.subCategory}
              </Text>
            </View>
            <MaterialIcons
              name={categoryIcon as any}
              size={16}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <OptionsMenu
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        actions={menuActions}
        title="Opciones del chat"
      />
      <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
    </>
  );
};

export default ChatHeader;
