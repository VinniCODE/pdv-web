import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Share2, Printer, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Receipt = ({ sale, onClose }: { sale: any, onClose: () => void }) => {
  const { config } = useStore();

  // Simulação de Chave PIX Aleatória
  const pixPayload = `00020126580014BR.GOV.BCB.PIX0136${config.slug}-pix-key-random-1235204000053039865802BR5913${config.name}6006RECIFE62070503***6304`;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-black w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header do Recibo */}
        <div className="p-6 text-center border-b border-dashed border-zinc-300">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400"><X /></button>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-bold text-xl uppercase">{config.name}</h2>
          <p className="text-xs text-zinc-500">Recibo de Venda #{sale.id}</p>
          <p className="text-xs text-zinc-400">{new Date().toLocaleString()}</p>
        </div>

        {/* Detalhes da Venda */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Vendedor:</span>
            <span className="font-bold">{sale.vendedor}</span>
          </div>
          
          <div className="border-t border-zinc-100 pt-4">
            {sale.items?.map((item: any) => (
              <div key={item.cartId} className="flex justify-between text-sm mb-2">
                <span>1x {item.name}</span>
                <span className="font-mono">R$ {item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">TOTAL</span>
            <span className="font-bold text-2xl">R$ {sale.total.toLocaleString()}</span>
          </div>
        </div>

        {/* QR Code PIX Simulado */}
        <div className="bg-zinc-50 p-6 flex flex-col items-center border-t border-zinc-200">
          <p className="text-[10px] font-bold text-zinc-400 mb-3 uppercase tracking-widest">Pagamento via PIX</p>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <QRCodeSVG value={pixPayload} size={150} />
          </div>
          <p className="text-[10px] text-zinc-400 mt-4 text-center">Escaneie para pagar ou confira o comprovante no banco.</p>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-zinc-100 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all">
            <Printer size={18} /> Imprimir
          </button>
          <button 
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Share2 size={18} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};