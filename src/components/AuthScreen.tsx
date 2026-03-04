import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Smartphone, KeyRound, ShieldCheck } from 'lucide-react';

export const AuthScreen = () => {
  const { login } = useStore();
  const [pin, setPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático no campo para agilizar a entrada
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAccess = () => {
    // Validação antes de processar
    if (pin.length < 7) {
      alert("⚠️ ALERTA DE SEGURANÇA: O código está incompleto. Digite os 7 dígitos cadastrados.");
      return;
    }
    login(pin);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 border-2 border-white/10">
            <Smartphone size={48} className="text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">iStock <span className="text-blue-500">Pro</span></h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-3 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Acesso Restrito por PIN
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <KeyRound className="absolute left-6 top-6 text-zinc-600" size={24} />
            <input 
              ref={inputRef}
              type="text" 
              inputMode="numeric"
              placeholder="0000000" 
              maxLength={7}
              autoComplete="off"
              className="w-full bg-black border-2 border-zinc-800 p-6 pl-16 rounded-[2rem] text-white font-black tracking-[0.6em] text-center text-3xl focus:border-blue-500 outline-none transition-all shadow-inner"
              value={pin} 
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
            />
          </div>
          
          <button 
            onClick={handleAccess}
            className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            <Lock size={22} /> Liberar Acesso (ENTER)
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-4 text-zinc-700 font-mono text-[9px] uppercase font-bold border-t border-zinc-800 pt-6">
          <span>Sidney: 7777777</span>
          <span className="text-zinc-800">|</span>
          <span>Vinícius: 1111111</span>
        </div>
      </div>
    </div>
  );
};