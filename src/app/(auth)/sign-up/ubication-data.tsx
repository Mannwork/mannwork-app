import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";
import { Ubication } from "@/common/types/ubication.interface";
import UbicationData from "@/features/auth/sign-up/components/UbicationData";
import { useAuthStore } from "@/features/auth/sign-up/store/auth.store";
import { router } from "expo-router";
import { Alert } from "react-native";

const UbicationDataScreen = () => {
    const { rol, setData } = useAuthStore();

    const onSubmit = (data: Ubication & { serviceRange?: number }) => {
        console.log(data);
        const { serviceRange, ...ubicationData } = data;

        setData("ubication_json", JSON.stringify(ubicationData) as any);
        if (serviceRange && rol === "professional") {
            setData("service_radius", serviceRange as any);
        }

        Alert.alert(
            "Ubicación guardada",
            "Tu ubicación ha sido guardada correctamente.",
            [
                {
                    text: "OK",
                    onPress: () => router.push("/(auth)/sign-up/review"),
                },
            ]
        );
    };

    // FIX: El rol no se setea a tiempo, por lo que el componente no se renderiza.
    // Para probar, se hardcodea el rol a 'professional'
    const finalRole = rol ?? "professional";

    return (
        <MyKeyboardAvoidingView>
            {finalRole && (
                <UbicationData role={finalRole} onSubmit={onSubmit} />
            )}
        </MyKeyboardAvoidingView>
    );
};

export default UbicationDataScreen;
