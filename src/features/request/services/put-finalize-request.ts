import { supabase } from '@/common/lib/supabase/supabaseClient';

  export const putFinalizeRequest = async (request_id: string) => {
    try {
    const {data: billingData , error: billingError}  = await supabase.from("billing").select().eq("request_id", request_id).single();

    if (billingError) {
        throw new Error('Error al invocar la función: ' + billingError.message);
    }

    const {data: quoteData, error: quoteError} = await supabase.from("quotes").select().eq("request_id", request_id).single();

    if (quoteError) {
        throw new Error('Error al invocar la función: ' + quoteError.message);
    }


    const { error } = await supabase.functions.invoke('mp-release-payment', {
      body: {
        name: 'Functions',
        quote_id: quoteData.id,
        payment_id: billingData.mp_payment_id,
      },
    });

    if (error) {
        throw new Error('Error al invocar la función: ' + error.message);
    }
 
  } catch (e) {
    console.error('Falló la conexión con Mercado Pago:', e);
    alert("Error al conectar con Mercado Pago.");
  }     
}