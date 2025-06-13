import Categories from "@/features/home/Categories";
import Header from "@/features/home/Header";
import InfoCardSwiper from "@/features/home/InfoCardSwiper";
import RecentSearches from "@/features/home/RecentSearches";
import SearchBarInput from "@/features/home/SearchbarInput";
import SubcategoryCarrousel from "@/features/home/SubcategoryCarrousel";
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-react";
import { Pressable, ScrollView, Text, View } from "react-native";

const HomeScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBarInput />
        <RecentSearches />
        <Categories />
        <InfoCardSwiper />
        <SubcategoryCarrousel />
        <View className="h-8" />
        <Pressable onPress={() => signOut()}>
          <Text>Sign out</Text>
        </Pressable>
        <Text>{user?.firstName}</Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
