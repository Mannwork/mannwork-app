import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MpLinkCardProps {
  onPress: () => void;
}

const MpLinkCard: React.FC<MpLinkCardProps> = ({ onPress }) => {
  return (
    <View className="bg-green-mannwork-light rounded-2xl border-2 border-green-mannwork p-5 mx-4 mt-4 mb-2 shadow-md items-center">
      <Text className="text-xl font-bold text-green-mannwork text-center mb-1">
        ¡Impulsa tu éxito profesional!
      </Text>
      <Text className="text-base font-medium text-gray-700 text-center mb-4">
        Vincula tu cuenta con Mercado Pago para empezar a recibir pagos de tus clientes. ¡Es rápido, seguro y potencia tu negocio!
      </Text>
      <TouchableOpacity
        className="flex-row items-center justify-center bg-[#009EE3] rounded-xl px-4 py-2"
        activeOpacity={0.85}
        onPress={onPress}
      >
          <Text className="text-white font-semibold text-base">Vincular con Mercado Pago</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MpLinkCard;
