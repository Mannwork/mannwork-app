import { EditProfessionsModal } from "@/features/profile/components/EditProfessionsModal";
import { useCurrentUser } from "@/features/profile/hooks/useCurrentUser";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { useProfessionsStore } from "@/features/profile/store/professions.store";
import { router } from "expo-router";

const ModalProfessionsEdit = () => {
  const professions = useProfessionsStore((state) => state.professions);
  const setProfessions = useProfessionsStore((state) => state.setProfessions);
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile } = useUpdateProfile();

  const handleSave = (newProfessions: any[]) => {
    setProfessions(newProfessions);
    updateProfile(
      {
        ...user,
        name: user?.name ?? "",
        last_name: user?.last_name ?? "",
        description: user?.description ?? "",
        professions: newProfessions,
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
    <EditProfessionsModal
      visible={true}
      onClose={() => router.back()}
      onSave={handleSave}
      currentProfessions={professions}
    />
  );
};

export default ModalProfessionsEdit;
