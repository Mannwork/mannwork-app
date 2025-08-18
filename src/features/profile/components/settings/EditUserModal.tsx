import useSupabaseStorage from "@/common/hooks/useSupabaseStorage";
import { useAlertStore } from "@/common/store/alert.store";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useProfessionsStore } from "../../store/professions.store";

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditUserModal = ({ visible, onClose }: EditUserModalProps) => {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [profilePic, setProfilePic] = useState(user?.profile_pic || "");
  const [serviceRadius, setServiceRadius] = useState(
    user?.service_radius || 15
  );
  const { show } = useAlertStore();

  const { userId } = useAuth();

  const { handleUploadImage, isLoading: isLoadingUploadImage } =
    useSupabaseStorage("profile-pics");

  // Store global para profesiones
  const professions = useProfessionsStore((state) => state.professions);
  const setProfessions = useProfessionsStore((state) => state.setProfessions);

  // Inicializa el store con las profesiones del usuario al abrir el modal
  useEffect(() => {
    if (visible && user?.professions) {
      setProfessions(user.professions);
    }
  }, [visible, user?.professions, setProfessions]);

  const isProfessional = user?.rol === "professional";

  const handleSave = () => {
    if (!name.trim() || !lastName.trim()) {
      show("El nombre y apellido son obligatorios", "error");
      return;
    }

    const updateData: any = {
      name: name.trim(),
      last_name: lastName.trim(),
      profile_pic: profilePic,
      description: description.trim(),
      service_radius: isProfessional ? Number(serviceRadius) : undefined,
    };

    if (isProfessional) {
      updateData.professions = professions;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        show("Perfil actualizado correctamente", "success");
        onClose();
      },
      onError: (error) => {
        show("No se pudo actualizar el perfil", "error");
        console.error("Error updating profile:", error);
        onClose();
      },
    });
  };

  const handleAddPhoto = async () => {
    const newImageUri = await handleUploadImage(userId as string);
    if (newImageUri) {
      setProfilePic(newImageUri);
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
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
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
          <Pressable
            onPress={handleAddPhoto}
            className="relative disabled:opacity-50"
            disabled={isLoadingUploadImage}
          >
            {isLoadingUploadImage ? (
              <ActivityIndicator
                size="small"
                color="#2D7A3E"
                className="w-24 h-24 rounded-full"
              />
            ) : profilePic ? (
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
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 pr-2"
          placeholder="Nombre"
          value={name}
          onChangeText={(text) => {
            if (text.length <= 50) {
              setName(text);
            }
          }}
          maxLength={30}
          style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
        />
        <Text className="text-xs text-gray-500 mb-4 mt-2 text-left ml-2">
          {name.length}/30 caracteres
        </Text>

        {/* Apellido */}
        <Text className="text-base font-bold text-gray-800 mb-2">Apellido</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 pr-2"
          placeholder="Apellido"
          value={lastName}
          onChangeText={(text) => {
            if (text.length <= 50) {
              setLastName(text);
            }
          }}
          maxLength={30}
          style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
        />
        <Text className="text-xs text-gray-500 mb-4 mt-2 text-left ml-2">
          {lastName.length}/30 caracteres
        </Text>

        {/* Descripción */}
        <Text className="text-base font-bold text-gray-800 mb-2">
          Descripción
        </Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 min-h-[100px] pr-2"
          placeholder="Cuéntanos sobre ti..."
          value={description}
          onChangeText={(text) => {
            if (text.length <= 500) {
              setDescription(text);
            }
          }}
          maxLength={250}
          multiline
          textAlignVertical="top"
          style={{ lineHeight: 22 }}
        />
        <Text className="text-xs text-gray-500 mb-4 mt-2 text-left ml-2">
          {description.length}/250 caracteres
        </Text>

        {/* Profesiones (solo para profesionales) */}
        {isProfessional && (
          <View className="mb-4">
            {/* Radio de cobertura */}
            <Text className="text-base font-bold text-gray-800 mb-2">
              Radio de cobertura (km)
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200 mb-4"
              placeholder="Ej: 15"
              value={String(serviceRadius)}
              onChangeText={(text) =>
                setServiceRadius(Number(text.replace(/[^0-9]/g, "")))
              }
              keyboardType="numeric"
              style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
            />
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
            <Text className="text-base font-bold text-gray-800 mb-3 mt-6">
              Ubicacion
            </Text>
            <Pressable
              onPress={() =>
                router.push(
                  "/(protected)/(mainTabs)/profile/update-ubication-modal"
                )
              }
              className="bg-green-mannwork py-3 px-4 rounded-xl"
            >
              <Text className="text-white text-base font-semibold text-center">
                Editar ubicacion
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
