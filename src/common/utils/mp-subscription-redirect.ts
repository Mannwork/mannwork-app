import { supabase } from '@/common/lib/supabase/supabaseClient';

  export const getSubscriptionUrl = async (usdAmount: number, email: string, userId: string) => {

  try {
    const { data, error } = await supabase.functions.invoke('mp-subscribe', {
        body: {
            name: 'Functions',
            usdAmount,
            email: email,
            userId
          }
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