// src/views/POS.tsx
import { useState, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, QrCode, CheckCircle2, Package, Smartphone, Watch, Headphones, Cable } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Adicionamos a interface para receber o nome de quem fez o login
interface POSProps {
  operatorName?: string;
}

export function POS({ operatorName = 'Operador Padrão' }: POSProps) {
  const { products, cart, addToCartBySku, removeFromCart, checkout } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
  }, [searchQuery, products]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cart_quantity), 0);

  const handleSelectProduct = (sku: string) => {
    const success = addToCartBySku(sku);
    if (success) {
      setSearchQuery('');
      setError('');
    } else {
      setError('Produto sem estoque ou inválido!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) handleSelectProduct(suggestions[0].sku);
      else if (searchQuery.trim() !== '') handleSelectProduct(searchQuery); 
    }
  };

  const getProductIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('watch')) return <Watch size={24} className="text-white" />;
    if (lower.includes('airpods')) return <Headphones size={24} className="text-white" />;
    if (lower.includes('cabo') || lower.includes('fonte') || lower.includes('capa')) return <Cable size={24} className="text-white" />;
    return <Smartphone size={24} className="text-white" />; 
  };

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 flex flex-col space-y-4">
        <header>
          <h2 className="text-3xl font-bold text-white tracking-tight">Caixa Livre</h2>
          {/* Mostra o nome do operador logado aqui */}
          <p className="text-gray-400 mt-1">Operador: {operatorName} | Turno: Atual</p>
        </header>

        <div className="relative z-50">
          <div className="bg-aurora-card p-4 rounded-2xl border border-aurora-border flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-aurora-dark p-3 rounded-xl border border-aurora-border">
                <Search className="text-aurora-primary" size={24} />
              </div>
              <input 
                type="text" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Busque por nome ou SKU (Ex: IPH15, Cabo, AirPods)..." 
                className="flex-1 bg-transparent text-xl text-white focus:outline-none placeholder-gray-500 font-mono"
              />
            </div>
            {error && <p className="text-aurora-accent text-sm font-medium ml-16">{error}</p>}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-[110%] left-0 w-full bg-[#2C2C2E] border border-[#48484A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden max-h-[400px] overflow-y-auto">
              <div className="bg-[#3A3A3C] px-4 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider">Resultados da busca</div>
              {suggestions.map((product) => (
                <div key={product.id} onClick={() => handleSelectProduct(product.sku)} className={`p-4 flex items-center justify-between border-b border-[#3A3A3C] last:border-0 cursor-pointer transition-all ${(product.stock_current > 0 || product.category === 'Serviços') ? 'hover:bg-[#3A3A3C]' : 'opacity-40 cursor-not-allowed'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center border border-[#48484A] shadow-inner">
                      {getProductIcon(product.name)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-black/50 text-gray-300 text-xs px-2 py-0.5 rounded font-mono border border-[#48484A]">{product.sku}</span>
                        <span className="text-gray-400 text-xs">{product.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right pr-2">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Estoque</span>
                      <span className={`flex items-center gap-1 font-bold text-lg bg-black/30 px-3 py-1 rounded-lg border border-[#48484A] ${(product.stock_current > 0 || product.category === 'Serviços') ? 'text-green-400' : 'text-red-400'}`}>
                        {product.category === 'Serviços' ? 'Ilimitado' : <><Package size={16} />{product.stock_current}</>}
                      </span>
                    </div>
                    <div className="w-32">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Preço Final</span>
                      <p className="text-aurora-primary font-bold text-xl tracking-tight">R$ {product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-aurora-card rounded-2xl border border-aurora-border flex-1 overflow-hidden flex flex-col shadow-sm relative z-10">
          <div className="bg-black/20 p-4 border-b border-aurora-border flex justify-between items-center">
            <h3 className="font-bold text-gray-300 flex items-center gap-2"><ShoppingCart size={18} /> Itens da Venda</h3>
            <span className="bg-aurora-primary text-white px-3 py-1 rounded-full text-sm font-bold">{cart.length} itens</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-aurora-border group transition-all hover:border-aurora-primary/50">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono font-bold text-lg w-6">{index + 1}</span>
                  <div className="w-10 h-10 bg-[#2C2C2E] rounded-lg flex items-center justify-center border border-aurora-border">{getProductIcon(item.name)}</div>
                  <div>
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{item.cart_quantity}x R$ {item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <p className="text-white font-bold text-lg">R$ {(item.price * item.cart_quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                <ShoppingCart size={48} className="mb-4" />
                <p>O carrinho está vazio.</p>
                <p className="text-sm mt-1">Digite algo na busca para ver o catálogo.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-96 flex flex-col space-y-4 relative z-10">
        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border shadow-sm">
          <h3 className="font-bold text-white mb-6 border-b border-aurora-border pb-4">Resumo do Pedido</h3>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>R$ {subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between text-3xl font-bold text-white pt-4 border-t border-aurora-border mt-4"><span>Total</span><span>R$ {subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
          </div>
        </div>

        <div className="bg-aurora-card p-6 rounded-2xl border border-aurora-border flex-1 shadow-sm flex flex-col">
          <h3 className="font-bold text-white mb-4">Pagamento</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-aurora-primary bg-aurora-primary/10 text-aurora-primary transition-all"><QrCode size={28} className="mb-2" /><span className="font-bold mt-1">PIX</span></button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-aurora-border bg-black/40 text-gray-400 hover:border-gray-300 hover:text-white transition-all"><CreditCard size={28} className="mb-2" /><span className="font-bold mt-1">Cartão</span></button>
          </div>
          {/* CORREÇÃO DO ERRO AQUI: ()=> checkout(operatorName) */}
          <button 
            onClick={() => checkout(operatorName)}
            disabled={cart.length === 0}
            className="w-full bg-[#F5F5F7] hover:bg-white disabled:bg-[#3A3A3C] disabled:text-gray-500 text-black font-bold text-xl py-4 rounded-xl flex items-center justify-center gap-3 transition-colors mt-auto"
          >
            <CheckCircle2 size={24} />
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}