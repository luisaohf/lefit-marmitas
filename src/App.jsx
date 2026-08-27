import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default function Store() {
  const [step, setStep] = useState('shop');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'pix'
  });
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const products = [
    { id: 1, name: 'Frango com Brócolis', price: 18.90, emoji: '🍗', desc: 'Peito de frango + brócolis + arroz' },
    { id: 2, name: 'Salmon Grelhado', price: 28.90, emoji: '🐟', desc: 'Salmon + batata doce + legumes' },
    { id: 3, name: 'Carne Vermelha Premium', price: 24.90, emoji: '🥩', desc: 'Alcatra + batata inglesa + salada' },
    { id: 4, name: 'Frango com Abóbora', price: 16.90, emoji: '🍛', desc: 'Frango desfiado + abóbora + feijão' },
    { id: 5, name: 'Mix Fit (Frango + Ovo)', price: 20.90, emoji: '🥚', desc: 'Frango + ovo mexido + quinoa' },
    { id: 6, name: 'Vegetariana', price: 14.90, emoji: '🥗', desc: 'Grão de bico + brócolis + batata doce' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('lefit-marmitas-cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('lefit-marmitas-cart', JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      saveCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      saveCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(item => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty === 0) removeFromCart(productId);
    else {
      saveCart(cart.map(item =>
        item.id === productId ? { ...item, qty } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);

  const handleCheckout = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    
    const orderData = {
      numero_pedido: 'LEF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      cliente_nome: formData.name,
      cliente_email: formData.email,
      cliente_telefone: formData.phone,
      endereco: formData.address,
      cidade: formData.city,
      cep: formData.zipCode,
      itens: cart,
      total: parseFloat(total),
      metodo_pagamento: formData.paymentMethod,
      status: 'pendente'
    };

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('pedidos')
          .insert([orderData])
          .select();

        if (error) {
          console.error('Erro Supabase:', error);
        }
      }

      setOrderConfirmed(orderData);
      localStorage.removeItem('lefit-marmitas-cart');
      setCart([]);
      setStep('confirmation');
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      {!supabase && (
        <div style={{
          background: 'var(--bg-accent)',
          border: '1px solid var(--fill-accent)',
          color: '#22c55e',
          padding: '12px',
          borderRadius: 'var(--radius)',
          marginBottom: '1rem',
          fontSize: '13px'
        }}>
          ℹ️ Configure variáveis de ambiente para salvar pedidos no banco
        </div>
      )}

      {step === 'shop' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 8px', fontSize: '32px' }}>🥗 LefitMarmitas</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              Marmitas fitness com ingredientes selecionados
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <button
              onClick={() => setStep('cart')}
              style={{
                background: 'var(--fill-accent)',
                color: 'var(--on-accent)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🛒 Carrinho ({cart.reduce((sum, item) => sum + item.qty, 0)})
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '40px', textAlign: 'center' }}>{product.emoji}</div>
                <div>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {product.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--fill-accent)' }}>
                    R$ {product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      background: 'var(--fill-accent)',
                      color: 'var(--on-accent)',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'cart' && (
        <div>
          <button
            onClick={() => setStep('shop')}
            style={{
              background: 'transparent',
              border: '0.5px solid var(--border)',
              padding: '10px 16px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Voltar
          </button>

          <h2 style={{ margin: '0 0 1.5rem', fontSize: '24px' }}>Seu Carrinho</h2>

          {cart.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              Seu carrinho está vazio
            </p>
          ) : (
            <>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--surface-1)',
                    borderRadius: 'var(--radius)',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: '600' }}>{item.emoji} {item.name}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      R$ {item.price.toFixed(2)} cada
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        border: '0.5px solid var(--border)',
                        background: 'var(--surface-2)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        border: '0.5px solid var(--border)',
                        background: 'var(--surface-2)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
                      R$ {(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'var(--text-danger)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: '2rem',
                  padding: '20px',
                  background: 'var(--surface-1)',
                  borderRadius: '12px',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Total de itens: {cart.reduce((sum, item) => sum + item.qty, 0)}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--fill-accent)' }}>
                  R$ {total}
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  style={{
                    width: '100%',
                    background: 'var(--fill-accent)',
                    color: 'var(--on-accent)',
                    border: 'none',
                    padding: '14px',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Ir para Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 'checkout' && (
        <div>
          <button
            onClick={() => setStep('cart')}
            style={{
              background: 'transparent',
              border: '0.5px solid var(--border)',
              padding: '10px 16px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Voltar
          </button>

          <h2 style={{ margin: '0 0 1.5rem', fontSize: '24px' }}>Dados de Entrega</h2>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                Nome completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="João Silva"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                Telefone (WhatsApp)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+55 (11) 98765-4321"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                Endereço
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua Principal, 123, Apto 401"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="01310-100"
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Método de Pagamento</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { id: 'pix', label: '📱 PIX (instantâneo)' },
                { id: 'credit-card', label: '💳 Cartão de Crédito' },
                { id: 'debit-card', label: '🏦 Cartão de Débito' },
              ].map(method => (
                <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', borderRadius: 'var(--radius)', background: formData.paymentMethod === method.id ? 'var(--bg-accent)' : 'var(--surface-1)' }}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: formData.paymentMethod === method.id ? 'var(--fill-accent)' : 'var(--text-primary)' }}>
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              padding: '14px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Continuar para Pagamento
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '24px' }}>Revisar Pedido</h2>

          <div style={{ background: 'var(--surface-1)', borderRadius: '12px', padding: '16px', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Resumo do Pedido</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
                <span>{item.emoji} {item.name} x{item.qty}</span>
                <span style={{ fontWeight: '600' }}>R$ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--fill-accent)' }}>R$ {total}</span>
            </div>
          </div>

          <div style={{ background: 'var(--surface-1)', borderRadius: '12px', padding: '16px', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Entregar para</h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
              <strong>{formData.name}</strong><br/>
              {formData.address}<br/>
              {formData.city} {formData.zipCode}<br/>
              📧 {formData.email}<br/>
              📱 {formData.phone}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
            <button
              onClick={() => setStep('checkout')}
              style={{
                background: 'transparent',
                border: '0.5px solid var(--border)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              ← Editar
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                background: 'var(--fill-accent)',
                color: 'var(--on-accent)',
                border: 'none',
                padding: '12px',
                borderRadius: 'var(--radius)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Processando...' : '✓ Confirmar Pedido'}
            </button>
          </div>
        </div>
      )}

      {step === 'confirmation' && orderConfirmed && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '600' }}>Pedido Confirmado!</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 2rem', fontSize: '16px' }}>
            Obrigado por sua compra na LefitMarmitas!
          </p>

          <div style={{ background: 'var(--surface-1)', borderRadius: '12px', padding: '20px', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>NÚMERO DO PEDIDO</p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '18px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--fill-accent)' }}>
              {orderConfirmed.numero_pedido}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>TOTAL</p>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '20px', color: 'var(--fill-accent)' }}>R$ {orderConfirmed.total.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>PAGAMENTO</p>
                <p style={{ margin: 0, fontWeight: '600' }}>
                  {orderConfirmed.metodo_pagamento === 'credit-card' && '💳 Cartão de Crédito'}
                  {orderConfirmed.metodo_pagamento === 'debit-card' && '🏦 Cartão de Débito'}
                  {orderConfirmed.metodo_pagamento === 'pix' && '📱 PIX'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-accent)', border: '1px solid var(--fill-accent)', padding: '16px', borderRadius: '12px', marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--fill-accent)', fontWeight: '600' }}>
              ✓ Confirmação enviada para {orderConfirmed.cliente_email}
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--fill-accent)' }}>
              Você receberá atualizações sobre sua entrega por WhatsApp
            </p>
          </div>

          <button
            onClick={() => {
              setStep('shop');
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                zipCode: '',
                paymentMethod: 'pix'
              });
              setOrderConfirmed(null);
            }}
            style={{
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            ← Voltar para Loja
          </button>
        </div>
      )}
    </div>
  );
}