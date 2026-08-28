import { createClient } from "npm:@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order } = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    const itensHtml = order.itens.map((item: any) => `
      <p>包装 <strong>${item.name}</strong> x${item.qty} = R$ ${(item.price * item.qty).toFixed(2)}</p>
    `).join('')

    const res = await fetch('https://resend.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Lefit Marmitas <onboarding@resend.dev>',
        to: ['luisaohf@gmail.com'], 
        subject: `🥗 Novo Pedido Recebido - ${order.numero_pedido}`,
        html: `
          <h2>Novo Pedido Recebido!</h2>
          <p><strong>Número do Pedido:</strong> ${order.numero_pedido}</p>
          <p><strong>Cliente:</strong> ${order.cliente_nome}</p>
          <p><strong>Telefone:</strong> ${order.cliente_telefone}</p>
          <p><strong>Email:</strong> ${order.cliente_email}</p>
          <p><strong>Endereço:</strong> ${order.endereco} ${order.complemento ? `- ${order.complemento}` : ''}, ${order.cidade}</p>
          <hr>
          <h3>Itens Comprados:</h3>
          ${itensHtml}
          <hr>
          <p><strong>TOTAL: R$ ${order.total.toFixed(2)}</strong></p>
          <p><strong>Método de Pagamento:</strong> ${order.metodo_pagamento}</p>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
