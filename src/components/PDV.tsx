import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User, Package, DollarSign, Trash2, Smartphone, CreditCard, Banknote, Zap, AlertCircle } from 'lucide-react';

export const PDV = () => {
  const { products, finalizeSale, user, addLog } = useStore();
  
  const [cart, setCart] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const clientInputRef = useRef<HTMLInputElement>(null);

  // Foco inicial no campo de cliente
  useEffect(() => {
    clientInputRef.current?.focus();
  }, []);

  // Lógica principal de validação e finalização via Enter
  const handleMainAction = () => {
    if (cart.length === 0) {
      alert("⚠️ ALERTA: O carrinho está vazio! Adicione produtos antes de tentar finalizar.");
      return;
    }
    if (!clientName.trim()) {
      alert("⚠️ ALERTA: Nome do cliente é obrigatório para emissão da garantia.");
      clientInputRef.current?.focus();
      return;
    }
    if (!paymentMethod) {
      alert("⚠️ ALERTA: Selecione uma forma de pagamento (Pix, Cartão ou Dinheiro).");
      return;
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    
    finalizeSale({
      cliente: clientName,
      total,
      metodo: paymentMethod,
      cart,
      vendedor: user?.nome
    });
    
    // Limpeza de estado após sucesso
    setCart([]);
    setClientName('');
    setPaymentMethod('');
    alert("✅ VENDA REALIZADA: O sistema registrou a transação e atualizou o estoque.");
  };

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      alert("⚠️ ESTOQUE ESGOTADO: Este item não possui unidades disponíveis.");
      return;
    }
    setCart([...cart, { ...product, cartId: Math.random() }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    addLog('PDV_REMOCAO', 'Item removido do carrinho manualmente');
  };

  const totalVenda = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div 
      className="h-screen flex flex-col p-6 bg-black text-white overflow-hidden"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLBodyElement) handleMainAction();
      }}
    >
      <div className="flex gap-6 h-full">
        
        {/* COLUNA ESQUERDA: CHECKOUT (60% da tela) */}
        <div className="flex-[2] bg-zinc-900 rounded-[3rem] border-2 border-zinc-800 p-8 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-600 rounded-2xl"><ShoppingCart size={32} /></div>
              <h2 className="text-4xl font-black italic uppercase italic tracking-tighter">Terminal de Venda</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Operador Ativo</p>
              <p className="text-blue-500 font-bold uppercase">{user?.nome}</p>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="relative mb-8">
            <User className="absolute left-6 top-6 text-zinc-500" size={28} />
            <input 
              ref={clientInputRef}
              type="text"
              placeholder="IDENTIFICAÇÃO DO CLIENTE (OBRIGATÓRIO)"
              className="w-full bg-black border-2 border-zinc-800 p-6 pl-16 rounded-[2rem] text-2xl font-bold focus:border-blue-500 outline-none transition-all placeholder:text-zinc-800"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          {/* Itens no Carrinho */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-800 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                <Package size={80} className="mb-4 opacity-20" />
                <p className="font-black uppercase italic text-xl">Aguardando Produtos...</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center bg-black p-6 rounded-[2rem] border border-zinc-800 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-zinc-900 rounded-xl text-blue-500"><Smartphone size={24} /></div>
                    <div>
                      <p className="font-black uppercase text-lg leading-none">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{item.storage} • {item.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="font-mono font-black text-2xl text-blue-500">R$ {item.price.toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Painel Inferior de Fechamento */}
          <div className="bg-black p-8 rounded-[2.5rem] border-2 border-zinc-800">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['Pix', 'Crédito', 'Dinheiro'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${paymentMethod === m ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {m === 'Pix' && <Zap size={14} />}
                  {m === 'Crédito' && <CreditCard size={14} />}
                  {m === 'Dinheiro' && <Banknote size={14} />}
                  {m}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8 px-2">
              <p className="text-zinc-600 font-black uppercase tracking-[0.2em] flex items-center gap-2"><AlertCircle size={16}/> Valor Total Líquido</p>
              <p className="text-6xl font-mono font-black italic">R$ {totalVenda.toLocaleString()}</p>
            </div>

            <button 
              onClick={handleMainAction}
              className="w-full py-8 bg-white text-black rounded-[2rem] font-black text-3xl uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
            >
              <DollarSign size={40} /> Finalizar Venda (ENTER)
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: CATÁLOGO RÁPIDO (40% da tela) */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4 ml-4">Disponíveis em Estoque</p>
          {products.map((p: any) => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="w-full p-6 bg-zinc-900 border-2 border-zinc-800 rounded-[2rem] text-left hover:border-blue-500 transition-all group flex justify-between items-center"
            >
              <div>
                <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">{p.category}</p>
                <p className="font-black uppercase text-lg leading-tight group-hover:text-blue-500 transition-colors">{p.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">{p.storage} • {p.color}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-black text-xl">R$ {p.price.toLocaleString()}</p>
                <p className={`text-[9px] font-bold uppercase mt-1 ${p.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>{p.stock} UN em estoque</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};