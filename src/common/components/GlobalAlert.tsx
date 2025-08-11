import React from "react";
import Alert from "@/common/components/Alert";
import { useAlertStore } from "@/common/store/alert.store";

const GlobalAlert: React.FC = () => {
  const { isVisible, message, type, hide } = useAlertStore();

  return (
    <Alert message={message} type={type} isVisible={isVisible} onClose={hide} />
  );
};

export default GlobalAlert;
