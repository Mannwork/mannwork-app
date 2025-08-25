import EditUserModal from "@/features/profile/components/settings/EditUserModal";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UpdateDataModal = () => {
  const insets = useSafeAreaInsets();
  const handleClose = () => {
    router.back();
  };

  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top }}
    >
      <EditUserModal visible={true} onClose={handleClose} />
    </View>
  );
};

export default UpdateDataModal;
