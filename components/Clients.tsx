import React, { useState } from 'react';
import { Plus, Users, Beer } from 'lucide-react';
import { Client, TransactionType } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (name: string) => void;
  onPayDebt: (clientId: string) => void;
}

const formatKz = (val: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);
};

export const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onPayDebt }) => {
  const [newClientName, setNewClientName] = useState('');

  const handleAdd = () => {
    if (newClientName.trim()) {
      onAddClient(newClientName);
      setNewClientName('');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-900">Gestão de Clientes & Kilapis</h2>
       </div>

       <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-100">
           <h4 className="text-sm font-semibold text-brand-500 uppercase mb-2">Adicionar Novo Cliente</h4>
           {/* CORREÇÃO: Layout responsivo (coluna em mobile, linha em desktop) para o botão não estrapolar */}
           <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="text" 
                 value={newClientName}
                 onChange={(e) => setNewClientName(e.target.value)}
                 placeholder="Nome do Cliente..."
                 className="w-full sm:flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
               />
               <button 
                 onClick={handleAdd}
                 className="w-full sm:w-auto bg-brand-500 text-white px-6 py-2 rounded-md hover:bg-brand-600 flex items-center justify-center gap-2 font-medium shadow-sm transition-colors"
               >
                   <Plus size={18} /> Adicionar
               </button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {clients.map(client => (
               <div key={client.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 relative group">
                   <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold text-lg">
                            {client.name.substring(0,2).toUpperCase()}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase">Dívida Total</p>
                            <p className={`text-xl font-bold ${client.debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatKz(client.debt)}
                            </p>
                        </div>
                   </div>
                   <h3 className="text-lg font-bold text-brand-900 mb-2">{client.name}</h3>
                   
                   <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-600 flex items-center gap-2">
                            <Beer size={16} /> Vasilhames devidos:
                        </span>
                        <span className="font-bold text-slate-800">{client.bottlesOwed}</span>
                   </div>

                   <div className="flex gap-2 mt-2">
                       <button 
                         onClick={() => onPayDebt(client.id)}
                         className="flex-1 bg-green-50 text-green-700 text-sm font-medium py-2 rounded hover:bg-green-100 border border-green-200 text-center transition-colors"
                       >
                           Pagar Kilapi
                       </button>
                   </div>
               </div>
           ))}
           {clients.length === 0 && (
               <div className="col-span-full text-center py-10 text-slate-400">
                   <Users size={48} className="mx-auto mb-2 opacity-50" />
                   <p>Nenhum cliente registado ainda.</p>
               </div>
           )}
       </div>
    </div>
  );
};