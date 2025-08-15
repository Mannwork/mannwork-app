import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose?: () => void;
  isVisible: boolean;
}

const alertStyles = {
  success: {
    container: "bg-green-mannwork-light shadow-lg",
    icon: "checkmark-circle",
    iconColor: "#2D7A3E", // Verde mannwork
    title: "¡Listo!",
    titleColor: "text-gray-900 font-bold text-xl mb-1",
    textColor: "text-gray-600 text-center text-base",
    button: "bg-green-mannwork-light border-[2px] border-green-mannwork"
  },
  error: {
    container: "bg-white shadow-lg",
    icon: "close-circle",
    iconColor: "#DC2626", // Rojo para errores
    title: "¡Error!",
    titleColor: "text-gray-900 font-bold text-xl mb-1",
    textColor: "text-gray-600 text-center text-base",
    button: "bg-red-600"
  },
  warning: {
    container: "bg-white shadow-lg",
    icon: "warning",
    iconColor: "#D97706", // Ámbar para advertencias
    title: "Atención",
    titleColor: "text-gray-900 font-bold text-xl mb-1",
    textColor: "text-gray-600 text-center text-base",
    button: "bg-amber-500"
  },
};

const Alert: React.FC<AlertProps> = ({ message, type, onClose, isVisible }) => {
  const styles = alertStyles[type];

  return (
    <Modal 
      transparent 
      visible={isVisible} 
      animationType="fade" 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6" style={{ zIndex: 9999 }}>
        <View className={`w-full max-w-xl border-[3px] border-green-mannwork rounded-3xl p-5 ${styles.container}`} style={{ elevation: 100 }}>
          <View className="items-center">
            {/* Ícono grande centrado */}
            <View className="mb-5">
              <Ionicons name={styles.icon as any} size={80} color={styles.iconColor} />
            </View>
            
            {/* Título */}
            <Text className={`${styles.titleColor} text-center`}>
              {styles.title || ''}
            </Text>
            
            {/* Mensaje */}
            <Text className={`${styles.textColor} mt-2`}>
              {message}
            </Text>
            
            {/* Botón de cierre */}
            {onClose && (
              <TouchableOpacity 
                onPress={onClose}
                className={`mt-6 ${styles.button} py-3 px-8 rounded-full w-full items-center`}
                activeOpacity={0.8}
              >
                <Text className="font-semibold text-base">Aceptar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
