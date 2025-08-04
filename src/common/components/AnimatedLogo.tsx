import { useEffect, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';

interface AnimatedLogoProps {
  className?: string;
  source: any; // Usaremos ImageSourcePropType si importamos los tipos de react-native
  size?: number;
}

const AnimatedLogo = ({ className, source, size = 300 }: AnimatedLogoProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 0.05,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -0.05,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [fadeAnim, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { scale: scaleAnim },
          { rotate },
        ],
        width: size,
        height: size
      }}
    >
      <Image
        source={source}
        className={className}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};



export default AnimatedLogo;
