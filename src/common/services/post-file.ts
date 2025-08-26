import { Alert } from "react-native";
import ReactNativeBlobUtil from 'react-native-blob-util';
import { supabase } from "../lib/supabase/supabaseClient";

export const postFileToSupabase = async (
  fileUri: string,
  storagePath: string,
  mimeType: string, // Ahora pasamos el mimeType, que ya se obtiene del DocumentPicker
  bucket: string
) => {
  try {
    const path = fileUri.replace('file://', '');

    const base64 = await ReactNativeBlobUtil.fs.readFile(path, 'base64');

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Subir el archivo usando Uint8Array
    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, byteArray, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType, // Usamos el mimeType que viene del DocumentPicker
      });

    if (error) {
      console.error("Error al subir el archivo:", error);
      Alert.alert("Error", "No se pudo subir el archivo: " + error.message);
      return "";
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl;
    } else {
      Alert.alert("Error", "No se pudo obtener la URL pública del archivo.");
      return "";
    }
  } catch (uploadError: any) {
    console.error("Error en el proceso de subida:", uploadError);
    Alert.alert("Error Interno", "Ocurrió un problema al procesar el archivo: " + uploadError.message);
    return "";
  }
};