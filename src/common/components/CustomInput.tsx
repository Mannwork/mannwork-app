import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>; // custom fields
    name: Path<T>;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({
    control,
    name,
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
                <View className="gap-2">
                    <TextInput
                        {...props}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        className={
                            "p-3 border rounded-xl " +
                            props.className +
                            (error
                                ? " border-red-500"
                                : "border-text-secondary")
                        }
                    />
                    <Text className="text-red-500">{error?.message}</Text>
                </View>
            )}
        />
    );
}
