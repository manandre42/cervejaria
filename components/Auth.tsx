import React, { useState } from 'react';
import { Beer, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

// --- SPLASH SCREEN ---
export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-brand-900 flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-4 rounded-full mb-6 shadow-2xl animate-bounce">
        <Beer size={48} className="text-brand-600" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Gestor Cerveja Pro</h1>
      <p className="text-brand-200 text-sm tracking-widest uppercase">Sistema de Gestão Inteligente</p>
      
      <div className="mt-12 w-48 h-1 bg-brand-800 rounded-full overflow-hidden">
        <div className="h-full bg-brand-400 animate-[width_2s_ease-in-out_infinite]" style={{ width: '50%' }}></div>
      </div>
    </div>
  );
};

// --- LOGIN SCREEN ---
interface LoginScreenProps {
  onLogin: (success: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Deuma'); // Pre-filled as requested
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulating network delay for better UX
    setTimeout(() => {
      if (username === 'Deuma' && password === '1234') {
        onLogin(true);
      } else {
        setError('Credenciais incorretas. Tente novamente.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in">
        <div className="bg-brand-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
             <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
          <p className="text-brand-100 mt-2 text-sm">Insira suas credenciais para acessar</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Utilizador</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="Seu nome de utilizador"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Palavra-passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Protegido por Gestor Cerveja Pro v1.0</p>
        </div>
      </div>
    </div>
  );
};
