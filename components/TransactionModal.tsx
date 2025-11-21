import React, { useState, useEffect } from 'react';
import { Save, Minus, Plus } from 'lucide-react';
import { TransactionType, Client } from '../types';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    onAddDebt: (data: any) => void; // Separate handler for Debt
    initialType: TransactionType;
    clients: Client[];
    initialClientId?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
    isOpen, onClose, onSubmit, onAddDebt, initialType, clients, initialClientId 
}) => {
    const [type, setType] = useState<TransactionType>(initialType);
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [bottlesMoved, setBottlesMoved] = useState<number>(0);
    const [bottlesReturned, setBottlesReturned] = useState<boolean>(true);

    useEffect(() => {
        if (isOpen) {
            setType(initialType);
            setSelectedClientId(initialClientId || '');
            setAmount('');
            setDesc('');
            setBottlesMoved(0);
            setBottlesReturned(true);
        }
    }, [isOpen, initialType, initialClientId]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            alert("Insira um valor válido.");
            return;
        }
        onSubmit({
            type,
            amount: val,
            description: desc,
            clientId: selectedClientId,
            bottlesMoved,
            bottlesReturned
        });
    };

    const handleDebt = () => {
        const val = parseFloat(amount);
        if (isNaN(val)) return; // Allow 0 for pure bottle debt? Let's strictly require logic in parent, but here check amount
        if (!selectedClientId) {
            alert("Selecione um cliente para o Kilapi.");
            return;
        }
        onAddDebt({
            amount: val,
            description: desc,
            clientId: selectedClientId,
            bottlesMoved,
            bottlesReturned
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
            <div className="bg-white w-full md:max-w-md md:rounded-xl rounded-t-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-brand-900">
                        {type === TransactionType.SALE ? 'Registrar Venda' : 
                         type === TransactionType.EXPENSE ? 'Registrar Despesa' : 'Pagar Kilapi'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                {type !== TransactionType.DEBT_PAYMENT && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <button 
                          onClick={() => setType(TransactionType.SALE)}
                          className={`py-2 rounded text-sm font-medium ${type === TransactionType.SALE ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-slate-100 text-slate-600'}`}
                        >Venda</button>
                        <button 
                           onClick={() => setType(TransactionType.EXPENSE)}
                           className={`py-2 rounded text-sm font-medium ${type === TransactionType.EXPENSE ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-slate-100 text-slate-600'}`}
                        >Despesa</button>
                        <button 
                           onClick={() => alert("Para registar um Kilapi, selecione um cliente abaixo e clique 'Adicionar como Kilapi'.")}
                           className={`py-2 rounded text-sm font-medium bg-orange-100 text-orange-700`}
                        >Kilapi</button>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Valor (Kz)</label>
                        <input 
                          type="number" 
                          value={amount} 
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full text-2xl font-bold p-3 border border-slate-300 rounded focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                          placeholder="0.00"
                          autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                        <input 
                          type="text" 
                          value={desc} 
                          onChange={(e) => setDesc(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded outline-none focus:border-brand-500"
                          placeholder={type === TransactionType.SALE ? "Ex: 5 Cervejas Cuca" : "Ex: Compra de Gelo"}
                        />
                    </div>

                    {(type === TransactionType.SALE || type === TransactionType.DEBT_PAYMENT) && (
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente {type === TransactionType.SALE ? '(Opcional)' : '(Obrigatório)'}</label>
                            <select 
                              value={selectedClientId} 
                              onChange={(e) => setSelectedClientId(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded bg-white"
                            >
                                <option value="">Cliente Avulso</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(type === TransactionType.SALE || type === TransactionType.DEBT_PAYMENT) && (
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="flex justify-between items-center mb-2">
                               <label className="block text-sm font-medium text-slate-700">Vasilhames (Caixas)</label>
                               <div className="flex items-center gap-2">
                                  <button onClick={() => setBottlesMoved(Math.max(0, bottlesMoved - 1))} className="bg-white p-1 border rounded shadow-sm"><Minus size={14}/></button>
                                  <span className="font-bold text-lg w-8 text-center">{bottlesMoved}</span>
                                  <button onClick={() => setBottlesMoved(bottlesMoved + 1)} className="bg-white p-1 border rounded shadow-sm"><Plus size={14}/></button>
                               </div>
                           </div>
                           {bottlesMoved > 0 && (
                               <div className="flex items-center gap-2 mt-2">
                                   <input 
                                     type="checkbox" 
                                     id="returned" 
                                     checked={bottlesReturned} 
                                     onChange={(e) => setBottlesReturned(e.target.checked)}
                                     className="w-5 h-5 text-brand-600 rounded"
                                   />
                                   <label htmlFor="returned" className="text-sm text-slate-700">
                                       {type === TransactionType.SALE ? "Entregou os vazios?" : "Recebendo vazios?"}
                                   </label>
                               </div>
                           )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        {type === TransactionType.SALE && selectedClientId && (
                            <button 
                              onClick={handleDebt}
                              className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold"
                            >
                                Kilapi
                            </button>
                        )}
                        <button 
                          onClick={handleSubmit}
                          className={`${(type === TransactionType.SALE && selectedClientId) ? 'col-span-1' : 'col-span-2'} bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2`}
                        >
                            <Save size={20} /> {type === TransactionType.SALE ? 'Salvar Venda' : type === TransactionType.EXPENSE ? 'Salvar Despesa' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};