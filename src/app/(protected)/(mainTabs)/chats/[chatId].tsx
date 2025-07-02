import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatHeader from "../../../../features/chats/components/ChatHeader";
import ChatInput from "../../../../features/chats/components/ChatInput";
import MessageItem from "../../../../features/chats/components/MessageItem";
import QuoteButton from "../../../../features/chats/components/QuoteButton";

// Tipos de mensaje para el chat
type Message =
  | {
      id: string;
      type: "text";
      text: string;
      timestamp: string;
      isFromMe: boolean;
    }
  | {
      id: string;
      type: "image";
      imageUrl: string;
      timestamp: string;
      isFromMe: boolean;
    }
  | {
      id: string;
      type: "quote_request";
      isFromMe: boolean;
      status: "pending" | "responded";
      timestamp: string;
    }
  | {
      id: string;
      type: "quote";
      isFromMe: boolean;
      quote: {
        amount: number;
        description: string;
        professionalName: string;
        professionalAvatar?: string;
      };
      quoteStatus: "pending" | "paid";
      timestamp: string;
    };

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

const mockMessages: Message[] = [
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
  {
    id: "7",
    type: "quote_request" as const,
    isFromMe: false,
    status: "pending" as const,
    timestamp: "10:25",
  },
  {
    id: "8",
    type: "quote",
    isFromMe: true,
    quote: {
      amount: 50000,
      description: "Montar e instalar lámparas",
      professionalName: "Jorge C.",
      professionalAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    quoteStatus: "pending",
    timestamp: "10:27",
  },
];

const ChatScreen = () => {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<any>(null);
  const userRole: "client" | "professional" = "client";
  const insets = useSafeAreaInsets();

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

  const handleOptionsPress = () => {
    console.log("Opciones del chat");
  };

  // Solicitar cotización (cliente)
  const handleRequestQuote = () => {
    const newMessage = {
      id: Date.now().toString(),
      type: "quote_request" as const,
      isFromMe: true,
      status: "pending" as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Profesional abre modal de cotización
  const handleQuoteRequest = () => {
    router.push(`/chats/quote-modal?chatId=${chatId}`);
  };

  // Profesional envía cotización
  const handleSendQuote = (data: { description: string; amount: number }) => {
    const newMessage = {
      id: Date.now().toString(),
      type: "quote" as const,
      isFromMe: true,
      quote: {
        amount: data.amount,
        description: data.description,
        professionalName: "Lautaro Kaufmann",
        professionalAvatar:
          "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
      },
      quoteStatus: "pending" as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Cliente abre modal de pago
  const handlePayQuote = (quoteMessage: any) => {
    router.push(
      `/chats/see-quote-modal?quoteAmount=${
        quoteMessage.quote.amount
      }&quoteDescription=${encodeURIComponent(
        quoteMessage.quote.description
      )}&quoteProfessionalName=${encodeURIComponent(
        quoteMessage.quote.professionalName
      )}&quoteProfessionalAvatar=${encodeURIComponent(
        quoteMessage.quote.professionalAvatar || ""
      )}&quoteId=${quoteMessage.id}`
    );
  };

  // Cliente ve cotización existente desde el botón
  const handleViewQuote = () => {
    const existingQuote = messages.find(
      (m) => m.type === "quote" && m.quoteStatus === "pending"
    );
    if (existingQuote) {
      handlePayQuote(existingQuote);
    }
  };

  // Cliente paga la cotización
  const handleConfirmPayment = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === pendingQuote.id ? { ...msg, quoteStatus: "paid" } : msg
      )
    );
    setShowPaymentModal(false);
    setPendingQuote(null);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageItem
      message={item}
      onQuoteRequest={
        userRole === "professional" ? handleQuoteRequest : undefined
      }
      onPayQuote={
        userRole === "client" &&
        item.type === "quote" &&
        item.quoteStatus === "pending"
          ? () => handlePayQuote(item)
          : undefined
      }
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
    >
      <View className="flex-1 bg-gray-50">
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

        {/* Botón de cotización */}
        {userRole === "client" && (
          <QuoteButton
            onRequestQuote={handleRequestQuote}
            onViewQuote={handleViewQuote}
            userRole={userRole}
            hasQuote={messages.some((m) => m.type === "quote")}
          />
        )}

        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onSendFile={handleSendFile}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
