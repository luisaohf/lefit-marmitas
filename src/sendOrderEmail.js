import { supabase } from './supabaseClient';

export async function sendOrderNotification(orderData) {
  try {
    if (!supabase) {
      console.warn('Supabase não configurado localmente.');
      return;
    }

    // SANITIZAÇÃO DE TI: Filtra e extrai APENAS as propriedades puras do JSON,
    // eliminando qualquer objeto circular, referências do DOM ou do React.
    const cleanOrder = {
      numero_pedido: String(orderData.numero_pedido || ''),
      cliente_nome: String(orderData.cliente_nome || ''),
      cliente_email: String(orderData.cliente_email || ''),
      cliente_telefone: String(orderData.cliente_telefone || ''),
      endereco: String(orderData.endereco || ''),
      complemento: String(orderData.complemento || ''),
      cidade: String(orderData.cidade || ''),
      total: Number(orderData.total || 0),
      metodo_pagamento: String(orderData.metodo_pagamento || ''),
      itens: Array.isArray(orderData.itens) 
        ? orderData.itens.map(item => ({
            name: String(item.name || ''),
            qty: Number(item.qty || 1),
            price: Number(item.price || 0)
          }))
        : []
    };

    console.log('Enviando payload sanitizado para o Supabase:', cleanOrder);

    // Invocação limpa da Edge Function na nuvem
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: { order: cleanOrder },
    });

    if (error) throw error;
    console.log('Notificação enviada com sucesso através do Supabase!', data);
  } catch (error) {
    console.error('Erro interno ao processar notificação de e-mail:', error);
  }
}
