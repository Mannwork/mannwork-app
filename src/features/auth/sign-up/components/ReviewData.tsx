import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import MyView from "@/common/components/MyView";
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

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value?: string | number | null;
}) => (
    <View className="flex-row items-center mb-4 border-b border-gray-200 pb-4">
        <Feather name={icon} size={24} color="#2D7A3E" />
        <View className="ml-4">
            <Text className="text-gray-500">{label}</Text>
            <Text className="text-lg font-semibold text-gray-800 capitalize">
                {value}
            </Text>
        </View>
    </View>
);

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

    const {
        handleUploadImage,
        imgUri,
        isLoading: isLoadingUploadImage,
    } = useSupabaseStorage();

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
        await handleUploadImage(userId as string).then(() =>
            setData("profile_pic", imgUri)
        );
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
        <MyView className="p-6">
            <View className="items-center mb-8">
                <View>
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
                    <Pressable onPress={handleAddPhoto}>
                        <MaterialIcons
                            name="camera-alt"
                            size={24}
                            color="#2D7A3E"
                            className="absolute bottom-4 right-2 border border-green-mannwork rounded-full p-1 bg-white"
                        />
                    </Pressable>
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                    {name} {last_name}
                </Text>
                <Text className="text-md text-green-mannwork font-semibold capitalize">
                    {rol === "client" ? "Cliente" : "Profesional"}
                </Text>
            </View>

            {name && last_name ? (
                <InfoRow
                    icon="user"
                    label="Nombre completo"
                    value={`${name} ${last_name}`}
                />
            ) : (
                <View className="mb-8">
                    <CustomInput
                        control={control}
                        name="name"
                        placeholder="Ingrese su nombre"
                        autoFocus
                        autoComplete="name"
                        autoCapitalize="words"
                    />
                    {errors.name && (
                        <Text style={{ color: "crimson" }}>
                            {errors.name.message}
                        </Text>
                    )}
                    <CustomInput
                        control={control}
                        name="last_name"
                        placeholder="Ingrese su apellido"
                        autoFocus
                        autoComplete="additional-name"
                        autoCapitalize="words"
                    />
                    {errors.last_name && (
                        <Text style={{ color: "crimson" }}>
                            {errors.last_name.message}
                        </Text>
                    )}
                    <AuthButton
                        onPress={handleSubmit(registerNames)}
                        className="bg-green-mannwork"
                    >
                        <Text className="font-semibold text-background-white">
                            Guardar
                        </Text>
                    </AuthButton>
                </View>
            )}
            <InfoRow icon="phone" label="Teléfono Celular" value={cel_phone} />
            <InfoRow icon="briefcase" label="Rol" value={rol} />
            <InfoRow icon="map-pin" label="Ubicación" value={fullAddress} />
            {service_radius && (
                <InfoRow
                    icon="compass"
                    label="Radio de servicio (km)"
                    value={`${service_radius} km`}
                />
            )}

            <View className="mt-auto">
                <AuthButton
                    className="mt-4 bg-green-mannwork"
                    onPress={() => completeUserData()}
                >
                    {isLoadingCompleteData ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text className="font-semibold text-background-white">
                            Completar Registro
                        </Text>
                    )}
                </AuthButton>
            </View>
        </MyView>
    );
};

export default ReviewData;
