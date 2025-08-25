import QuoteModalComponent from "@/features/chats/components/QuoteModal";

import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QuoteModal = () => {
  const insets = useSafeAreaInsets();

  // Puedes obtener datos del cliente desde params si los pasas por la navegación

  const handleClose = () => {
    router.back();
  };

  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top }}
    >
      <QuoteModalComponent onClose={handleClose} />
    </View>
  );
};

export default QuoteModal;
