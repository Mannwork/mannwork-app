import { useState } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { postFileToSupabase } from "../services/post-file";
import { postImageToSupabase } from "../services/post-image";
import { postImagesToSupabase } from "../services/post-images";

const useSupabaseStorage = (bucket: string) => {
    const [imagesUri, setImagesUri] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadImage = async (userId: string, chatId?: string) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            console.error(
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
            return uploadedImageUrls;
        } catch (error) {
            console.log("Error al subir las imágenes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadDocument = async (userId: string, chatId: string) => {
        try {
            setIsLoading(true);

            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
                copyToCacheDirectory: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const documentUri = result.assets[0].uri;
                const fileName = result.assets[0].name;
                const fileType = result.assets[0].mimeType;

                const storagePath = chatId
                    ? `${chatId}/${userId}/files/${fileName}`
                    : `${userId}/files/${fileName}`;

                const newFileUrl = await postFileToSupabase(
                    documentUri,
                    storagePath,
                    fileType as string,
                    bucket
                );

                return newFileUrl;
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleUploadImage,
        handleUploadImages,
        handleUploadDocument,
        imagesUri,
        isLoading,
    };
};

export default useSupabaseStorage;
