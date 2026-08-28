import { supabase } from './supabaseClient';

export async function sendOrderNotification(orderData) {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado. O e-mail não será enviado.');
      return;
    }

    // Dispara a Edge Function de forma segura pelo servidor do Supabase
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: { order: orderData },
    });

    if (error) throw error;
    console.log('Notificação de e-mail enviada com sucesso pelo Supabase!', data);
  } catch (error) {
    console.error('Erro ao enviar notificação de e-mail:', error);
  }
}
