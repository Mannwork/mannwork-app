import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import SelectProfessionalCard from "./SelectProfessionalCard";

interface Professional {
  id: string;
  name: string;
  lastInitial: string;
  rating: number;
  reviews: number;
  category: string;
  address: string;
  verified: boolean;
  membership_json: boolean;
  avatar: string;
  distance: number;
}

interface ProfessionalsListProps {
  professionals: Professional[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  categoryName: string | undefined;
  subcategoryName: string | undefined;
}

export default function ProfessionalsList({
  professionals,
  selectedIds,
  onSelect,
  categoryName,
  subcategoryName,
}: ProfessionalsListProps) {
  const { userId } = useAuth();
  // Filtrar al usuario logueado
  const filteredProfessionals = professionals.filter(
    (prof) => prof.id !== userId
  );


  if (filteredProfessionals.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <MaterialIcons name="search-off" size={64} color="#9CA3AF" />
        <Text className="text-gray-600 text-lg font-semibold mt-4 text-center">
          No se encontraron profesionales
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          No hay profesionales disponibles en tu zona para esta categoría
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      {filteredProfessionals.map((prof) => (
        <SelectProfessionalCard
          key={prof.id}
          professional={prof}
          selected={selectedIds.includes(prof.id.toString())}
          onSelect={() => onSelect(prof.id.toString())}
          categoryName={categoryName || undefined}
          subcategoryName={subcategoryName || undefined}
        />
      ))}
    </ScrollView>
  );
}
