import SelectProfessionalCard from "@/features/create/components/SelectProfessionalCard";
import { useCreateRequest } from "@/features/requests/hooks/useCreateRequest";
import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const professionals = [
  {
    id: 1,
    name: "Juan Velasco",
    lastInitial: "V",
    rating: 4.2,
    reviews: 128,
    category: "Plomero, instalaciones",
    address: "Las Heras 1201, CABA, Argentina.",
    verified: true,
    premium: true,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  },
  {
    id: 2,
    name: "Daniel Nasta",
    lastInitial: "N",
    rating: 4.5,
    reviews: 52,
    category: "Empleado del hogar, Paseador de perros",
    address: "Agüero 1861, CABA, Argentina.",
    verified: false,
    premium: true,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  },
  {
    id: 3,
    name: "Enzo Dillmann",
    lastInitial: "D",
    rating: 4.5,
    reviews: 52,
    category: "Empleado del hogar, Paseador de perros",
    address: "Agüero 1861, CABA, Argentina.",
    verified: false,
    premium: true,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  },
  {
    id: 4,
    name: "Leo Messi",
    lastInitial: "M",
    rating: 4.5,
    reviews: 52,
    category: "Empleado del hogar, Paseador de perros",
    address: "Agüero 1861, CABA, Argentina.",
    verified: false,
    premium: true,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  },
  {
    id: 5,
    name: "Cristano Ronaldo",
    lastInitial: "R",
    rating: 4.5,
    reviews: 52,
    category: "Empleado del hogar, Paseador de perros",
    address: "Agüero 1861, CABA, Argentina.",
    verified: false,
    premium: true,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
  },
];

export default function SelectProfessionalsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const { createRequest, loading, error } = useCreateRequest();

  // Leer datos del formulario
  const formData = {
    title: params.title as string,
    description: params.description as string,
    category: params.category ? Number(params.category) : undefined,
    subcategory: params.subcategory as string,
    locationData: params.locationData
      ? JSON.parse(params.locationData as string)
      : null,
    images: params.images ? JSON.parse(params.images as string) : [],
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSend = async () => {
    if (selectedIds.length === 0 || loading) return;
    if (!user?.id || !formData.category) return;
    const success = await createRequest({
      name: formData.title,
      description: formData.description,
      location: formData.locationData,
      photos: formData.images,
      client: user.id,
      professionals: selectedIds,
      category: formData.category,
      subCategory: formData.subcategory,
    });
    if (success) {
      router.push("/(protected)/(mainTabs)/home/request-sent");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-green-mannwork px-4 py-4"
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="w-6">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white">
            Selecciona profesionales (máx. 4)
          </Text>
          <View className="w-6" />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {professionals.map((prof) => (
          <SelectProfessionalCard
            key={prof.id}
            professional={prof}
            selected={selectedIds.includes(prof.id.toString())}
            onSelect={() => handleSelect(prof.id.toString())}
          />
        ))}
      </ScrollView>
      <View className="absolute bg-red-5 left-0 right-0 bottom-0 px-6 pb-6">
        <View className="absolute left-0 right-0 bottom-0 top-0 bg-white z-0" />
        <Pressable
          className={`rounded-xl py-3 mt-4 items-center justify-center shadow-lg ${
            selectedIds.length === 0 ? "bg-gray-300" : "bg-green-mannwork"
          } z-10`}
          onPress={handleSend}
          style={{
            elevation: 8,
            opacity: selectedIds.length === 0 || loading ? 0.6 : 1,
          }}
          disabled={selectedIds.length === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Enviar solicitud
            </Text>
          )}
        </Pressable>
        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}
      </View>
    </View>
  );
}
