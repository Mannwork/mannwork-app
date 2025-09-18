import { supabase } from '@/common/lib/supabase/supabaseClient';

export const getAuthMpUrl = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('mp-authorization', {
        body: { name: 'Functions', state: userId },
      });

    if (error) {
      console.log("error", error);
      
      throw new Error('Error al invocar la función: ' + error.message);
    }

    if (data && data.url) {

      console.log("data", data);
      

      return data.url;
    } else {
      throw new Error('No se recibió una URL de la función.');
    }

  } catch (err) {
    console.error('Falló la conexión con Mercado Pago:', err);
  }
}