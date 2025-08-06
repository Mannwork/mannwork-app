import EditUserModal from "@/features/profile/components/settings/EditUserModal";
import { router } from "expo-router";

const UpdateDataModal = () => {
  const handleClose = () => {
    router.back();
  };

  return <EditUserModal visible={true} onClose={handleClose} />;
};

export default UpdateDataModal;
