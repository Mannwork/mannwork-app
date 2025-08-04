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

// Función para calcular ponderación de rating considerando experiencia
const calculateWeightedRating = (rating: number, reviews: number): number => {
  // Si no tiene reviews, usar el rating base con penalización
  if (reviews === 0) {
    return rating * 0.5; // Penalización del 50% para profesionales sin reviews
  }
  
  // Fórmula de ponderación: rating base + bonus por experiencia
  // El bonus aumenta logarítmicamente con el número de reviews
  const experienceBonus = Math.log(reviews + 1) * 0.1; // Bonus máximo ~0.3 puntos
  const weightedRating = rating + experienceBonus;
  
  // Limitar a máximo 5.5 para mantener proporciones
  return Math.min(weightedRating, 5.5);
};

// Función para ordenar profesionales según criterios de prioridad
const sortProfessionals = (professionals: Professional[]): Professional[] => {
  return professionals.sort((a, b) => {
    // Determinar categoría de cada profesional
    const getCategoryPriority = (prof: Professional): number => {
      const isPremium = prof.membership_json;
      const isVerified = prof.verified;
      
      if (isPremium && isVerified) return 1; // Premiums con certificación
      if (isPremium && !isVerified) return 2; // Premiums sin certificación
      if (!isPremium && isVerified) return 3; // No premiums con certificación
      return 4; // No premium sin certificación
    };
    
    const categoryA = getCategoryPriority(a);
    const categoryB = getCategoryPriority(b);
    
    // Si están en diferentes categorías, ordenar por categoría
    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }
    
    // Si están en la misma categoría, ordenar por rating ponderado descendente
    const weightedRatingA = calculateWeightedRating(a.rating, a.reviews);
    const weightedRatingB = calculateWeightedRating(b.rating, b.reviews);
    
    return weightedRatingB - weightedRatingA;
  });
};

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
  
  // Ordenar profesionales según criterios
  const sortedProfessionals = sortProfessionals(filteredProfessionals);

  if (sortedProfessionals.length === 0) {
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
      {sortedProfessionals.map((prof) => (
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
