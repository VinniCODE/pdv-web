import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Smartphone, KeyRound } from 'lucide-react';

export const AuthScreen = () => {
  const { login } = useStore();
  const [pin, setPin] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleAccess = () => {
    if (pin.length === 7) {
      login(pin);
    } else {
      alert("⚠️ ALERTA: O código deve ter exatamente 7 dígitos.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center">
            <Smartphone size={40} />
          </div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">iStock Pro</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Acesso por Código</p>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <KeyRound className="absolute left-5 top-5 text-zinc-600" size={20} />
            <input 
              ref={inputRef}
              type="text" 
              inputMode="numeric"
              placeholder="0000000" 
              maxLength={7}
              className="w-full bg-black border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-black tracking-[0.5em] text-center text-2xl focus:border-blue-500 outline-none"
              value={pin} 
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
            />
          </div>
          <button onClick={handleAccess} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            <Lock size={18} className="inline mr-2" /> Acessar
          </button>
        </div>
        <div className="mt-8 text-center text-[10px] text-zinc-600 font-mono">
          Sidney: 7777777 | Vinicius: 1111111
        </div>
      </div>
    </div>
  );
};