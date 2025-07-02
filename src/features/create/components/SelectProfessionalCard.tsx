import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FontAwesome key={i} name="star" size={14} color="#2d7a3e" />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <FontAwesome key={i} name="star-half-full" size={14} color="#2d7a3e" />
      );
    } else {
      stars.push(
        <FontAwesome key={i} name="star-o" size={14} color="#2d7a3e" />
      );
    }
  }
  return stars;
}

export default function SelectProfessionalCard({
  professional,
  selected = false,
  onSelect = () => {},
}: {
  professional: any;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <View className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden">
      {/* Cabecera verde con logo de fondo */}
      <View className="bg-green-mannwork h-[80px] w-full relative items-center justify-center">
        <Image
          source={require("@/assets/logo_letras.png")}
          className="absolute w-64 h-64"
          style={{
            left: "50%",
            top: "0%",
            transform: [{ translateX: -110 }, { translateY: -70 }],
          }}
          resizeMode="contain"
        />
      </View>
      {/* Foto superpuesta y check */}
      <View
        className="items-center w-full absolute left-0 right-0"
        style={{ top: 32 }}
      >
        <Image
          source={{ uri: professional.avatar }}
          className="w-24 h-24 rounded-full border-4 border-white bg-gray-100"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="flex flex-col items-center absolute right-6 top-16 -translate-y-1/2"
          onPress={onSelect}
        >
          <View className="bg-white rounded-full w-12 h-12 shadow items-center justify-center">
            <FontAwesome
              name="check-circle"
              size={32}
              color={selected ? "#2d7a3e" : "#D1D5DB"}
            />
          </View>
          <Text className="text-xs text-green-mannwork font-bold mt-1">
            Seleccionar
          </Text>
        </TouchableOpacity>
        <View className="flex-row absolute left-3 top-20 items-center mb-1">
          {renderStars(professional.rating)}
          <Text className="ml-2 font-bold text-xs text-gray-800">
            {professional.rating}
          </Text>
          <Text className="ml-2 text-gray-500 text-sm">
            ({professional.reviews})
          </Text>
        </View>
      </View>
      {/* Info principal con iconos y gap vertical */}
      <View className="pt-16 px-5 pb-3 flex-col gap-2">
        <View className="flex-row items-center">
          <MaterialIcons name="person" size={18} color="#2d7a3e" />
          <Text className="font-bold text-sm ml-2 text-left">
            {professional.name} {professional.lastInitial}.
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="build" size={18} color="#2d7a3e" />
          <Text className="text-green-mannwork font-semibold text-sm ml-2 text-left">
            {professional.category}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={18} color="#2d7a3e" />
          <Text className="text-gray-500 text-sm ml-2 text-left">
            {professional.address}
          </Text>
        </View>
      </View>
      {/* Badges abajo, alineados a la izquierda */}
      <View className="flex-row items-center px-5 pb-4 gap-4">
        {professional.verified && (
          <View className="flex-row items-center mr-2">
            <MaterialIcons
              name="verified"
              size={22}
              color="#2D7A3E"
              className="ml-1"
            />
            <Text className="ml-1 text-xs text-green-mannwork font-semibold">
              Certificado
            </Text>
          </View>
        )}
        {professional.premium && (
          <View className="flex-row items-center">
            <FontAwesome name="diamond" size={18} color="#2D7A3E" />
            <Text className="ml-1 text-xs text-green-mannwork font-semibold">
              Premium
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
