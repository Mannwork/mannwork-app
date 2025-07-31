import { getPaymentMpUrl } from '@/common/utils/mp-submited';
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  quote: {
    chatId: string;
    amount: number;
    description: string;
    professionalName: string;
    professionalAvatar?: string;
  };
  professionalAccessToken: string;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  quote,
  professionalAccessToken,
  onConfirm,
}) => {
    console.log(professionalAccessToken);

const handlePay = async () => {
  const url = await getPaymentMpUrl(quote, professionalAccessToken);
  Linking.openURL(url);
};
  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header/fondo verde */}
      <LinearGradient
        colors={["#2D7A3E", "#4BB96F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingBottom: 32,
          paddingTop: 36,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", top: 18, left: 18, zIndex: 10 }}
        >
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </Pressable>
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Pagar
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 38,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          ${quote.amount.toLocaleString()}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Pagarás por tu solicitud
        </Text>
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 17,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {quote.description}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {quote.professionalAvatar && (
            <Image
              source={{ uri: quote.professionalAvatar }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 8,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          )}
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Pagarás a {quote.professionalName}
          </Text>
        </View>
      </LinearGradient>

      {/* Espaciador flexible para empujar el botón abajo */}
      <View style={{ flex: 1 }} />

      {/* Botón fijo abajo */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          backgroundColor: "#fff",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#2D7A3E",
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={handlePay}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
           Pagar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PaymentModal;
