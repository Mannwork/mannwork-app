import { useState } from "react";
import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { postImageToSupabase } from "../services/post-images";

const useSupabaseStorage = () => {
    const [imgUri, setImgUri] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadImage = async (userId: string) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permisos",
                "Necesitamos acceso a tu galería para subir fotos."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], // Usar MediaTypeOptions.Images
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;

            // --- Paso 1: Obtener el archivo como Blob ---
            let fileExtension = imageUri.split(".").pop();
            if (
                fileExtension &&
                ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(
                    fileExtension.toLowerCase()
                )
            ) {
                fileExtension = fileExtension.toLowerCase();
            } else {
                // Si la extensión no es reconocida, podrías forzarla o manejar el error
                fileExtension = "jpeg"; // Default a jpeg si no se puede determinar
            }

            const fileName = `${userId}-${Date.now()}.${fileExtension}`; // Nombre único para el archivo
            const storagePath = `${userId}/${fileName}`; // Ruta dentro de tu bucket

            try {
                setIsLoading(true);

                const imgUri = await postImageToSupabase(
                    imageUri,
                    storagePath,
                    fileExtension
                );

                setImgUri(imgUri as string);
            } catch (error) {
                console.log("Error al subir la imagen:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return {
        handleUploadImage,
        imgUri,
        isLoading,
    };
};

export default useSupabaseStorage;
