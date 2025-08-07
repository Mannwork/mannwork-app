import { useState } from "react";
import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { postImageToSupabase } from "../services/post-image";
import { postImagesToSupabase } from "../services/post-images";

const useSupabaseStorage = (bucket: string) => {
    const [imagesUri, setImagesUri] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadImage = async (userId: string, chatId?: string) => {
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

            let fileExtension = imageUri.split(".").pop();
            if (
                fileExtension &&
                ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(
                    fileExtension.toLowerCase()
                )
            ) {
                fileExtension = fileExtension.toLowerCase();
            } else {
                fileExtension = "jpeg";
            }

            const fileName = `${userId}-${Date.now()}.${fileExtension}`;
            const storagePath = chatId
                ? `${chatId}/${userId}/${fileName}`
                : `${userId}/${fileName}`;

            try {
                setIsLoading(true);

                const newImgUri = await postImageToSupabase(
                    imageUri,
                    storagePath,
                    fileExtension,
                    bucket
                );

                return newImgUri;
            } catch (error) {
                console.log("Error al subir la imagen:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUploadImages = async (
        clientId: string,
        imagesUris: string[]
    ) => {
        const storagePathPrefix = clientId;

        try {
            setIsLoading(true);

            const uploadedImageUrls = await postImagesToSupabase(
                imagesUris,
                storagePathPrefix,
                bucket
            );

            setImagesUri(uploadedImageUrls);
            return uploadedImageUrls
        } catch (error) {
            console.log("Error al subir las imágenes:", error);
            Alert.alert("Error", "Ocurrió un problema al subir las imágenes.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleUploadImage,
        handleUploadImages,
        imagesUri,
        isLoading,
    };
};

export default useSupabaseStorage;
