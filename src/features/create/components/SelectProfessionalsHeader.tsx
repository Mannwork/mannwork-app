import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SelectProfessionalsHeaderProps {
    onBack: () => void;
    onMapPress: () => void;
    isMapDisabled: boolean;
}

export default function SelectProfessionalsHeader({
    onBack,
    onMapPress,
    isMapDisabled,
}: SelectProfessionalsHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="bg-green-mannwork px-4 py-4"
        >
            <View className="flex-row items-center justify-between">
                <Pressable onPress={onBack} className="w-6">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text className="text-xl font-bold text-white">
                    Selecciona profesionales (máx. 4)
                </Text>
                <Pressable
                    onPress={onMapPress}
                    className="w-6"
                    disabled={isMapDisabled}
                >
                    {!isMapDisabled && (
                        <MaterialIcons name="map" size={24} color="white" />
                    )}
                </Pressable>
            </View>
        </View>
    );
}
