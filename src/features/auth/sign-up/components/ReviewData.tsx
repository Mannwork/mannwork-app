import { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { useUserDataSupabase } from "@/common/hooks/useUserDataSupabase";

import CustomInput from "@/common/components/CustomInput";
import useSupabaseStorage from "@/common/hooks/useSupabaseStorage";
import { useAuth } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import AuthButton from "../../components/AuthButton";
import { postCompleteUserData } from "../service/post-complete-data";
import { useAuthStore } from "../store/auth.store";
import { type NamesFields, namesScheme } from "../validators/names.validator";
import HeaderRegisterSteps from "./HeaderRegisterSteps";

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value?: string | number | null;
}) => {
    // Asegurarse de que el valor no sea null o undefined
    const displayValue = value != null ? String(value) : 'No especificado';
    
    return (
        <View className="flex-row items-center mb-4 border-b border-gray-200 pb-4">
            <Feather name={icon} size={24} color="#2D7A3E" />
            <View className="ml-4">
                <Text className="text-gray-500">{label}</Text>
                <Text className="text-lg font-semibold text-gray-800 capitalize">
                    {displayValue}
                </Text>
            </View>
        </View>
    );
};

const ReviewData = () => {
    const { userId } = useAuth();
    const { user, isLoading } = useUserDataSupabase();
    const queryClient = useQueryClient();
    const {
        setData,
        name,
        last_name,
        cel_phone,
        rol,
        profile_pic,
        ubication_json,
        service_radius,
        categories,
        selected_subcategories,
    } = useAuthStore();

    const { handleUploadImage, isLoading: isLoadingUploadImage } =
        useSupabaseStorage("profile-pics");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NamesFields>({
        resolver: zodResolver(namesScheme),
    });

    const registerNames = (data: NamesFields) => {
        setData("name", data.name);
        setData("last_name", data.last_name);
    };

    const { mutate: completeUserData, isPending: isLoadingCompleteData } =
        useMutation({
            mutationFn: () => {
                if (!userId) throw new Error("User ID is not available");
                return postCompleteUserData({
                    userId,
                    name,
                    last_name,
                    cel_phone,
                    rol,
                    profile_pic,
                    ubication_json,
                    service_radius,
                    categories,
                    selected_subcategories,
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["onboarding-status", userId],
                });
                router.replace("/(protected)/(mainTabs)/home");
            },
            onError: (error) => {
                console.log("Error en la mutación:", error);
            },
        });

    useEffect(() => {
        if (!isLoading && user) {
            setData("name", user.name ?? "");
            setData("last_name", user.last_name ?? "");
            setData("profile_pic", user.profile_pic ?? "");
        }
    }, [user, isLoading, setData]);

    const handleAddPhoto = async () => {
        const newImageUri = await handleUploadImage(userId as string);

        if (newImageUri) {
            setData("profile_pic", newImageUri);
        }
    };

    const fullAddress = ubication_json
        ? `${ubication_json.street}, ${ubication_json.city}, ${ubication_json.province}`
        : "No especificada";

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#2D7A3E" />
                <Text className="mt-4 text-lg text-gray-600">
                    Cargando tus datos...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white pt-14">
            <HeaderRegisterSteps />
            <View className="flex-1">
                <ScrollView 
                    className="px-6"
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                <View className="items-center py-6">
                    <View className="relative">
                        {isLoadingUploadImage ? (
                            <ActivityIndicator
                                size="large"
                                color="#2D7A3E"
                                style={{
                                    height: 128,
                                    width: 128,
                                    borderRadius: 100,
                                    marginBottom: 16,
                                    borderWidth: 4,
                                    borderColor: "#2D7A3E",
                                }}
                            />
                        ) : (
                            <Image
                                source={{ uri: profile_pic }}
                                placeholder={{
                                    blurhash: "L6Pj0^i_.AyE_3t7t7R**0o#DgR4",
                                }}
                                contentFit="cover"
                                transition={300}
                                onError={(error) =>
                                    console.log("Error al cargar la imagen:", error)
                                }
                                style={{
                                    height: 128,
                                    width: 128,
                                    borderRadius: 100,
                                    marginBottom: 16,
                                    borderWidth: 4,
                                    borderColor: "#2D7A3E",
                                }}
                            />
                        )}
                        <Pressable 
                            onPress={handleAddPhoto}
                            className="absolute -right-1 bottom-2 bg-white rounded-full p-2 border-2 border-green-mannwork"
                        >
                            <MaterialIcons
                                name="camera-alt"
                                size={20}
                                color="#2D7A3E"
                            />
                        </Pressable>
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mt-4">
                        {name} {last_name}
                    </Text>
                    <View className="bg-green-50 px-4 py-1 rounded-full mt-2 mb-6">
                        <Text className="text-sm text-green-700 font-medium capitalize">
                            {rol === "client" ? "Cliente" : "Profesional"}
                        </Text>
                    </View>
                </View>

                <View className="w-full mt-2 bg-white rounded-xl shadow-sm p-5 mb-6">
                    {name && last_name ? (
                        <InfoRow
                            icon="user"
                            label="Nombre completo"
                            value={`${name} ${last_name}`}
                        />
                    ) : (
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-500 mb-3">
                                Completa tus datos personales
                            </Text>
                            <View className="mb-3">
                                <CustomInput
                                    control={control}
                                    name="name"
                                    placeholder="Ingrese su nombre"
                                    autoFocus
                                    autoComplete="name"
                                    autoCapitalize="words"
                                />
                            </View>
                            {errors.name && (
                                <Text className="text-red-500 text-xs mb-3">
                                    {errors.name.message}
                                </Text>
                            )}
                            <View className="mb-4">
                                <CustomInput
                                    control={control}
                                    name="last_name"
                                    placeholder="Ingrese su apellido"
                                    autoComplete="additional-name"
                                    autoCapitalize="words"
                                />
                            </View>
                            {errors.last_name && (
                                <Text className="text-red-500 text-xs mb-3">
                                    {errors.last_name.message}
                                </Text>
                            )}
                            <AuthButton
                                onPress={handleSubmit(registerNames)}
                                className="bg-green-mannwork py-3"
                            >
                                <Text className="font-semibold text-white">
                                    Guardar cambios
                                </Text>
                            </AuthButton>
                        </View>
                    )}
                    
                    <View className="space-y-4 mt-2">
                        <InfoRow icon="phone" label="Teléfono Celular" value={cel_phone} />
                        <InfoRow icon="briefcase" label="Rol" value={rol === "client" ? "Cliente" : "Profesional"} />
                        <InfoRow icon="map-pin" label="Ubicación" value={fullAddress} />
                        {service_radius && (
                            <InfoRow
                                icon="compass"
                                label="Radio de servicio"
                                value={`${service_radius} km`}
                            />
                        )}
                    </View>
                </View>
                </ScrollView>
                
            
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
                    <AuthButton
                        className="bg-green-mannwork py-4 rounded-xl shadow-lg"
                        onPress={() => completeUserData()}
                    >
                        {isLoadingCompleteData ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                Completar Registro
                            </Text>
                        )}
                    </AuthButton>
                </View>
            </View>
        </View>
    );
};

export default ReviewData;
