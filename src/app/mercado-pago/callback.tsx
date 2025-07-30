import { Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

const CallbackPage = () => {
    const { code, state } = useLocalSearchParams();

    return (
        <View>
            <Text>callback</Text>
            <Text>Code: {code}</Text>
            <Text>State: {state}</Text>
        </View>
    );
};

export default CallbackPage;
