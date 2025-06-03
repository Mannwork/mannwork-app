import { useAuth, useUser } from '@clerk/clerk-expo';
import { Pressable, Text, View } from 'react-native';

const HomeScreen = () => {

  const {user} = useUser();
  const {signOut} = useAuth();


  return (
    <View>
        <Text>
          {user?.firstName}
        </Text>
        <Pressable onPress={()=>signOut()}>
          <Text>
            Cerrar sesión
          </Text>
        </Pressable>
    </View>
  )
}

export default HomeScreen