import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface ConfirmExitModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfirmExitModal = ({ isVisible, onClose }: ConfirmExitModalProps) => {
  if (!isVisible) return null;

  const handleExit = () => {
    onClose();
    router.replace("/(protected)/(mainTabs)/home");
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center">
      <View className="bg-white rounded-2xl w-[90%] max-w-[400px] p-6">
        <Text className="text-xl font-bold text-center mb-4">
          ¿Estás seguro que deseas cancelar la solicitud?
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8">
          Si continúas, perderás toda la información ingresada.
        </Text>

        <View className="flex-col gap-y-4 justify-between w-full">
          <Pressable
            onPress={handleExit}
            className="bg-green-mannwork rounded-lg py-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              Sí, quiero salir
            </Text>
          </Pressable>

          <Pressable onPress={onClose} className="bg-gray-200 rounded-lg py-4">
            <Text className="text-gray-700 text-center font-semibold text-base">
              No, continuar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConfirmExitModal;
