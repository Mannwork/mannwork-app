import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useProfessionsStore } from "../store/professions.store";

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditUserModal = ({ visible, onClose }: EditUserModalProps) => {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [profilePic, setProfilePic] = useState(user?.profile_pic || "");

  // Store global para profesiones
  const professions = useProfessionsStore((state) => state.professions);
  const setProfessions = useProfessionsStore((state) => state.setProfessions);
  const resetProfessions = useProfessionsStore(
    (state) => state.resetProfessions
  );

  // Inicializa el store con las profesiones del usuario al abrir el modal
  useEffect(() => {
    if (visible && user?.professions) {
      setProfessions(user.professions);
    }
    // No reseteo el store aquí para no perder los cambios hechos en el modal de oficios
    // if (!visible) {
    //   resetProfessions();
    // }
  }, [visible, user?.professions]);

  const isProfessional = user?.rol === "professional";

  const handleSave = () => {
    if (!name.trim() || !lastName.trim()) {
      Alert.alert("Error", "El nombre y apellido son obligatorios");
      return;
    }

    const updateData: any = {
      name: name.trim(),
      last_name: lastName.trim(),
      profile_pic: profilePic,
      description: description.trim(),
    };

    if (isProfessional) {
      updateData.professions = professions;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        onClose();
      },
      onError: (error) => {
        Alert.alert("Error", "No se pudo actualizar el perfil");
        console.error("Error updating profile:", error);
      },
    });
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permisos", "Necesitamos acceso a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2D7A3E" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-green-mannwork px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={onClose} className="w-6">
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white">Editar perfil</Text>
          <Pressable onPress={handleSave} disabled={isPending} className="w-6">
            {isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <MaterialIcons name="check" size={24} color="white" />
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Foto de perfil */}
        <View className="items-center py-6">
          <Pressable onPress={handleAddPhoto} className="relative">
            {profilePic ? (
              <Image
                source={{ uri: profilePic }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
                <MaterialIcons name="person" size={48} color="#9CA3AF" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-green-mannwork rounded-full p-2">
              <MaterialIcons name="camera-alt" size={16} color="white" />
            </View>
          </Pressable>
          <Text className="text-sm text-gray-500 mt-2">
            Toca para cambiar foto
          </Text>
        </View>

        {/* Nombre */}
        <Text className="text-base font-bold text-gray-800 mb-2">Nombre</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 mb-4"
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
        />

        {/* Apellido */}
        <Text className="text-base font-bold text-gray-800 mb-2">Apellido</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 mb-4"
          placeholder="Tu apellido"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Descripción */}
        <Text className="text-base font-bold text-gray-800 mb-2">
          Descripción
        </Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 mb-4 min-h-[100px]"
          placeholder="Cuéntanos sobre ti..."
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        {/* Profesiones (solo para profesionales) */}
        {isProfessional && (
          <View className="mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Profesiones
            </Text>
            <Pressable
              onPress={() =>
                router.push(
                  "/(protected)/(mainTabs)/profile/modal-professions-edit"
                )
              }
              className="bg-green-mannwork py-3 px-4 rounded-xl"
            >
              <Text className="text-white text-base font-semibold text-center">
                Editar oficios
              </Text>
            </Pressable>
          </View>
        )}

        {/* Botón guardar */}
        <Pressable
          className={`rounded-xl py-4 mt-6 ${
            isPending ? "bg-gray-300" : "bg-green-mannwork"
          }`}
          onPress={handleSave}
          disabled={isPending}
        >
          <Text
            className={`text-center font-bold text-lg ${
              isPending ? "text-gray-500" : "text-white"
            }`}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default EditUserModal;
