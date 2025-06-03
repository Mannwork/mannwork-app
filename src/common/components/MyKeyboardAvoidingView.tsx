import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform } from "react-native";

interface MyKeyboardAvoidingViewProps extends KeyboardAvoidingViewProps {};

const MyKeyboardAvoidingView = ({ children, className, ...rest }: MyKeyboardAvoidingViewProps) => {
    const defaultClasses = "flex-1 bg-background";
  const combinedClassName = `${defaultClasses} ${className || ''}`.trim();

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className={combinedClassName} 
        {...rest}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default MyKeyboardAvoidingView;