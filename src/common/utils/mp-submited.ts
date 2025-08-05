import { supabase } from '@/common/lib/supabase/supabaseClient';

  export const getPaymentMpUrl = async (quote: any, professionalAccessToken: string) => {
    try {
    const { data, error } = await supabase.functions.invoke('mp-submited', {
      body: {
        name: 'Functions',
        chatId: quote.chatId,
        amount: quote.amount,
        title: quote.description,
        marketplace: professionalAccessToken,
        client_name: quote.professionalName,
        client_avatar: quote.professionalAvatar,
        quote_id: quote.quoteId,
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
    alert("Error al conectar con Mercado Pago.");
  }     
}