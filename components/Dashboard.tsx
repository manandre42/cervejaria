import React, { useMemo } from 'react';
import { Wallet, Users, Beer, TrendingUp, Minus, ArrowRightLeft } from 'lucide-react';
import { StatCard } from './StatCard';
import { BusinessData, TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  data: BusinessData;
  onNavigate: (view: 'TRANSACTIONS') => void;
}

const formatKz = (val: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);
};

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate }) => {
  const totalDebt = useMemo(() => data.clients.reduce((acc, c) => acc + c.debt, 0), [data.clients]);
  const totalBottlesOwed = useMemo(() => data.clients.reduce((acc, c) => acc + c.bottlesOwed, 0), [data.clients]);
  const recentTransactions = data.transactions.slice(0, 5);

  const chartData = useMemo(() => {
    return [...data.transactions].reverse().slice(-10).map((t, i) => ({
        name: i.toString(),
        amount: t.type === TransactionType.EXPENSE ? -t.amount : t.amount
    }));
  }, [data.transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Caixa Atual" 
          value={formatKz(data.cashBalance)} 
          icon={<Wallet className="w-6 h-6 text-brand-500" />} 
          colorClass="text-brand-900"
        />
        <StatCard 
          title="Total Kilapis" 
          value={formatKz(totalDebt)} 
          icon={<Users className="w-6 h-6 text-red-500" />} 
          colorClass="text-red-600"
          subtext="Dinheiro na rua"
        />
        <StatCard 
          title="Vasilhames em Falta" 
          value={totalBottlesOwed} 
          icon={<Beer className="w-6 h-6 text-orange-500" />} 
          colorClass="text-orange-600"
          subtext="Caixas/Garrafas com clientes"
        />
        <StatCard 
          title="Lucro Estimado" 
          value={formatKz(data.cashBalance - totalDebt * 0.2)} 
          icon={<TrendingUp className="w-6 h-6 text-green-500" />} 
          colorClass="text-green-600"
          subtext="Baseado no fluxo atual"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-100">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Fluxo Financeiro Recente</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis hide />
                    <YAxis hide />
                    <Tooltip formatter={(val: number) => formatKz(val)} />
                    <Line type="monotone" dataKey="amount" stroke="#4a6da7" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border border-brand-100 overflow-hidden">
        <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-brand-900">Últimos Movimentos</h3>
            <button onClick={() => onNavigate('TRANSACTIONS')} className="text-sm text-brand-600 hover:underline">Ver tudo</button>
        </div>
        <div className="divide-y divide-brand-100">
            {recentTransactions.length === 0 ? (
                <p className="p-4 text-slate-500 text-center">Nenhum movimento ainda.</p>
            ) : (
                recentTransactions.map(t => (
                    <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                                t.type === TransactionType.SALE ? 'bg-green-100 text-green-600' :
                                t.type === TransactionType.EXPENSE ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {t.type === TransactionType.SALE && <TrendingUp size={16} />}
                                {t.type === TransactionType.EXPENSE && <Minus size={16} />}
                                {t.type === TransactionType.DEBT_PAYMENT && <ArrowRightLeft size={16} />}
                            </div>
                            <div>
                                <p className="font-medium text-brand-900">{t.description}</p>
                                <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`font-bold ${t.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-green-600'}`}>
                            {t.type === TransactionType.EXPENSE ? '-' : '+'}{formatKz(t.amount)}
                        </span>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};