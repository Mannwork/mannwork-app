import { supabase } from '@/common/lib/supabase/supabaseClient';

export const putFinalizeRequest = async (request_id: string) => {
  console.log(request_id);
  
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
      console.log(data, "data");
      
      if (data && data.url) {
          return data.url;
      }
  } catch (e) {
    console.error('Falló la conexión con Mercado Pago:', e);
    alert("Error al conectar con Mercado Pago.");
  }      
}