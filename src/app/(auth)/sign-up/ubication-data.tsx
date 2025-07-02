import { router } from "expo-router";

import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";
import { Ubication } from "@/common/types/ubication.interface";

import UbicationData from "@/features/auth/sign-up/components/UbicationData";
import { useAuthStore } from "@/features/auth/sign-up/store/auth.store";

const UbicationDataScreen = () => {
    const { rol, setData } = useAuthStore();

    const onSubmit = (data: Ubication & { serviceRange?: number }) => {
        const { serviceRange, ...ubicationData } = data;

        setData("ubication_json", ubicationData as any);
        if (serviceRange && rol === "professional") {
            setData("service_radius", serviceRange as any);
        }

        router.push("/(auth)/sign-up/review");
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
