import { Alert } from "react-native";
import ReactNativeBlobUtil from 'react-native-blob-util'; // Importa RNFetchBlob
import { supabase } from "../lib/supabase/supabaseClient";

export const postImageToSupabase = async (
    imageUri: string,
    storagePath: string,
    fileExtension: string
) => {
    try {
        const base64 = await ReactNativeBlobUtil.fs.readFile(imageUri, 'base64');

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Determinar el tipo MIME correcto
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        // Subir la imagen usando Uint8Array
        const { error } = await supabase.storage
            .from('profile-pics') // Asegúrate de que 'images' es tu bucket correcto
            .upload(storagePath, byteArray, { // Pasa el Uint8Array
                cacheControl: '3600',
                upsert: false,
                contentType: mimeType,
            });

        if (error) {
            console.error("Error al subir la imagen:", error);
            Alert.alert("Error", "No se pudo subir la imagen: " + error.message);
            return "";
        }

        const { data: publicUrlData } = supabase.storage
            .from('profile-pics') // Asegúrate de que 'images' es tu bucket correcto
            .getPublicUrl(storagePath);

        if (publicUrlData && publicUrlData.publicUrl) {
            return publicUrlData.publicUrl;
        } else {
            Alert.alert("Error", "No se pudo obtener la URL pública de la imagen.");
            return "";
        }
    } catch (uploadError: any) {
        console.error("Error en el proceso de subida:", uploadError);
        Alert.alert("Error Interno", "Ocurrió un problema al procesar la imagen: " + uploadError.message);
        return "";
    }
};