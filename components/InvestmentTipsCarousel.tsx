import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, ShieldAlert, Coins } from 'lucide-react';

const TIPS = [
  {
    icon: <Coins className="w-6 h-6 text-yellow-500" />,
    title: "Reinvestimento Inteligente",
    text: "Tente reinvestir pelo menos 30% do lucro em stock novo. Stock parado é dinheiro perdido, mas stock a girar é riqueza."
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
    title: "Controle de Kilapis",
    text: "Defina um limite máximo de crédito por cliente. Se o kilapi passar de 50.000 Kz, bloqueie novas vendas até pagar metade."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
    title: "Vasilhame é Ativo",
    text: "Trate as caixas vazias como dinheiro. Perder vasilhame é o maior custo invisível de um distribuidor."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-brand-500" />,
    title: "Fundo de Emergência",
    text: "Separe 5% de cada venda para um fundo de manutenção (freezers, carrinha, gerador). Não espere quebrar para arranjar."
  }
];

export const InvestmentTipsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-brand-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden mb-8 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <TrendingUp size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 opacity-80">
            <span className="text-xs font-bold tracking-widest uppercase bg-white/10 px-2 py-1 rounded">Dica Rápida</span>
            <div className="flex gap-1">
                {TIPS.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-brand-400' : 'w-1.5 bg-slate-600'}`}
                    />
                ))}
            </div>
        </div>

        <div className="min-h-[100px] flex flex-col justify-center transition-opacity duration-500 ease-in-out">
            <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    {TIPS[currentIndex].icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{TIPS[currentIndex].title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                        {TIPS[currentIndex].text}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};