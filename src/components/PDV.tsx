import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, User, Trash2, Smartphone, 
  Search, CheckCircle2, Wallet, Printer, 
  ArrowRight, ArrowLeft, PackagePlus, Ticket, 
  CreditCard, Banknote, Zap
} from 'lucide-react';
import jsPDF from 'jspdf';

export const PDV = () => {
  const { products, finalizeSale, user, clientes, config, coupons } = useStore();
  
  // Controle do Passo a Passo (1: Cliente, 2: Itens, 3: Pagamento)
  const [step, setStep] = useState(1);
  
  // Estados de Dados
  const [cart, setCart] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [pagamentos, setPagamentos] = useState<any[]>([
    { metodo: 'Pix', valor: 0 },
    { metodo: 'Cartão 1', valor: 0 },
    { metodo: 'Cartão 2', valor: 0 },
    { metodo: 'Dinheiro', valor: 0 }
  ]);

  const clientInputRef = useRef<HTMLInputElement>(null);

  // Cálculos Automáticos
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);
  const valorDesconto = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.type === 'percent' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount;
  }, [appliedCoupon, subtotal]);
  const totalFinal = Math.max(0, subtotal - valorDesconto);
  const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
  const troco = totalPago > totalFinal ? totalPago - totalFinal : 0;

  // Gerador de Documentos
  const imprimirTudo = (saleData: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20).text(config.name.toUpperCase(), 105, 20, { align: 'center' });
    doc.setFontSize(10).text("RECIBO E CONTRATO DE GARANTIA (90 DIAS)", 105, 30, { align: 'center' });
    doc.text(`CLIENTE: ${saleData.cliente} | VENDEDOR: ${saleData.vendedor}`, 20, 50);
    doc.text(`TOTAL PAGO: R$ ${saleData.total.toLocaleString()}`, 20, 60);
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleFinalize = () => {
    const saleData = {
      cliente: selectedClient ? selectedClient.nome : clientSearch,
      total: totalFinal,
      cart,
      vendedor: user?.nome,
    };
    const finalSale = finalizeSale(saleData);
    imprimirTudo(finalSale);
    setCart([]); setClientSearch(''); setSelectedClient(null); setStep(1);
    setPagamentos(pagamentos.map(p => ({...p, valor: 0})));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 flex flex-col items-center">
      
      {/* INDICADOR DE PASSOS */}
      <div className="w-full max-w-4xl mb-12 flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-900 -translate-y-1/2 z-0" />
        {[1, 2, 3].map((s) => (
          <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black transition-all border-4 ${
            step >= s ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
          }`}>
            {step > s ? <CheckCircle2 size={24} /> : s}
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-zinc-950 border-2 border-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[500px] flex flex-col">
        
        {/* PASSO 1: IDENTIFICAÇÃO DO CLIENTE */}
        {step === 1 && (
          <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-3xl font-black italic uppercase mb-2">Quem está comprando?</h2>
            <p className="text-zinc-500 mb-10 uppercase text-[10px] tracking-widest">Identifique o cliente para o contrato de garantia</p>
            
            <div className="relative">
              <User className="absolute left-6 top-6 text-zinc-600" size={32} />
              <input 
                ref={clientInputRef}
                placeholder="NOME OU BUSCAR CLIENTE..."
                className="w-full bg-black border-2 border-zinc-900 p-8 pl-20 rounded-[2.5rem] text-2xl font-black focus:border-blue-500 outline-none uppercase"
                value={selectedClient ? selectedClient.nome : clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                disabled={!!selectedClient}
              />
              {selectedClient && <button onClick={() => setSelectedClient(null)} className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-black">X</button>}
            </div>

            <div className="mt-4 space-y-2">
              {clientes.filter(c => clientSearch.length > 1 && c.nome.toLowerCase().includes(clientSearch.toLowerCase()) && !selectedClient).map(c => (
                <button key={c.id} onClick={() => {setSelectedClient(c); setClientSearch(c.nome);}} className="w-full p-6 bg-zinc-900 hover:bg-blue-600 rounded-2xl flex justify-between items-center transition-all group">
                  <span className="font-black uppercase tracking-tighter">{c.nome}</span>
                  <CheckCircle2 className="opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2: SELEÇÃO DE PRODUTOS */}
        {step === 2 && (
          <div className="flex-1 animate-in slide-in-from-right-10 duration-500 flex flex-col">
            <h2 className="text-3xl font-black italic uppercase mb-8">O que o cliente levará?</h2>
            
            <div className="relative mb-6">
              <Search className="absolute left-5 top-5 text-zinc-600" size={20} />
              <input 
                placeholder="BUSCAR IPHONE, MACBOOK, ACESSÓRIO..."
                className="w-full bg-black border-2 border-zinc-900 p-5 pl-14 rounded-2xl font-bold focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-60 mb-6 space-y-2 pr-2 custom-scrollbar">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <button key={p.id} onClick={() => setCart([...cart, {...p, cartId: Math.random()}])} className="w-full p-4 bg-zinc-900 hover:border-blue-500 border border-transparent rounded-xl flex justify-between items-center">
                  <span className="font-black uppercase text-xs">{p.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-black text-blue-500">R$ {p.price.toLocaleString()}</span>
                    <PackagePlus size={20} className="text-zinc-700" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-black p-6 rounded-[2rem] border-2 border-zinc-900">
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-4">Itens no Carrinho ({cart.length})</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center text-xs font-bold border-b border-zinc-900 pb-2">
                    <span>{item.name}</span>
                    <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))}><Trash2 size={14} className="text-red-900" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PASSO 3: PAGAMENTO E FINALIZAÇÃO */}
        {step === 3 && (
          <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-3xl font-black italic uppercase mb-8">Como será o pagamento?</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {pagamentos.map((p, idx) => (
                <div key={idx} className="bg-black p-4 rounded-2xl border-2 border-zinc-900 focus-within:border-blue-500">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{p.metodo}</p>
                  <input 
                    type="number"
                    placeholder="0,00"
                    className="bg-transparent w-full font-mono font-black text-xl text-white outline-none"
                    value={p.valor || ''}
                    onChange={e => {
                      const np = [...pagamentos]; np[idx].valor = parseFloat(e.target.value) || 0; setPagamentos(np);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="bg-blue-600/10 border-2 border-blue-600/30 p-8 rounded-[2rem] flex justify-between items-center">
              <div>
                <p className="text-xs font-black uppercase text-blue-500">Total a Pagar</p>
                <p className="text-5xl font-black italic tracking-tighter">R$ {totalFinal.toLocaleString()}</p>
                {troco > 0 && <p className="text-green-500 font-bold uppercase text-xs mt-2">Troco: R$ {troco.toLocaleString()}</p>}
              </div>
              <button 
                onClick={handleFinalize}
                disabled={totalPago < totalFinal}
                className="bg-white text-black px-10 py-6 rounded-3xl font-black uppercase italic tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-20"
              >
                <Printer size={24} className="inline mr-2" /> Concluir
              </button>
            </div>
          </div>
        )}

        {/* CONTROLES DE NAVEGAÇÃO */}
        <div className="mt-auto pt-10 flex justify-between gap-6">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-5 bg-zinc-900 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3">
              <ArrowLeft size={20} /> Voltar
            </button>
          )}
          {step < 3 && (
            <button 
              onClick={() => setStep(step + 1)} 
              disabled={(step === 1 && !clientSearch && !selectedClient) || (step === 2 && cart.length === 0)}
              className="flex-1 py-5 bg-blue-600 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 disabled:opacity-20"
            >
              Próximo <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};