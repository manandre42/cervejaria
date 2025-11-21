import { useState, useEffect, useMemo } from 'react';
import { Transaction, Client, BusinessData } from '../types';
import { firebaseService } from '../services/firebase';

export const useBusinessData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Se o Firebase estiver configurado, usamos ele. Se não, usamos LocalStorage.
  const useFirebase = firebaseService.isConfigured();

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    if (useFirebase) {
      // Modo Online (Firebase)
      const unsubTrans = firebaseService.subscribeTransactions((data) => {
        setTransactions(data);
        setLoading(false);
      });
      
      const unsubClients = firebaseService.subscribeClients((data) => {
        setClients(data);
      });

      return () => {
        unsubTrans();
        unsubClients();
      };
    } else {
      // Modo Offline (LocalStorage) - Fallback para a demo funcionar
      const saved = localStorage.getItem('cerveja_app_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTransactions(parsed.transactions || []);
        setClients(parsed.clients || []);
      }
      setLoading(false);
    }
  }, [useFirebase]);

  // --- PERSISTÊNCIA NO MODO OFFLINE ---
  useEffect(() => {
    if (!useFirebase && !loading) {
      localStorage.setItem('cerveja_app_data_v1', JSON.stringify({
        transactions,
        clients,
        cashBalance: 0 // Calculado dinamicamente
      }));
    }
  }, [transactions, clients, useFirebase, loading]);

  // --- AÇÕES ---

  const addTransaction = async (tx: Transaction) => {
    if (useFirebase) {
      await firebaseService.addTransaction(tx);
      // Atualizar cliente se necessário (ex: dívida)
      if (tx.clientId) {
        const client = clients.find(c => c.id === tx.clientId);
        if (client) {
          // A lógica de atualização do cliente é recalculada baseada no novo estado
          // Mas para consistência atômica no Firestore, idealmente usaria transactions ou cloud functions.
          // Aqui faremos uma atualização otimista simples no cliente.
          let updatedClient = { ...client };
          
          // Lógica simplificada de atualização do cliente replicada do App.tsx original
          // Nota: Em uma app real firebase, isso deveria ser feito no backend ou numa transaction do firestore
          // Aqui fazemos no cliente para manter a simplicidade solicitada
          
          // Esta lógica específica é tratada dentro do App.tsx antes de chamar este hook
          // ou o App.tsx passa o cliente já atualizado.
          // Vamos mudar a abordagem: O App.tsx calcula o novo estado do cliente e chama updateClient.
        }
      }
    } else {
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const addClient = async (client: Client) => {
    if (useFirebase) {
      await firebaseService.addClient(client);
    } else {
      setClients(prev => [...prev, client]);
    }
  };

  const updateClient = async (client: Client) => {
    if (useFirebase) {
      await firebaseService.updateClient(client);
    } else {
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
    }
  };

  // --- DADOS DERIVADOS ---
  
  // Recalcular saldo baseado em todas as transações para garantir consistência
  const cashBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'VENDA') return acc + t.amount;
      if (t.type === 'DESPESA') return acc - t.amount;
      if (t.type === 'PAGAMENTO_KILAPI') return acc + t.amount;
      return acc;
    }, 0);
  }, [transactions]);

  const data: BusinessData = {
    transactions,
    clients,
    cashBalance
  };

  return {
    data,
    loading,
    isOffline: !useFirebase,
    actions: {
      addTransaction,
      addClient,
      updateClient
    }
  };
};