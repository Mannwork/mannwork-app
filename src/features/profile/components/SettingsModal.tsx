import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
  onCustomerSupport?: () => void;
  onShare?: () => void;
  onAboutMannwork?: () => void;
}

const SettingsModal = ({
  visible,
  onClose,
  onEditProfile,
  onLogout,
  onCustomerSupport,
  onShare,
  onAboutMannwork,
}: SettingsModalProps) => {
  const insets = useSafeAreaInsets();

  const handleOptionPress = (action?: () => void) => {
    onClose();
    if (action) {
      action();
    }
  };

  const renderSettingsOption = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void
  ) => (
    <Pressable
      onPress={() => handleOptionPress(onPress)}
      className="flex-row items-center py-4 px-4 border-b border-gray-200"
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
        <MaterialIcons name={icon as any} size={20} color="#2D7A3E" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-medium text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header del modal */}
      <View className="flex-row items-center bg-green-mannwork justify-between px-4 py-4 border-b border-gray-200">
        <View className="flex-1" />
        <Text className="text-2xl font-bold text-white text-center">
          Configuración
        </Text>
        <View className="flex-1 items-end">
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#ffff" />
          </Pressable>
        </View>
      </View>

      {/* Contenido del modal */}
      <ScrollView className="flex-1">
        <View className="py-2">
          {/* Perfil */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm font-medium px-4 py-2 bg-gray-50">
              PERFIL
            </Text>
            {renderSettingsOption(
              "edit",
              "Editar perfil",
              "Modificar información personal",
              onEditProfile
            )}
            {renderSettingsOption(
              "notifications",
              "Notificaciones",
              "Configurar alertas y notificaciones"
            )}
            {renderSettingsOption(
              "security",
              "Privacidad y seguridad",
              "Configurar privacidad de la cuenta"
            )}
          </View>

          {/* Soporte */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm font-medium px-4 py-2 bg-gray-50">
              SOPORTE
            </Text>
            {renderSettingsOption(
              "support-agent",
              "Atención al cliente",
              "Contactar con soporte técnico",
              onCustomerSupport
            )}
            {renderSettingsOption(
              "help",
              "Centro de ayuda",
              "Preguntas frecuentes y tutoriales"
            )}
            {renderSettingsOption(
              "share",
              "Compartir aplicación",
              "Invitar amigos a usar Mannwork",
              onShare
            )}
          </View>

          {/* Información */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm font-medium px-4 py-2 bg-gray-50">
              INFORMACIÓN
            </Text>
            {renderSettingsOption(
              "info",
              "Acerca de Mannwork",
              "Información sobre la aplicación",
              onAboutMannwork
            )}
            {renderSettingsOption(
              "description",
              "Términos y condiciones",
              "Términos de uso y políticas"
            )}
            {renderSettingsOption(
              "privacy-tip",
              "Política de privacidad",
              "Cómo protegemos tus datos"
            )}
            {renderSettingsOption(
              "star",
              "Calificar aplicación",
              "Deja tu opinión en la tienda"
            )}
          </View>

          {/* Cuenta */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm font-medium px-4 py-2 bg-gray-50">
              CUENTA
            </Text>
            <Pressable
              onPress={() => handleOptionPress(onLogout)}
              className="flex-row items-center py-4 px-4 border-b border-gray-200"
            >
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                <MaterialIcons name="logout" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-red-600 font-medium text-base">
                  Cerrar sesión
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Salir de tu cuenta
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsModal;
