import { Alert } from "react-native";
import ReactNativeBlobUtil from 'react-native-blob-util'; // Importa RNFetchBlob
import { supabase } from "../lib/supabase/supabaseClient";

export const postImagesToSupabase = async (
    imageUris: string[],
    storagePathPrefix: string,
    bucket: string
): Promise<string[]> => {
    try {
        const uploadPromises = imageUris.map(async (imageUri, index) => {
            const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
            const storagePath = `${storagePathPrefix}/${Date.now()}_${index}.${fileExtension}`;

            const path = imageUri.replace('file://', '');

            const base64 = await ReactNativeBlobUtil.fs.readFile(path, 'base64');

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(storagePath, byteArray, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: mimeType,
                });

            if (uploadError) {
                console.error(`Error al subir la imagen ${imageUri}:`, uploadError);
                throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(storagePath);

            if (publicUrlData && publicUrlData.publicUrl) {
                return publicUrlData.publicUrl;
            } else {
                throw new Error(`No se pudo obtener la URL pública para la imagen ${imageUri}.`);
            }
        });

        const publicUrls = await Promise.all(uploadPromises);
        
        return publicUrls;
    } catch (error: any) {
        console.error("Error en el proceso de subida de imágenes:", error);
        Alert.alert("Error", `Ocurrió un problema al subir las imágenes: ${error.message}`);
        return [];
    }
};