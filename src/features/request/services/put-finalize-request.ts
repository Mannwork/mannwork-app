import { supabase } from '@/common/lib/supabase/supabaseClient';

export const putFinalizeRequest = async (request_id: string) => {  
  try {
      const { data, error } = await supabase.functions.invoke('mp-submited', {
        body: {
          name: 'Functions',
          requestId: request_id,
        },
      });

      if (error) {
          throw new Error('Error al invocar la función: ' + error.message);
      }
      
      if (data && data.url) {
          return data.url;
      }
  } catch (e) {
    console.error('Falló la conexión con Mercado Pago:', e);
  }      
}