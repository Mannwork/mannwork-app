import { Pressable, PressableProps } from 'react-native';

const AuthButton = ({children, className, onPress, ...rest}: PressableProps) => {
  return (
    <Pressable 
        onPress={onPress}
        className={"flex-row items-center justify-center rounded-xl bg-green-mannwork-light px-2 py-4 " + (className || "")}
        {...rest}
    >
        {children}  
    </Pressable>
  )
};

export default AuthButton;