import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { postNewMessage } from "../services/post-new-message";
import { postNewQuote } from "../services/post-new-quote";
import { useChatStore } from "../store/chat.store";

interface QuoteModalProps {
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ onClose }) => {
  const { actualChatData } = useChatStore();
  const params = useLocalSearchParams();
  const chatId = params.chatId as string;
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [workDate, setWorkDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time" | "datetime">("date");
  const [error, setError] = useState("");

  function formatName(fullName: string) {
    const parts = fullName.trim().split(" ");
    if (parts.length === 0) return "";

    const firstName = parts[0]; // primer nombre
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : ""; // inicial del último apellido

    return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
  }

  const handleSend = async () => {
    if (
      !description.trim() ||
      !amount.trim() ||
      isNaN(Number(amount)) ||
      !workDate
    ) {
      setError("Completa todos los campos correctamente.");
      return;
    }

    try {
      const quote = await postNewQuote({
        request_id: actualChatData?.request_id || "",
        client_id: actualChatData?.client_id || "",
        professional_id: actualChatData?.professional_id || "",
        price: Number(amount),
        descriptionservice: description.trim(),
        status: "pending",
        work_date: workDate,
      });

      if (quote) {
        await postNewMessage({
          content: quote.id,
          chat_id: chatId,
          sender_id: actualChatData?.professional_id || "",
          type: "quote",
        });
      }

      setError("");
      setDescription("");
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Error al crear cotización:", error);
      setError("Error al crear cotización");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View className="flex-1">
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
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 11,
            }}
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
            {actualChatData?.professionalName && (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                {actualChatData?.professionalImage && (
                  <Image
                    source={{
                      uri: actualChatData?.professionalImage,
                    }}
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
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Para: {formatName(actualChatData?.professionalName || "")}
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
              El cliente pagará por tu solicitud
            </Text>

            {/* Fecha y hora del trabajo */}
            <View
              style={{
                marginTop: 20,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  marginBottom: 8,
                  fontWeight: "500",
                }}
              >
                Fecha y hora del trabajo:
              </Text>
              <Pressable
                onPress={() => {
                  if (Platform.OS === "ios") {
                    setMode("datetime"); // fecha + hora en iOS
                  } else {
                    setMode("date"); // en Android primero la fecha
                  }
                  setShowDatePicker(true);
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#2D7A3E",
                    fontWeight: "500",
                  }}
                >
                  {workDate.toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={workDate}
                  mode={mode}
                  display="default"
                  onChange={(event: any, selectedDate?: Date) => {
                    if (Platform.OS === "android") {
                      setShowDatePicker(false);
                      if (event.type === "dismissed") {
                        return;
                      }
                    }

                    if (selectedDate) {
                      setWorkDate(selectedDate);
                      if (mode === "date" && Platform.OS === "android") {
                        // On Android, after selecting date, show time picker
                        setMode("time");
                        setShowDatePicker(true);
                      } else if (mode === "time" && Platform.OS === "android") {
                        // Time has been selected, close the picker
                        setShowDatePicker(false);
                      }
                    }
                  }}
                  minimumDate={new Date()}
                  locale="es-AR"
                />
              )}
            </View>
            {description.trim() !== "" && (
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginTop: 14,
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
            returnKeyType="done"
            blurOnSubmit={true}
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
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Enviar cotización
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default QuoteModal;
