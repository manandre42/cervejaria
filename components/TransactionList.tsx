import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
    transactions: Transaction[];
    onBack: () => void;
}

const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onBack }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="text-slate-500 hover:text-brand-600">← Voltar</button>
                <h2 className="text-2xl font-bold text-brand-900">Histórico de Transações</h2>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{t.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${t.type === TransactionType.SALE ? 'bg-green-100 text-green-800' : 
                                          t.type === TransactionType.EXPENSE ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${t.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatKz(t.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-8 text-center text-slate-400">Não há transações registradas.</div>
                )}
            </div>
        </div>
    );
};