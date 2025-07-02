import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  quote: {
    amount: number;
    description: string;
    professionalName: string;
    professionalAvatar?: string;
  };
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  quote,
  onConfirm,
}) => {
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 0,
        overflow: "hidden",
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
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

      {/* Parte blanca: método de pago */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 32,
          backgroundColor: "#fff",
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "#222",
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Pagarás con el siguiente método de pago:
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <MaterialIcons name="credit-card" size={24} color="#2D7A3E" />
          <Text style={{ color: "#222", fontSize: 16, marginLeft: 8 }}>
            Visa
          </Text>
          <Text style={{ color: "#888", fontSize: 15, marginLeft: 8 }}>
            Terminadas en 5501
          </Text>
          <MaterialIcons
            name="check-circle"
            size={22}
            color="#4BB96F"
            style={{ marginLeft: 8 }}
          />
        </View>
        <Pressable style={{ marginBottom: 24 }}>
          <Text style={{ color: "#2D7A3E", fontSize: 15, fontWeight: "bold" }}>
            Cambiar método de pago
          </Text>
        </Pressable>
      </View>

      {/* Botón al final */}
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
          onPress={onConfirm}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            Continuar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PaymentModal;
