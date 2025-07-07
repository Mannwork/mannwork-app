import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import LocationPickerModal from "./LocationPickerModal";

interface CreateRequestModalProps {
  category: string;
  subcategory: string;
  icon?: string;
}

const CreateRequestModal = (props: CreateRequestModalProps) => {
  // Permitir recibir por props o por ruta
  const params = useLocalSearchParams();
  const category = props.category || params.category;
  const subcategory = props.subcategory || params.subcategory;
  const icon = props.icon || params.icon;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const { showActionSheetWithOptions } = useActionSheet();
  const [isImagePickerPending, setIsImagePickerPending] = useState(false);

  // Estados para validaciones
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    location?: string;
  }>({});

  const TITLE_MAX_LENGTH = 60;
  const DESCRIPTION_MAX_LENGTH = 500;

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validar título
    if (!title.trim()) {
      newErrors.title = "El título es obligatorio";
    } else if (title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `El título no puede tener más de ${TITLE_MAX_LENGTH} caracteres`;
    }

    // Validar descripción
    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `La descripción no puede tener más de ${DESCRIPTION_MAX_LENGTH} caracteres`;
    }

    // Validar ubicación
    if (!locationData?.address) {
      newErrors.location = "La ubicación es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log("Intentando ir hacia adelante...");
    if (validateForm()) {
      console.log("Formulario válido, navegando...");
      router.replace({
        pathname: "/(protected)/(mainTabs)/home/select-professionals",
        params: {
          category: category || "",
          subcategory: subcategory || "",
          title,
          description,
          location,
          locationData: locationData ? JSON.stringify(locationData) : "",
          images: images.length > 0 ? JSON.stringify(images) : "",
        },
      });
    } else {
      console.log("Formulario inválido");
    }
  };

  const isFormValid = () => {
    return (
      title.trim().length > 0 &&
      title.length <= TITLE_MAX_LENGTH &&
      description.trim().length > 0 &&
      description.length <= DESCRIPTION_MAX_LENGTH &&
      locationData?.address
    );
  };

  const handleBack = () => {
    console.log("Intentando ir hacia atrás...");
    router.push("/(protected)/(mainTabs)/home");
  };

  const handleAddPhoto = async () => {
    if (showLocationModal) {
      setShowLocationModal(false);
      setIsImagePickerPending(true);
      setTimeout(() => {
        setIsImagePickerPending(false);
        showActionSheetWithOptions(
          {
            options: ["Tomar foto", "Elegir de la galería", "Cancelar"],
            cancelButtonIndex: 2,
          },
          async (selectedIndex: number | undefined) => {
            if (selectedIndex === 0) {
              // Tomar foto
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                quality: 0.7,
              });
              if (
                !result.canceled &&
                result.assets &&
                result.assets.length > 0
              ) {
                setImages((prev) => [...prev, result.assets[0].uri]);
              }
            } else if (selectedIndex === 1) {
              // Elegir de la galería
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.7,
              });
              if (
                !result.canceled &&
                result.assets &&
                result.assets.length > 0
              ) {
                setImages((prev) => [
                  ...prev,
                  ...result.assets.map((a) => a.uri),
                ]);
              }
            }
          }
        );
      }, 200);
      return;
    }
    showActionSheetWithOptions(
      {
        options: ["Tomar foto", "Elegir de la galería", "Cancelar"],
        cancelButtonIndex: 2,
      },
      async (selectedIndex: number | undefined) => {
        if (selectedIndex === 0) {
          // Tomar foto
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 0.7,
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setImages((prev) => [...prev, result.assets[0].uri]);
          }
        } else if (selectedIndex === 1) {
          // Elegir de la galería
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.7,
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
          }
        }
      }
    );
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
          <View className="w-6" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Category Info */}
        <View className="items-center py-6">
          <View className="bg-green-mannwork-light rounded-full p-4 mb-3">
            <MaterialIcons
              name={(icon as any) || "category"}
              size={32}
              color="#2D7A3E"
            />
          </View>
          <Text className="text-xl font-bold text-green-mannwork mb-1">
            {category}
          </Text>
          <Text className="text-base text-gray-600">{subcategory}</Text>
        </View>

        {/* Título */}
        <Text className="text-base font-bold text-gray-800 mb-2">Título</Text>
        <TextInput
          className={`bg-gray-50 rounded-xl px-4 py-3 text-base border ${
            errors.title ? "border-red-500" : "border-gray-200"
          } mb-1`}
          placeholder="Dale un nombre a tu solicitud"
          placeholderTextColor="#BDBDBD"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          maxLength={TITLE_MAX_LENGTH}
        />
        <View className="flex-row justify-between items-center mb-4">
          {errors.title && (
            <Text className="text-xs text-red-500">{errors.title}</Text>
          )}
          <Text className="text-xs text-gray-400">
            {title.length}/{TITLE_MAX_LENGTH} caracteres
          </Text>
        </View>

        {/* Descripción */}
        <Text className="text-base font-bold text-gray-800 mb-2">
          ¿Qué necesitás?
        </Text>
        <TextInput
          className={`bg-gray-50 rounded-xl px-4 py-3 text-base border ${
            errors.description ? "border-red-500" : "border-gray-200"
          } mb-1 min-h-[100px]`}
          placeholder="Contanos en detalle qué necesitás"
          placeholderTextColor="#BDBDBD"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          maxLength={DESCRIPTION_MAX_LENGTH}
        />
        <View className="flex-row justify-between items-center mb-4">
          {errors.description && (
            <Text className="text-xs text-red-500">{errors.description}</Text>
          )}
          <Text className="text-xs text-gray-400">
            {description.length}/{DESCRIPTION_MAX_LENGTH} caracteres
          </Text>
        </View>

        {/* Ubicación */}
        <Text className="text-base font-bold text-gray-800 mb-2 flex-row items-center">
          <MaterialIcons name="location-on" size={20} color="#2D7A3E" /> ¿Dónde
          lo necesitás?
        </Text>
        <Text className="text-xs text-gray-400 mb-2">
          La dirección es necesaria para buscar profesionales en la zona. No
          compartimos tu información con nadie.
        </Text>
        <Pressable
          className={`border rounded-xl py-3 items-center mb-1 ${
            errors.location ? "border-red-500" : "border-green-mannwork"
          }`}
          onPress={() => {
            if (!isImagePickerPending) {
              setShowLocationModal(true);
              if (errors.location) {
                setErrors((prev) => ({ ...prev, location: undefined }));
              }
            }
          }}
        >
          <Text className="text-green-mannwork font-bold">
            {locationData?.address
              ? locationData.address
              : "Agregar ubicación del trabajo"}
          </Text>
        </Pressable>
        {errors.location && (
          <Text className="text-xs text-red-500 mb-4">{errors.location}</Text>
        )}
        {showLocationModal && (
          <LocationPickerModal
            visible={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            onLocationSelected={(loc) => {
              setLocationData(loc);
              setShowLocationModal(false);
            }}
          />
        )}

        {/* Fotos del trabajo */}
        <Text className="text-base font-bold text-gray-800 mb-2 flex-row items-center">
          <MaterialIcons name="photo-camera" size={20} color="#2D7A3E" /> Fotos
          del trabajo
        </Text>
        <Text className="text-xs text-gray-400 mb-2">
          Podés sacar fotos o subir imágenes de tu galería. Esto ayudará a los
          profesionales a entender qué necesitás
        </Text>
        <Pressable
          className="border border-green-mannwork rounded-xl py-3 items-center mb-4"
          onPress={handleAddPhoto}
        >
          <Text className="text-green-mannwork font-bold">Agregar foto</Text>
        </Pressable>
        {images.length > 0 && (
          <View className="flex-row flex-wrap mb-8">
            {images.map((uri, idx) => (
              <View
                key={uri + idx}
                style={{
                  position: "relative",
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Image
                  source={{ uri }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                />
                <Pressable
                  onPress={() =>
                    setImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "#EF4444", // rojo
                    borderRadius: 9999,
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#fff",
                    elevation: 2,
                    zIndex: 10,
                  }}
                >
                  <MaterialIcons name="remove" size={20} color="#fff" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Botón Siguiente */}
        <Pressable
          className={`rounded-xl py-4 ${
            isFormValid() ? "bg-green-mannwork" : "bg-gray-300"
          }`}
          onPress={handleNext}
          disabled={!isFormValid()}
        >
          <Text
            className={`text-center font-bold text-lg ${
              isFormValid() ? "text-white" : "text-gray-500"
            }`}
          >
            Siguiente
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CreateRequestModal;
