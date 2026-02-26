// src/views/Login.tsx
import { useState } from 'react';
import { Apple, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de autenticação para o MVP
    if (email.includes('admin')) {
      onLogin('Sidney Diretor');
    } else {
      onLogin('Vinícius Caixa');
    }
  };

  return (
    <div className="min-h-screen bg-aurora-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de fundo da Apple */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-aurora-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF9F0A]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-aurora-border p-10 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4 shadow-inner">
            <Apple size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">iStock <span className="font-light text-aurora-primary">Pro</span></h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Acesso Restrito</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray-500" />
            </div>
            <input 
              required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-aurora-border rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-aurora-primary transition-all placeholder-gray-600"
              placeholder="E-mail de acesso (ex: admin@istock.pro)"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-500" />
            </div>
            <input 
              required type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-aurora-border rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-aurora-primary transition-all placeholder-gray-600"
              placeholder="Senha segura"
            />
          </div>

          <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
            Entrar no Sistema <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}