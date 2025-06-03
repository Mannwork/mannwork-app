import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

interface MyViewProps extends SafeAreaViewProps {}

const MyView = ({ children, className, ...rest }: MyViewProps) => {
    const defaultClasses = "flex-1 bg-background";
  const combinedClassName = `${defaultClasses} ${className || ''}`.trim();

  return (
    <SafeAreaView className={combinedClassName} {...rest}>
      {children}
    </SafeAreaView>
  );
};

export default MyView;