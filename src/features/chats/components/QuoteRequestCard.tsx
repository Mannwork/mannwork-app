import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface QuoteRequestCardProps {
    onQuote: () => void;
    isFromMe: boolean;
    timestamp: string;
    isQuoted?: boolean;

}

const QuoteRequestCard = ({
    onQuote,
    isFromMe,
    timestamp,
    isQuoted = false,
}: QuoteRequestCardProps) => {
    const isPressable = !isFromMe;
    const CardContent = (
        <View
            style={{
                alignSelf: isFromMe ? "flex-end" : "flex-start",
                backgroundColor: isFromMe ? "#E5F9ED" : "#F3F4F6",
                borderRadius: 16,
                padding: 16,
                marginVertical: 8,
                minWidth: 220,
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
                <MaterialIcons name="request-quote" size={28} color="#2D7A3E" />
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#2D7A3E",
                        marginLeft: 8,
                    }}
                >
                    Solicitud de cotización
                </Text>
            </View>
            <Text style={{ color: "#444", fontSize: 15, marginBottom: 12 }}>
                El cliente está esperando una cotización para este trabajo.
            </Text>
            {(!isFromMe && !isQuoted) && (
                <View style={{ marginTop: 4 }}>
                    <Text
                        style={{
                            color: "#2D7A3E",
                            fontWeight: "bold",
                            fontSize: 15,
                            textAlign: "center",
                        }}
                    >
                        Cotizar ahora
                    </Text>
                </View>
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

    if (isPressable) {
        return (
            <Pressable
                onPress={onQuote}
                style={{ alignSelf: isFromMe ? "flex-end" : "flex-start" }}
            >
                {CardContent}
            </Pressable>
        );
    }
    return CardContent;
};

export default QuoteRequestCard;
