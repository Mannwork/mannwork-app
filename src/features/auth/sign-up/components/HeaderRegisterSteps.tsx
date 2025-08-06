import { Image, View } from "react-native";

export default function HeaderRegisterSteps() {
    return (
            <View  className="items-center max-h-20 justify-center bg-[#2D7A3E]">
                    <Image
                        source={require('@/assets/logo_letras.png')} 
                        className="w-96 h-60"
                        resizeMode="contain"
                    />
                </View>
    );
}