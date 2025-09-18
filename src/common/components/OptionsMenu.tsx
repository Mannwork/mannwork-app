import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface MenuAction {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isDestructive?: boolean;
}

interface OptionsMenuProps {
  isVisible: boolean;
  onClose: () => void;
  actions: MenuAction[];
  title?: string;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isVisible,
  onClose,
  actions,
  title,
}) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center p-6"
      >
        <Pressable className="bg-green-mannwork-light rounded-2xl w-full max-w-md shadow-xl">
          {title && (
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center text-gray-800">
                {title}
              </Text>
            </View>
          )}

          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                action.onPress();
                onClose();
              }}
              className="flex-row items-center p-4 border-b border-gray-200"
              activeOpacity={0.7}
            >
              {action.icon && (
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={action.isDestructive ? "#DC2626" : "#4B5563"}
                  className="mr-4"
                />
              )}
              <Text
                className={`text-base ${
                  action.isDestructive ? "text-red-600" : "text-gray-700"
                }`}
              >
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onClose}
            className="p-4 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-bold text-green-mannwork">
              Cancelar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default OptionsMenu;
