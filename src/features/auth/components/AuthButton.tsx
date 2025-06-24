import { Pressable, PressableProps } from "react-native";

const AuthButton = ({
    children,
    className = "bg-green-mannwork-light",
    onPress,
    ...rest
}: PressableProps) => {
    return (
        <Pressable
            onPress={onPress}
            className={
                "flex-row items-center justify-center rounded-xl px-2 py-4 " +
                (className || "")
            }
            {...rest}
        >
            {children}
        </Pressable>
    );
};

export default AuthButton;
