import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  setDoc
} from "firebase/firestore";
import { Transaction, Client } from "../types";

// --- CONFIGURAÇÃO DO FIREBASE ---
// Substitua os valores abaixo pelos do seu projeto no Firebase Console
const firebaseConfig = {
  apiKey: "API_KEY_AQUI",
  authDomain: "seunegocio.firebaseapp.com",
  projectId: "seunegocio",
  storageBucket: "seunegocio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inicialização condicional para evitar erros se a config não estiver preenchida
let db: any = null;

try {
  // Verifica se a config é válida (verificação simples)
  if (firebaseConfig.apiKey !== "API_KEY_AQUI") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase conectado com sucesso.");
  } else {
    console.warn("Firebase não configurado. Usando modo Offline (LocalStorage).");
  }
} catch (e) {
  console.error("Erro ao inicializar Firebase:", e);
}

// Coleções
const TRANS_COLLECTION = "transactions";
const CLIENTS_COLLECTION = "clients";

export const firebaseService = {
  isConfigured: () => !!db,

  // --- TRANSAÇÕES ---
  subscribeTransactions: (callback: (data: Transaction[]) => void) => {
    if (!db) return () => {};
    
    const q = query(collection(db, TRANS_COLLECTION), orderBy("date", "desc"));
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction));
      callback(transactions);
    });
  },

  addTransaction: async (transaction: Transaction) => {
    if (!db) return;
    // Remove id se existir, pois o firestore cria um
    const { id, ...data } = transaction;
    await addDoc(collection(db, TRANS_COLLECTION), data);
  },

  // --- CLIENTES ---
  subscribeClients: (callback: (data: Client[]) => void) => {
    if (!db) return () => {};

    const q = collection(db, CLIENTS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client));
      callback(clients);
    });
  },

  addClient: async (client: Client) => {
    if (!db) return;
    // Usamos setDoc se quisermos controlar o ID, ou addDoc para ID automático
    // Aqui vamos usar addDoc mas garantindo que o ID local seja substituido ou ignorado
    const { id, ...data } = client;
    await addDoc(collection(db, CLIENTS_COLLECTION), data);
  },

  updateClient: async (client: Client) => {
    if (!db) return;
    const clientRef = doc(db, CLIENTS_COLLECTION, client.id);
    const { id, ...data } = client; // Não salvamos o ID dentro do documento se não quisermos duplicidade
    await updateDoc(clientRef, data as any);
  }
};