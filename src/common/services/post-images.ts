import { Alert } from "react-native";

import { supabase } from "../lib/supabase/supabaseClient";

export const postImageToSupabase = async (imageUri: string, storagePath: string, fileExtension: string) => {
        try {
            // Fetch the image URI as a Blob
            const response = await fetch(imageUri);
            console.log("xd", response);
            
            const blob = await response.blob();

            // --- Paso 2: Subir el Blob a Supabase Storage ---
            const { error } = await supabase.storage.from('images').upload(storagePath, blob, {
                    cacheControl: '3600', // Cache por una hora
                    upsert: false, // No sobrescribir si ya existe un archivo con ese nombre
                    contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}` // Define el tipo MIME correctamente
                });

            if (error) {
                console.error("Error al subir la imagen:", error);
                Alert.alert("Error", "No se pudo subir la imagen: " + error.message);
                return "";
            }

            // --- Paso 3: Obtener la URL pública de la imagen ---
            // Supabase ya te devuelve la URL pública si el bucket es público
            // O puedes generarla con .getPublicUrl()
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(storagePath);

            if (publicUrlData && publicUrlData.publicUrl) {
                console.log("Imagen subida y URL pública:", publicUrlData.publicUrl);

                return publicUrlData.publicUrl;
            } else {
                Alert.alert("Error", "No se pudo obtener la URL pública de la imagen.");
            }
        } catch (uploadError: any) {
            console.error("Error en el proceso de subida:", uploadError);
            Alert.alert("Error Interno", "Ocurrió un problema al procesar la imagen: " + uploadError.message);
        }
}