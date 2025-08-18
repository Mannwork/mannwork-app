import { Ubication } from "@/common/types/ubication.interface";
import EditUbicationData from "@/features/profile/components/settings/EditUbicationData";
import { useCurrentUser } from "@/features/profile/hooks/useCurrentUser";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { router } from "expo-router";

const UpdateUbicationModal = () => {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile } = useUpdateProfile();

  const handleSave = (data: Ubication) => {
    if (!user) return;

    updateProfile(
      {
        name: user.name,
        last_name: user.last_name,
        description: user.description || undefined,
        ubication_json: data,
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          // Aquí podrías mostrar un error si lo deseas
        },
      }
    );
  };

  return (
    <EditUbicationData
      initialData={user?.ubication_json || undefined}
      onSubmit={handleSave}
    />
  );
};

export default UpdateUbicationModal;
