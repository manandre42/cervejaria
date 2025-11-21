export enum TransactionType {
  SALE = 'VENDA',
  EXPENSE = 'DESPESA',
  DEBT_PAYMENT = 'PAGAMENTO_KILAPI'
}

export interface Client {
  id: string;
  name: string;
  debt: number; // O valor que deve (Kilapi)
  bottlesOwed: number; // Quantidade de vasilhames que deve
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO string
  clientId?: string; // Se ligado a um cliente
  bottlesIn?: number; // Vasilhames que entraram
  bottlesOut?: number; // Vasilhames que saíram (sem troca)
}

export interface BusinessData {
  transactions: Transaction[];
  clients: Client[];
  cashBalance: number;
}

export interface AiAdvice {
  text: string;
  timestamp: number;
}