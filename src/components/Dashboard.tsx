import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  FileText, 
  RotateCcw, 
  BarChart2, 
  Banknote, 
  ShoppingBag, 
  Target, 
  TrendingUp, 
  History, 
  UserCircle2,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';

export const Dashboard = () => {
  const { sales, config, performance, handleReturn } = useStore();

  // Função para Gerar Contrato com Garantia de 3 Meses
  const imprimirContrato = (sale: any) => {
    const doc = new jsPDF();
    
    // Cabeçalho da Loja
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(config.name.toUpperCase(), 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text("CERTIFICADO DE GARANTIA E CONTRATO DE VENDA", 105, 30, { align: 'center' });
    
    // Dados do Cliente e Venda
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`VENDEDOR: ${sale.vendedor}`, 20, 50);
    doc.text(`COMPRADOR: ${sale.cliente}`, 20, 56);
    doc.text(`DATA DA COMPRA: ${new Date(sale.data).toLocaleString()}`, 20, 62);
    doc.text(`ID DA TRANSAÇÃO: #${sale.id}`, 20, 68);

    // Listagem de Produtos
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIÇÃO DOS PRODUTOS:", 20, 85);
    doc.setFont("helvetica", "normal");
    sale.cart.forEach((item: any, i: number) => {
      doc.text(`- ${item.name}: R$ ${item.price.toLocaleString()}`, 25, 95 + (i * 7));
    });

    // Cláusula de Garantia de 90 Dias
    doc.setFont("helvetica", "bold");
    doc.text("TERMOS DE GARANTIA (VIGÊNCIA DE 3 MESES):", 20, 140);
    doc.setFont("helvetica", "normal");
    const termo = `A ${config.name} assegura garantia total de 90 dias (3 meses) para os produtos listados acima, contados a partir da data de emissão deste contrato. Esta garantia cobre exclusivamente defeitos de fabricação de componentes eletrônicos. A cobertura será imediatamente anulada em caso de: quedas, contato com líquidos (oxidação), sinais de mau uso físico ou abertura do aparelho por assistência técnica não autorizada.`;
    doc.text(doc.splitTextToSize(termo, 170), 20, 150);

    // Rodapé para Assinatura
    doc.text("__________________________________________", 105, 210, { align: 'center' });
    doc.text("ASSINATURA DO COMPRADOR / CLIENTE", 105, 215, { align: 'center' });
    
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="p-4 md:p-10 bg-black text-white min-h-screen pb-32">
      
      {/* INDICADORES GIGANTES (RESPONSIVOS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-xl group hover:border-blue-500 transition-all">
          <Banknote className="text-green-500 mb-4" size={32} />
          <p className="text-xs uppercase font-black text-zinc-500 tracking-widest">Receita Total</p>
          <p className="text-3xl font-black font-mono">R$ {performance.totalVendido.toLocaleString()}</p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-xl group hover:border-blue-500 transition-all">
          <Target className="text-blue-500 mb-4" size={32} />
          <p className="text-xs uppercase font-black text-zinc-500 tracking-widest">Meta Mensal</p>
          <p className="text-3xl font-black font-mono">{performance.percentualMeta.toFixed(1)}%</p>
          <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, performance.percentualMeta)}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-xl group hover:border-blue-500 transition-all">
          <TrendingUp className="text-purple-500 mb-4" size={32} />
          <p className="text-xs uppercase font-black text-zinc-500 tracking-widest">Taxa de Comissão</p>
          <p className="text-3xl font-black font-mono">{performance.commissionRate}%</p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-xl group hover:border-blue-500 transition-all">
          <ShoppingBag className="text-orange-500 mb-4" size={32} />
          <p className="text-xs uppercase font-black text-zinc-500 tracking-widest">Vendas Concluídas</p>
          <p className="text-3xl font-black font-mono">{sales.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <History className="text-blue-500" size={28} />
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Histórico de Auditoria</h3>
      </div>

      {/* LISTA DE ATIVIDADES COM CONTRATO */}
      <div className="space-y-4">
        {sales.map((sale: any) => (
          <div key={sale.id} className="bg-zinc-950 p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="hidden sm:flex p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-700">
                <UserCircle2 size={32} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-black uppercase tracking-tighter text-white">{sale.cliente}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-1">
                  ID: #{sale.id} • PAGAMENTO: {sale.metodo} • VENDEDOR: {sale.vendedor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-center">
              <span className="text-3xl font-mono font-black text-blue-500 mr-4">R$ {sale.total.toLocaleString()}</span>
              
              {/* Botão de Garantia/Contrato */}
              <button 
                onClick={() => imprimirContrato(sale)}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-blue-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border border-zinc-800 group"
                title="Gerar Garantia"
              >
                <FileText size={20} className="text-blue-500 group-hover:text-white" />
                <span className="hidden sm:block">Contrato</span>
              </button>

              {/* Botão de Devolução */}
              <button 
                onClick={() => handleReturn(sale.id)} 
                className="p-4 bg-zinc-900 hover:bg-red-600/10 hover:text-red-500 rounded-2xl border border-zinc-800 transition-all"
                title="Estornar Venda"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};