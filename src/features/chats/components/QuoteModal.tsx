import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface QuoteModalProps {
  onClose: () => void;
  onSendQuote: (data: { description: string; amount: number }) => void;
  clientName?: string;
  clientAvatar?: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  onClose,
  onSendQuote,
  clientName,
  clientAvatar,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!description.trim() || !amount.trim() || isNaN(Number(amount))) {
      setError("Completa todos los campos correctamente.");
      return;
    }
    setError("");
    onSendQuote({ description: description.trim(), amount: Number(amount) });
    setDescription("");
    setAmount("");
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header/fondo verde */}
        <LinearGradient
          colors={["#2D7A3E", "#4BB96F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingBottom: 32,
            paddingTop: 36,
            paddingHorizontal: 0,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          {/* Flecha atrás */}
          <Pressable
            onPress={onClose}
            style={{ position: "absolute", top: 18, left: 18, zIndex: 11 }}
          >
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </Pressable>
          {/* Monto */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                marginBottom: 8,
                fontWeight: "bold",
              }}
            >
              Monto de la cotización
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                paddingVertical: 12,
                paddingHorizontal: 32,
                minWidth: 220,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 8,
                marginBottom: 12,
              }}
            >
              <TextInput
                style={{
                  color: "#2D7A3E",
                  fontSize: 38,
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 180,
                }}
                placeholder="$0.00"
                placeholderTextColor="#BDBDBD"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            {/* Nombre y foto del cliente */}
            {clientName && (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                {clientAvatar && (
                  <Image
                    source={{ uri: clientAvatar }}
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
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Para: {clientName}
                </Text>
              </View>
            )}
            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                marginTop: 8,
                textAlign: "center",
                opacity: 0.9,
              }}
            >
              Pagarás por tu solicitud
            </Text>
            {description.trim() !== "" && (
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginTop: 2,
                  textAlign: "center",
                }}
              >
                {description}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Parte blanca: descripción y botón */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            backgroundColor: "#fff",
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <Text
            style={{
              color: "#2D7A3E",
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Descripción
          </Text>
          <TextInput
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              minHeight: 60,
              color: "#222",
              width: "100%",
              textAlign: "left",
              marginBottom: 16,
            }}
            placeholder="Detalle del trabajo, condiciones, etc."
            placeholderTextColor="#BDBDBD"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          {error ? (
            <Text style={{ color: "#EF4444", marginBottom: 8 }}>{error}</Text>
          ) : null}
          <View style={{ flex: 1 }} />
          <Pressable
            style={{
              backgroundColor: "#2D7A3E",
              borderRadius: 24,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 16,
              marginBottom: 32,
            }}
            onPress={handleSend}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              Enviar cotización
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default QuoteModal;
