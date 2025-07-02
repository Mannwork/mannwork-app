import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

interface QuoteCardProps {
  quote: {
    amount: number;
    description: string;
    professionalName: string;
    professionalAvatar?: string;
  };
  isFromMe: boolean;
  onPay?: () => void;
  status: "pending" | "paid";
  timestamp: string;
}

const QuoteCard = ({
  quote,
  isFromMe,
  onPay,
  status,
  timestamp,
}: QuoteCardProps) => {
  return (
    <View
      style={{
        alignSelf: isFromMe ? "flex-end" : "flex-start",
        backgroundColor: isFromMe ? "#E5F9ED" : "#F3F4F6",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        minWidth: 300,
        maxWidth: 320,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <MaterialIcons name="receipt" size={28} color="#2D7A3E" />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: "#2D7A3E",
            marginLeft: 8,
          }}
        >
          Cotización enviada
        </Text>
      </View>
      <Text
        style={{
          color: "#2D7A3E",
          fontWeight: "bold",
          fontSize: 22,
          marginBottom: 6,
        }}
      >
        ${quote.amount.toLocaleString()}
      </Text>
      <Text style={{ color: "#444", fontSize: 15, marginBottom: 10 }}>
        {quote.description}
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        {quote.professionalAvatar && (
          <Image
            source={{ uri: quote.professionalAvatar }}
            style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
          />
        )}
        <Text style={{ color: "#2D7A3E", fontWeight: "bold", fontSize: 15 }}>
          {quote.professionalName}
        </Text>
      </View>
      {status === "pending" && onPay && (
        <Pressable
          onPress={onPay}
          style={{
            backgroundColor: "#2D7A3E",
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 8,
            minWidth: 160,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Pagar cotización
          </Text>
        </Pressable>
      )}
      {status === "paid" && (
        <Text
          style={{
            color: "#4BB96F",
            fontWeight: "bold",
            fontSize: 15,
            marginTop: 8,
          }}
        >
          Pagada
        </Text>
      )}
      <Text
        style={{
          color: "#888",
          fontSize: 12,
          marginTop: 10,
          textAlign: "right",
        }}
      >
        {timestamp}
      </Text>
    </View>
  );
};

export default QuoteCard;
