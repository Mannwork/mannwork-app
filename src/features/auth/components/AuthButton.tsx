import { Pressable, PressableProps, Text } from "react-native";

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface AuthButtonProps extends PressableProps {
    children: React.ReactNode;
    className?: string;
    variant?: Variant;
}

const variantStyles = {
    primary: 'bg-green-mannwork',
    secondary: 'bg-blue-600',
    outline: 'bg-transparent border-2 border-green-mannwork',
    ghost: 'bg-transparent',
};

const variantTextColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-green-mannwork',
    ghost: 'text-green-mannwork',
};

const AuthButton = ({
    children,
    className = "",
    variant = 'primary',
    onPress,
    ...rest
}: AuthButtonProps) => {
    const baseClasses = "flex-row items-center justify-center rounded-xl px-4 py-3";
    const variantClass = variantStyles[variant] || variantStyles.primary;
    
    return (
        <Pressable
            onPress={onPress}
            className={`${baseClasses} ${variantClass} ${className}`}
            {...rest}
        >
            {typeof children === 'string' ? (
                <Text className={`font-semibold ${variantTextColors[variant]}`}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
};

export default AuthButton;
