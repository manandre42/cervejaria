import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Beer, 
  Plus, 
  BrainCircuit
} from 'lucide-react';
import { Transaction, TransactionType, Client } from './types';
import { getBusinessAdvice } from './services/geminiService';
import { useBusinessData } from './hooks/useBusinessData';

// Components
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { SplashScreen, LoginScreen } from './components/Auth';
import { InvestmentTipsCarousel } from './components/InvestmentTipsCarousel';

const App: React.FC = () => {
  // --- Auth & Splash State ---
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- App State ---
  const [view, setView] = useState<'DASHBOARD' | 'TRANSACTIONS' | 'CLIENTS' | 'ADVISOR'>('DASHBOARD');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.SALE);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);

  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // --- Data Hook (Firebase/Local abstraction) ---
  const { data, loading: dataLoading, isOffline, actions } = useBusinessData();

  // --- Splash Effect ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleAddClient = (name: string) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: name,
      debt: 0,
      bottlesOwed: 0
    };
    actions.addClient(newClient);
  };

  const handleTransactionSubmit = (form: any) => {
    const { type, amount, description, clientId, bottlesMoved, bottlesReturned } = form;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: type,
      amount: amount,
      description: description || (type === TransactionType.SALE ? 'Venda Diversa' : 'Despesa'),
      date: new Date().toISOString(),
      clientId: clientId || undefined,
      bottlesOut: (!bottlesReturned && type === TransactionType.SALE) ? bottlesMoved : 0,
      bottlesIn: (type === TransactionType.DEBT_PAYMENT) ? bottlesMoved : 0
    };

    // Atualizar cliente (Logica de Negócio Simplificada)
    if (clientId) {
      const client = data.clients.find(c => c.id === clientId);
      if (client) {
        let updatedClient = { ...client };
        
        if (type === TransactionType.SALE) {
           if (!bottlesReturned && bottlesMoved > 0) {
             updatedClient.bottlesOwed += bottlesMoved;
           }
        } else if (type === TransactionType.DEBT_PAYMENT) {
           updatedClient.debt = Math.max(0, updatedClient.debt - amount);
           if (bottlesMoved > 0) {
             updatedClient.bottlesOwed = Math.max(0, updatedClient.bottlesOwed - bottlesMoved);
           }
        }
        actions.updateClient(updatedClient);
      }
    }

    actions.addTransaction(newTx);
    setModalOpen(false);
  };

  const handleDebtSubmit = (form: any) => {
    const { amount, description, clientId, bottlesMoved, bottlesReturned } = form;

    if (clientId) {
      const client = data.clients.find(c => c.id === clientId);
      if (client) {
        let updatedClient = { ...client };
        updatedClient.debt += amount;
        if (!bottlesReturned && bottlesMoved > 0) {
          updatedClient.bottlesOwed += bottlesMoved;
        }
        actions.updateClient(updatedClient);
      }
    }

    const newTx: Transaction = {
        id: Date.now().toString(),
        type: TransactionType.SALE, 
        amount: 0, 
        description: `KILAPI: ${description} (${new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount)})`,
        date: new Date().toISOString(),
        clientId: clientId
    };
    
    actions.addTransaction(newTx);
    setModalOpen(false);
  };

  const handleGetAdvice = async () => {
    setAiLoading(true);
    const advice = await getBusinessAdvice(data);
    setAiAdvice(advice);
    setAiLoading(false);
  };

  // --- Render Logic based on Auth/Splash ---

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- Main App Render ---
  if (dataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-brand-600 font-bold">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans pb-20 md:pb-0 animate-fade-in">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded text-white">
                <Beer size={20} />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-brand-900 tracking-tight leading-none">Gestor Cerveja Pro</span>
                {isOffline && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Modo Offline (Sem Firebase)</span>}
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {[
                { id: 'DASHBOARD', label: 'Visão Geral', icon: LayoutDashboard },
                { id: 'CLIENTS', label: 'Clientes & Kilapis', icon: Users },
                { id: 'ADVISOR', label: 'Consultor IA', icon: BrainCircuit },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        view === item.id ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-brand-600'
                    }`}
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
            ))}
          </nav>

          {/* New Transaction Button (Desktop) */}
          <div className="hidden md:block">
              <button 
                onClick={() => {
                    setModalType(TransactionType.SALE);
                    setSelectedClientId(undefined);
                    setModalOpen(true);
                }}
                className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 shadow-sm flex items-center gap-2"
              >
                  <Plus size={16} /> Novo Movimento
              </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'DASHBOARD' && <Dashboard data={data} onNavigate={(v) => setView(v)} />}
        {view === 'TRANSACTIONS' && <TransactionList transactions={data.transactions} onBack={() => setView('DASHBOARD')} />}
        {view === 'CLIENTS' && <Clients clients={data.clients} onAddClient={handleAddClient} onPayDebt={(id) => {
            setSelectedClientId(id);
            setModalType(TransactionType.DEBT_PAYMENT);
            setModalOpen(true);
        }} />}
        
        {view === 'ADVISOR' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-900">Consultor de Negócios AI</h2>
                    <p className="text-slate-600 mt-1">Inteligência para o seu negócio crescer.</p>
                </div>

                {/* Slider de Dicas (Carrousel) */}
                <InvestmentTipsCarousel />

                <div className="bg-white p-6 rounded-xl shadow-md border border-brand-100">
                    {!aiAdvice && !aiLoading && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 rounded-full mb-4">
                              <BrainCircuit className="text-brand-600 w-7 h-7" />
                            </div>
                            <p className="mb-6 text-slate-600 px-4">
                              Clique abaixo para analisar suas vendas, despesas e kilapis e receber um plano de crescimento personalizado.
                            </p>
                            <button 
                                onClick={handleGetAdvice}
                                className="bg-brand-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-brand-700 transition-all transform hover:scale-105"
                            >
                                Gerar Plano de Crescimento
                            </button>
                        </div>
                    )}

                    {aiLoading && (
                        <div className="py-12 flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mb-4"></div>
                            <p className="text-slate-500 animate-pulse">Analisando dados financeiros...</p>
                        </div>
                    )}

                    {aiAdvice && !aiLoading && (
                        <div className="prose prose-slate max-w-none">
                            <div className="flex justify-between items-center mb-4 border-b pb-4">
                                <h3 className="text-xl font-bold text-brand-900 m-0">Recomendações Estratégicas</h3>
                                <button onClick={handleGetAdvice} className="text-sm text-brand-600 hover:underline">Atualizar Análise</button>
                            </div>
                            <div className="text-slate-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: aiAdvice }} />
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
          <button 
            onClick={() => {
                setModalType(TransactionType.SALE);
                setSelectedClientId(undefined);
                setModalOpen(true);
            }}
            className="bg-brand-600 text-white p-4 rounded-full shadow-lg hover:bg-brand-700 active:scale-95 transition-transform"
          >
              <Plus size={28} />
          </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-30 safe-area-pb">
          <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center ${view === 'DASHBOARD' ? 'text-brand-600' : 'text-slate-400'}`}>
              <LayoutDashboard size={24} />
              <span className="text-[10px] mt-1">Início</span>
          </button>
          <button onClick={() => setView('CLIENTS')} className={`flex flex-col items-center ${view === 'CLIENTS' ? 'text-brand-600' : 'text-slate-400'}`}>
              <Users size={24} />
              <span className="text-[10px] mt-1">Clientes</span>
          </button>
          <button onClick={() => setView('ADVISOR')} className={`flex flex-col items-center ${view === 'ADVISOR' ? 'text-brand-600' : 'text-slate-400'}`}>
              <BrainCircuit size={24} />
              <span className="text-[10px] mt-1">Consultor</span>
          </button>
      </div>

      {/* Modals */}
      <TransactionModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        clients={data.clients}
        initialClientId={selectedClientId}
        onSubmit={handleTransactionSubmit}
        onAddDebt={handleDebtSubmit}
      />
    </div>
  );
};

export default App;