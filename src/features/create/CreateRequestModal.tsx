import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import ConfirmExitModal from "./components/ConfirmExitModal";

interface CreateRequestModalProps {
  category: string;
  subcategory: string;
}

const CreateRequestModal = ({
  category,
  subcategory,
}: CreateRequestModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);

  const handleBack = () => {
    router.push("/(protected)/(mainTabs)/home/search-modal");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-green-mannwork px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="w-6">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white">Nueva solicitud</Text>
          <Pressable onPress={() => setShowExitModal(true)} className="w-6">
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Category Info */}
        <View className="items-center py-6">
          <View className="bg-green-mannwork-light rounded-full p-4 mb-3">
            <MaterialIcons name="category" size={32} color="#2D7A3E" />
          </View>
          <Text className="text-xl font-bold text-green-mannwork mb-1">
            {category}
          </Text>
          <Text className="text-base text-gray-600">{subcategory}</Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Title */}
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Título
            </Text>
            <TextInput
              className="bg-gray-50 rounded-lg px-4 py-3 text-base"
              placeholder="Ej: Necesito un paseador de perros"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Descripción
            </Text>
            <TextInput
              className="bg-gray-50 rounded-lg px-4 py-3 text-base min-h-[100px]"
              placeholder="Describe lo que necesitas..."
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Location */}
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">
              ¿Dónde lo necesitas?
            </Text>
            <Pressable
              className="bg-gray-50 rounded-lg px-4 py-3 flex-row items-center"
              onPress={() => {
                /* TODO: Implementar selección de ubicación */
              }}
            >
              <MaterialIcons name="location-on" size={24} color="#2D7A3E" />
              <Text className="text-base text-gray-500 ml-2">
                {location || "Seleccionar ubicación"}
              </Text>
            </Pressable>
          </View>

          {/* Photos */}
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Fotos del trabajo
            </Text>
            <Pressable
              className="bg-gray-50 rounded-lg px-4 py-3 flex-row items-center"
              onPress={() => {
                /* TODO: Implementar selección de fotos */
              }}
            >
              <MaterialIcons
                name="add-photo-alternate"
                size={24}
                color="#2D7A3E"
              />
              <Text className="text-base text-gray-500 ml-2">
                Agregar fotos
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Next Button */}
        <Pressable
          className="bg-green-mannwork rounded-lg py-4 mt-6 mb-8"
          onPress={() => {
            /* TODO: Implementar siguiente paso */
          }}
        >
          <Text className="text-white text-center font-bold text-lg">
            Siguiente
          </Text>
        </Pressable>
      </ScrollView>

      {/* Exit Confirmation Modal */}
      <ConfirmExitModal
        isVisible={showExitModal}
        onClose={() => setShowExitModal(false)}
      />
    </View>
  );
};

export default CreateRequestModal;
