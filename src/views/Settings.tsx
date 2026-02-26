// src/views/Settings.tsx
import { useState } from 'react';
import { Users, Shield, Database, Plus, Edit, Trash2, CheckCircle2, CloudOff } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Operador' | 'Visualizador';
  status: 'Ativo' | 'Bloqueado';
}

export function Settings() {
  // Mock de usuários do sistema
  const [users] = useState<User[]>([
    { id: 'u1', name: 'Sidney Admin', email: 'admin@sidneyiphones.com', role: 'Administrador', status: 'Ativo' },
    { id: 'u2', name: 'Lucas Caixa', email: 'lucas@sidneyiphones.com', role: 'Operador', status: 'Ativo' },
    { id: 'u3', name: 'Contabilidade', email: 'contabil@sidneyiphones.com', role: 'Visualizador', status: 'Ativo' },
  ]);

  return (
    <div className="flex flex-col space-y-6 h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Configurações do Sistema</h2>
          <p className="text-gray-400 mt-1">Gerenciamento de acessos, segurança e sincronização.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna Principal: Gestão de Usuários (Ocupa 2/3) */}
        <div className="col-span-2 flex flex-col space-y-6">
          <div className="bg-aurora-card rounded-xl border border-aurora-border shadow-lg flex-1">
            <div className="p-6 border-b border-aurora-border flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Users className="text-aurora-primary" size={20} />
                Usuários e Permissões
              </h3>
              <button className="bg-aurora-dark border border-aurora-border hover:border-aurora-primary text-aurora-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold">
                <Plus size={16} />
                Novo Usuário
              </button>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-aurora-border bg-aurora-dark/30">
                    <th className="p-4 text-gray-400 font-medium text-sm">Nome</th>
                    <th className="p-4 text-gray-400 font-medium text-sm">Nível de Acesso</th>
                    <th className="p-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="p-4 text-gray-400 font-medium text-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurora-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-aurora-dark/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          user.role === 'Administrador' ? 'bg-aurora-accent/10 text-aurora-accent border-aurora-accent/20' :
                          user.role === 'Operador' ? 'bg-aurora-primary/10 text-aurora-primary border-aurora-primary/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-300">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-4 flex justify-end gap-3">
                        <button className="text-gray-400 hover:text-aurora-primary transition-colors p-1" title="Editar Permissões">
                          <Edit size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-400 transition-colors p-1" title="Bloquear Usuário">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Status do Sistema (Ocupa 1/3) */}
        <div className="col-span-1 flex flex-col space-y-6">
          {/* Card de Sincronização (Offline-First) */}
          <div className="bg-aurora-card p-6 rounded-xl border border-aurora-border shadow-lg">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Database className="text-aurora-accent" size={20} />
              Status do Banco de Dados
            </h3>
            
            <div className="space-y-4">
              <div className="bg-aurora-dark p-4 rounded-lg border border-aurora-border flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm">Banco Local (RxDB)</h4>
                  <p className="text-xs text-gray-500 mt-1">Armazenamento local funcionando. Modo offline habilitado.</p>
                </div>
              </div>

              <div className="bg-aurora-dark p-4 rounded-lg border border-aurora-border flex items-start gap-3 opacity-60">
                <CloudOff className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm">Nuvem (Supabase)</h4>
                  <p className="text-xs text-gray-500 mt-1">Sincronização pendente de configuração.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Segurança */}
          <div className="bg-aurora-card p-6 rounded-xl border border-aurora-border shadow-lg">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="text-yellow-500" size={20} />
              Segurança
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between items-center border-b border-aurora-border pb-2">
                <span>Tenant ID Atual:</span>
                <span className="font-mono text-aurora-primary">sidney-001</span>
              </li>
              <li className="flex justify-between items-center border-b border-aurora-border pb-2">
                <span>Logs de Auditoria:</span>
                <span className="text-white">Ativos</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sessão expira em:</span>
                <span className="text-white">8 horas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}