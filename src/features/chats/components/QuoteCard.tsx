import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useQuote } from "../hooks/useQuotes";

interface QuoteCardProps {
    quoteId: string;
    timestamp: string;
}

const QuoteCard = ({ quoteId, timestamp }: QuoteCardProps) => {
    const { userId } = useAuth();
    const { data: quote } = useQuote(quoteId);
    const isFromMe = quote?.professional_id === userId;
    const handlePay = () => {
        if (!quote) return;
        router.push({
            pathname: "/(protected)/(mainTabs)/chats/see-quote-modal",
            params: {
                quoteId: quoteId,
                quoteAmount: quote.price?.toString() || "0",
                quoteDescription: quote.descriptionservice || "",
                quoteProfessionalName: quote.professionalName || "",
                quoteProfessionalAvatar: quote.professionalAvatar || "",
                professionalAccessToken: quote.professionalAccessToken || "",
            },
        });
    };

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
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                }}
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
                ${quote?.price?.toLocaleString()}
            </Text>
            <Text style={{ color: "#444", fontSize: 15, marginBottom: 10 }}>
                {quote?.descriptionservice}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                }}
            >
                {quote?.professionalAvatar && (
                    <Image
                        source={{ uri: quote.professionalAvatar }}
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            marginRight: 8,
                        }}
                    />
                )}
                <Text
                    style={{
                        color: "#2D7A3E",
                        fontWeight: "bold",
                        fontSize: 15,
                    }}
                >
                    {quote?.professionalName}
                </Text>
            </View>
            {quote?.status === "pending" && !isFromMe && (
                <Pressable
                    onPress={handlePay}
                    style={{
                        backgroundColor: "#2D7A3E",
                        borderRadius: 12,
                        paddingVertical: 12,
                        alignItems: "center",
                        marginTop: 8,
                        minWidth: 160,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                    >
                        Pagar cotización
                    </Text>
                </Pressable>
            )}
            {quote?.status === "paid" && (
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
