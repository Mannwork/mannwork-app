import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface QuoteButtonProps {
  onPress: () => void;
  userRole: "client" | "professional";
  hasQuote?: boolean;
}

const QuoteButton = ({
  onPress,
  userRole,
  hasQuote = false,
}: QuoteButtonProps) => {
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

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-3">
      <Pressable
        onPress={onPress}
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
