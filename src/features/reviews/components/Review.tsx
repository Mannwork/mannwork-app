import { useAlertStore } from "@/common/store/alert.store";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";

interface RouteParams {
  requestId: string;
  id: string;
  name: string;
  lastName: string;
  avatar: string;
  category: string;
  subcategory: string;
}

const Review = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const { requestId, id, name, lastName, avatar, category, subcategory } = params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const { show } = useAlertStore();
  

  const handleSubmit = useCallback(async () => {
    if (!userId) {
      show("Debes estar autenticado para calificar.", "error");
      return;
    }

    if (rating === 0) {
      show("Por favor selecciona una calificación.", "error");
      return;
    }

    try {
      const response = await fetch("https://erkaukgzkzgtpuymatnp.supabase.co/functions/v1/create-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          request_id: requestId,
          reviewed_id: id,
          commentary: comment.trim() || null,
          calification: rating,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar la calificación.");
      }

      show("¡Gracias! Tu calificación ha sido enviada.", "success");
      router.replace("/(protected)/(mainTabs)/requests");

    } catch (error) {
      console.error("Error al enviar review:", error);
      const errorMessage = error instanceof Error ? error.message : "Algo salió mal.";
      show(errorMessage, "error");
      router.back();
    }
  }, [rating, comment, requestId, id, userId]);


  const initialLastName = lastName?.charAt(0) || '';

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between bg-green-mannwork items-center px-4 py-2">
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 30 
        }}
      >
        <LinearGradient
          colors={['#2D7A3E', '#3A9C4D']}
          style={{
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
          className="pt-2 pb-6 px-6 items-center justify-center"
        >
          <View className="items-center">
            <View className="bg-white p-1 rounded-full mb-4">
              <Image
                source={{ uri: avatar }}
                className="w-28 h-28 rounded-full"
              />
            </View>

            <View className="flex-row items-center gap-0.5">
              <Text className="text-white text-2xl font-bold">{name} </Text>
              <Text className="text-white text-2xl font-bold">{initialLastName}.</Text>
            </View>

            <Text className="text-white mt-2">{category} • {subcategory}</Text>
            
            <View className="mt-2 items-center">
              <View pointerEvents="box-none">
                <StarRating
                  rating={rating}
                  onChange={setRating}
                  color="#FFD700"
                  starSize={40}
                  starStyle={{ marginHorizontal: 2 }}
                  enableHalfStar={false}
                  animationConfig={{ scale: 1.1, duration: 100 }}
                />
              </View>
              <Text className="text-white text-center mt-2">
                {rating === 0 ? "Selecciona una calificación" : 
                 rating <= 2 ? "¿En qué podemos mejorar?" : 
                 "¡Gracias por tu valoración!"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="flex-1 p-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Deja un comentario
          </Text>
          
          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <TextInput
              className="text-gray-800 text-base h-32 text-justify"
              multiline
              placeholder="Escribe tu comentario aquí..."
              placeholderTextColor="#9CA3AF"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {rating <= 2 && (
            <View className="mt-4 flex-row items-center p-3 bg-red-50 rounded-lg">
              <MaterialIcons name="warning" size={20} color="#EF4444" />
              <Text className="text-red-600 ml-2 text-sm">
                Tu feedback nos ayuda a mejorar nuestro servicio.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón fijo en la parte inferior */}
      <View className="p-4">
        <Pressable
          onPress={handleSubmit}
          disabled={rating === 0}
          className={`py-4 rounded-xl items-center justify-center ${
            rating === 0 ? 'bg-gray-300' : 'bg-green-mannwork'
          }`}
        >
          <Text className="text-white font-bold text-lg">
            Enviar calificación
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Review;