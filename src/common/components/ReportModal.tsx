import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const reportReasons = [
  { key: "spam", label: "Spam o contenido no deseado" },
  { key: "acoso", label: "Acoso o intimidación" },
  { key: "discurso_de_odio", label: "Discurso de odio" },
  { key: "contenido_inapropiado", label: "Contenido inapropiado" },
  { key: "informacion_falsa", label: "Información falsa" },
  { key: "otro", label: "Otro motivo" },
];

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsLoading(true);
    await onSubmit(selectedReason, details);
    setIsLoading(false);

    setSelectedReason(null);
    setDetails("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/60 justify-center items-center p-6"
      >
        <Pressable className="bg-white rounded-2xl w-full p-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Reportar Conversación
          </Text>
          <Text className="text-base text-gray-600 mb-5">
            Por favor, selecciona el motivo del reporte. Tu denuncia es anónima.
          </Text>

          <View className="mb-5">
            {reportReasons.map((reason) => (
              <TouchableOpacity
                key={reason.key}
                onPress={() => setSelectedReason(reason.key)}
                className={`p-3 border border-gray-300 rounded-lg mb-2 ${
                  selectedReason === reason.key
                    ? "bg-green-100 border-green-mannwork"
                    : ""
                }`}
              >
                <Text
                  className={`${
                    selectedReason === reason.key
                      ? "font-bold text-green-mannwork"
                      : "text-gray-700"
                  }`}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Añade más detalles (opcional)"
            className="p-3 bg-gray-100 border border-gray-300 rounded-lg h-24"
            multiline
            returnKeyType="done"
            blurOnSubmit={true}
            textAlignVertical="top"
          />

          <View className="mt-6 flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="py-3 px-6 rounded-full border border-gray-300"
            >
              <Text className="font-bold text-gray-600">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!selectedReason || isLoading}
              className={`py-3 px-6 rounded-full ${
                !selectedReason || isLoading ? "bg-gray-400" : "bg-red-600"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">Enviar Reporte</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ReportModal;
