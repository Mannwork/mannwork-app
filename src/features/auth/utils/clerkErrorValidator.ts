const errorMessagesClerkES = {
    "form_identifier_not_found": "No pudimos encontrar tu cuenta.",
    "form_password_incorrect": "La contraseña que ingresaste es incorrecta.",
    "form_password_pwned": "Esta contraseña ha sido encontrada en una filtración de datos. Por seguridad, por favor usa una contraseña diferente.",
    "form_identifier_exists": "Ya existe una cuenta con esta dirección de correo electrónico.",
    "form_param_format_invalid_email": "El formato de la dirección de correo electrónico no es válido.",
    "form_param_format_invalid_phone": "El formato del número de teléfono no es válido.",
    "form_param_nil_email": "La dirección de correo electrónico es obligatoria.",
    "form_param_nil_password": "La contraseña es obligatoria.",
    "form_password_length_too_short": "La contraseña es demasiado corta (revisa los requisitos de longitud).",
    "form_password_strength_not_met": "La contraseña no cumple con los requisitos de seguridad.",
    "verification_failed_reason_code_mismatch": "El código de verificación es incorrecto.",
    "form_code_incorrect": "El código de verificación es incorrecto.",
    "verification_failed_reason_code_expired": "El código de verificación ha expirado.",
    "verification_expired": "El código de verificación ha expirado.",
    "verification_failed_reason_too_many_attempts": "Has realizado demasiados intentos. Por favor, inténtalo de nuevo más tarde.",
    "session_revoked": "Tu sesión ha sido revocada. Por favor, inicia sesión de nuevo.",
    "session_expired": "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
    "session_exists": "Ya existe una sesión activa.",
};

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