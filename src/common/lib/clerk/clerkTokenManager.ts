// Variable global para almacenar la función de obtener token de Clerk
let getClerkToken: (() => Promise<string | null>) | null = null;

// Función para configurar el proveedor de tokens de Clerk
export const setClerkTokenProvider = (
  tokenProvider: () => Promise<string | null>
) => {
  getClerkToken = tokenProvider;
};

// Función para obtener el token de Clerk
export const getClerkAccessToken = async (): Promise<string | null> => {
  if (getClerkToken) {
    return await getClerkToken();
  }
  return null;
};
