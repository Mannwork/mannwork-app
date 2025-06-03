import Categories from "@/features/home/Categories";
import Header from "@/features/home/Header";
import InfoCardSwiper from "@/features/home/InfoCardSwiper";
import RecentSearches from "@/features/home/RecentSearches";
import SearchBarInput from "@/features/home/SearchbarInput";
import SubcategoryCarrousel from "@/features/home/SubcategoryCarrousel";
import { ScrollView, View } from "react-native";

const mockCarousels = [
  {
    category: "Mascotas",
    subcategories: [
      "Paseador de perros",
      "Alojamiento",
      "Guardería de día",
      "Mascotas general",
    ],
  },
  {
    category: "Hogar",
    subcategories: [
      "Plomería",
      "Electricista",
      "Limpieza",
      "Jardinería",
      "Pintura",
    ],
  },
  {
    category: "Transporte",
    subcategories: [
      "Fletes",
      "Transporte escolar",
      "Mudanzas",
      "Transporte general",
    ],
  },
];

const HomeScreen = () => {

  const {user} = useUser();
  const {signOut} = useAuth();


  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBarInput />
        <RecentSearches />
        <Categories />
        <InfoCardSwiper />
        {mockCarousels.map((carousel, idx) => (
          <SubcategoryCarrousel
            key={idx}
            category={carousel.category}
            subcategories={carousel.subcategories}
          />
        ))}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
