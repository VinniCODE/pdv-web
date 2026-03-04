import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Smartphone, KeyRound } from 'lucide-react';

export const Login = () => {
  const { login } = useStore();
  const [pin, setPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = () => {
    if (pin.length !== 7) return alert("O código deve ter 7 dígitos.");
    login(pin);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Smartphone size={40} />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">iStock Pro</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Acesso por Código Único</p>
        </div>

        <div className="space-y-4" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
          <div className="relative">
            <KeyRound className="absolute left-5 top-5 text-zinc-600" size={20} />
            <input 
              ref={inputRef}
              type="text" 
              inputMode="numeric"
              placeholder="DIGITE SEU CÓDIGO" 
              maxLength={7}
              className="w-full bg-zinc-950 border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-black tracking-[0.5em] text-center placeholder:text-zinc-600 placeholder:tracking-normal focus:border-blue-500 outline-none transition-all"
              value={pin} 
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} 
            />
          </div>
          
          <button 
            type="button" 
            onClick={handleLogin}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest mt-4 flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-xl"
          >
            <Lock size={18} /> Acessar Sistema
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] text-zinc-600 font-mono space-y-1 opacity-50">
          <p>Sidney: 7777777 | Vinícius: 1111111</p>
        </div>
      </div>
    </div>
  );
};