import { ReactNode } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>; // custom fields
    name: Path<T>;
    rightIcon?: ReactNode;
    inputClassName?: string;
} & Omit<TextInputProps, 'className'>;

export default function CustomInput<T extends FieldValues>({
    control,
    name,
    rightIcon,
    inputClassName = '',
    ...props
}: CustomInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
            }) => (
                <View className="gap-2 w-full">
                    <View className="relative w-full">
                        <TextInput
                            {...props}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            className={
                                `p-4 border rounded-xl w-full bg-white text-base ${inputClassName} ` +
                                (error
                                    ? " border-red-500"
                                    : "border-gray-300 focus:border-primary")
                            }
                            style={{
                                paddingRight: rightIcon ? 43 : 16, // Espacio adicional para el ícono
                                height: 56, // Altura fija para consistencia
                            }}
                        />
                        {rightIcon && (
                            <View 
                                className="absolute right-0 top-0 bottom-0 justify-center pr-3"
                                pointerEvents="box-none"
                            >
                                {rightIcon}
                            </View>
                        )}
                    </View>
                    <Text className="text-red-500">{error?.message}</Text>
                </View>
            )}
        />
    );
}
