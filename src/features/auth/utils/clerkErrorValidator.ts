import { errorMessagesClerkES } from "./errorMessagesClerkES";

export const clerkErrorValidator = (error: any) => {
    let errorField = "root";
    let displayMessage = "Ocurrió un error inesperado. Por favor, intenta de nuevo.";

    switch (error.meta?.paramName) {
        case 'identifier':
          errorField = 'email';
          break;
        case 'password':
          errorField = 'password';
          break;
        default:
          errorField = 'root';
          break;
    }

    if (error.code && error.longMessage) {
      const clerkErrorCode = error.code;
      const longMessage = error.longMessage;
  
      displayMessage = errorMessagesClerkES[clerkErrorCode] || longMessage || displayMessage;

      if (clerkErrorCode === "form_param_format_invalid" && error.errors[0].meta?.paramName) {
          const specificKey = `form_param_format_invalid_${error.errors[0].meta.paramName}`;
          displayMessage = errorMessagesClerkES[specificKey] || errorMessagesClerkES[clerkErrorCode] || longMessage || displayMessage;
      }
    } else if (error.message) {
      displayMessage = error.message;
    }
  
    return { errorField, displayMessage };
}