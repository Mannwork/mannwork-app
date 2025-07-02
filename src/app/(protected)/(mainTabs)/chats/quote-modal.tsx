import QuoteModalComponent from "@/features/chats/components/QuoteModal";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QuoteModal = () => {
  const [visible, setVisible] = useState(true);
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Puedes obtener datos del cliente desde params si los pasas por la navegación
  const clientName = params.clientName as string | undefined;
  const clientAvatar = params.clientAvatar as string | undefined;

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  const handleSendQuote = (data: { description: string; amount: number }) => {
    // Aquí puedes enviar la cotización al backend o agregarla al chat
    handleClose();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <QuoteModalComponent
        onClose={handleClose}
        onSendQuote={handleSendQuote}
        clientName={clientName}
        clientAvatar={clientAvatar}
      />
    </View>
  );
};

export default QuoteModal;
