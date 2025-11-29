/*
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
  setDoc,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { Transaction, Client } from "../types";

// --- CONFIGURAÇÃO DO FIREBASE ---
// Substitua os valores abaixo pelos do seu projeto no Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAQJ3o5I6Qg7X7XvUcLxuc0ReiRHML_Iao",
  authDomain: "cervejaria-53789.firebaseapp.com",
  projectId: "cervejaria-53789",
  storageBucket: "cervejaria-53789.firebasestorage.app",
  messagingSenderId: "414646788570",
  appId: "1:414646788570:web:6bb719f703c01e376d60e3",
  measurementId: "G-D89MKWKSY3",
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
    console.warn(
      "Firebase não configurado. Usando modo Offline (LocalStorage)."
    );
    enableIndexedDbPersistence(db).catch((err) => {
      // Erros comuns: multiple tabs (failed-precondition) ou browser sem suporte
      console.warn("IndexedDB persistence não disponível:", err);
    });
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
      const transactions = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Transaction)
      );
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
      const clients = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Client)
      );
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
  },
};
*/
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
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { Transaction, Client } from "../types";

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAQJ3o5I6Qg7X7XvUcLxuc0ReiRHML_Iao",
  authDomain: "cervejaria-53789.firebaseapp.com",
  projectId: "cervejaria-53789",
  storageBucket: "cervejaria-53789.firebasestorage.app",
  messagingSenderId: "414646788570",
  appId: "1:414646788570:web:6bb719f703c01e376d60e3",
  measurementId: "G-D89MKWKSY3",
};

let db: any = null;
let isFirebaseAvailable = false;

// --- IndexedDB / localStorage fallback para offline ---
let offlineDB = {
  transactions: [] as Transaction[],
  clients: [] as Client[],

  load() {
    this.transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    this.clients = JSON.parse(localStorage.getItem("clients") || "[]");
  },

  save() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    localStorage.setItem("clients", JSON.stringify(this.clients));
  },

  addTransaction(tx: Transaction) {
    this.transactions.push(tx);
    this.save();
  },

  addClient(client: Client) {
    this.clients.push(client);
    this.save();
  },

  updateClient(client: Client) {
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index >= 0) {
      this.clients[index] = client;
      this.save();
    }
  },

  flushToFirebase: async () => {
    if (!isFirebaseAvailable) return;

    // sincronizar transações
    for (const tx of offlineDB.transactions) {
      const { id, ...data } = tx;
      await addDoc(collection(db, "transactions"), data);
    }
    offlineDB.transactions = [];

    // sincronizar clientes
    for (const c of offlineDB.clients) {
      const { id, ...data } = c;
      await addDoc(collection(db, "clients"), data);
    }
    offlineDB.clients = [];

    offlineDB.save();
  }
};

// inicializa dados locais
offlineDB.load();

// --- Inicializa Firebase ---
try {
  if (firebaseConfig.apiKey !== "API_KEY_AQUI") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseAvailable = true;

    enableIndexedDbPersistence(db).catch((err) => {
      console.warn("IndexedDB persistence não disponível:", err);
    });

    console.log("Firebase conectado com sucesso.");
  } else {
    console.warn("Firebase não configurado. Usando modo Offline (LocalStorage).");
  }
} catch (e) {
  console.error("Erro ao inicializar Firebase:", e);
}

// --- SERVICE ---
export const firebaseService = {
  isConfigured: () => isFirebaseAvailable,

  // --- TRANSAÇÕES ---
  subscribeTransactions: (callback: (data: Transaction[]) => void) => {
    if (isFirebaseAvailable) {
      const q = query(collection(db, "transactions"), orderBy("date", "desc"));
      return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        callback(transactions);
      });
    } else {
      callback(offlineDB.transactions);
      return () => {};
    }
  },

  addTransaction: async (tx: Transaction) => {
    if (isFirebaseAvailable) {
      const { id, ...data } = tx;
      await addDoc(collection(db, "transactions"), data);
    } else {
      offlineDB.addTransaction(tx);
    }
  },

  // --- CLIENTES ---
  subscribeClients: (callback: (data: Client[]) => void) => {
    if (isFirebaseAvailable) {
      const q = collection(db, "clients");
      return onSnapshot(q, (snapshot) => {
        const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        callback(clients);
      });
    } else {
      callback(offlineDB.clients);
      return () => {};
    }
  },

  addClient: async (client: Client) => {
    if (isFirebaseAvailable) {
      const { id, ...data } = client;
      await addDoc(collection(db, "clients"), data);
    } else {
      offlineDB.addClient(client);
    }
  },

  updateClient: async (client: Client) => {
    if (isFirebaseAvailable && client.id) {
      const clientRef = doc(db, "clients", client.id);
      const { id, ...data } = client;
      await updateDoc(clientRef, data as any);
    } else {
      offlineDB.updateClient(client);
    }
  },

  flushOfflineToFirebase: async () => {
    await offlineDB.flushToFirebase();
  }
};

// --- SINCRONIZAÇÃO AUTOMÁTICA QUANDO ONLINE ---
if (typeof window !== "undefined") {
  window.addEventListener("online", async () => {
    console.log("Conexão restaurada! Sincronizando dados offline...");
    if (isFirebaseAvailable) {
      try {
        await offlineDB.flushToFirebase();
        console.log("Dados offline sincronizados com sucesso.");
      } catch (err) {
        console.error("Erro ao sincronizar dados offline:", err);
      }
    }
  });
}

