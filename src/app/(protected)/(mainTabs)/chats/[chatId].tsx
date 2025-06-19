import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import ChatHeader from "../../../../features/chats/components/ChatHeader";
import ChatInput from "../../../../features/chats/components/ChatInput";
import MessageItem from "../../../../features/chats/components/MessageItem";
import QuoteButton from "../../../../features/chats/components/QuoteButton";

const mockChatData = {
  id: "1",
  professionalName: "Lautaro Kaufmann",
  professionalImage:
    "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  mainCategory: "Servicios del hogar",
  subCategory: "Reparación de aire acondicionado",
  status: "active" as const,
  hasQuote: false,
};

const mockMessages = [
  {
    id: "1",
    text: "Hola, necesito que revise mi aire acondicionado. No está enfriando bien.",
    timestamp: "10:30",
    isFromMe: true,
    type: "text" as const,
  },
  {
    id: "2",
    text: "Hola! Por supuesto, puedo ayudarte. ¿En qué zona estás ubicado?",
    timestamp: "10:32",
    isFromMe: false,
    type: "text" as const,
  },
  {
    id: "3",
    text: "Estoy en Palermo, cerca de Plaza Italia.",
    timestamp: "10:33",
    isFromMe: true,
    type: "text" as const,
  },
  {
    id: "4",
    text: "Perfecto, puedo ir mañana a las 10:00 AM. ¿Te parece bien?",
    timestamp: "10:35",
    isFromMe: false,
    type: "text" as const,
  },
  {
    id: "5",
    text: "Sí, perfecto. Te envío una foto del equipo para que veas el modelo.",
    timestamp: "10:36",
    isFromMe: true,
    type: "text" as const,
  },
  {
    id: "6",
    imageUrl:
      "https://timbrit-produccion.s3.amazonaws.com/0bf4e5a0009a3d795231124fc6fcdebed0d9ceee.jpg",
    timestamp: "10:37",
    isFromMe: true,
    type: "image" as const,
  },
];

const ChatScreen = () => {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState(mockMessages);

  const userRole: "client" | "professional" = "client";

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFromMe: true,
      type: "text" as const,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendImage = () => {
    console.log("Enviar imagen");
  };

  const handleSendFile = () => {
    console.log("Enviar archivo");
  };

  const handleQuotePress = () => {
    router.push(`/chats/quote-modal?chatId=${chatId}`);
  };

  const handleOptionsPress = () => {
    console.log("Opciones del chat");
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageItem message={item} />
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ChatHeader
        professionalName={mockChatData.professionalName}
        professionalImage={mockChatData.professionalImage}
        mainCategory={mockChatData.mainCategory}
        subCategory={mockChatData.subCategory}
        status={mockChatData.status}
        onOptionsPress={handleOptionsPress}
      />

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <QuoteButton
        onPress={handleQuotePress}
        userRole={userRole}
        hasQuote={mockChatData.hasQuote}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onSendFile={handleSendFile}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
