import { GoogleGenAI } from "@google/genai";
import { BusinessData } from '../types';

// Initialize the client securely with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessAdvice = async (data: BusinessData): Promise<string> => {
  try {
    // Prepare a summary of the data for the prompt
    const sales = data.transactions.filter(t => t.type === 'VENDA');
    const expenses = data.transactions.filter(t => t.type === 'DESPESA');
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalDebt = data.clients.reduce((acc, curr) => acc + curr.debt, 0);
    const totalBottlesMissing = data.clients.reduce((acc, curr) => acc + curr.bottlesOwed, 0);

    const prompt = `
      Aja como um consultor de negócios sénior para um distribuidor de cerveja em Angola.
      Analise os seguintes dados do meu negócio e dê-me 3 conselhos estratégicos curtos e práticos para crescer, reduzir custos e recuperar dívidas.
      Seja direto, motivador e use um tom profissional mas simples.

      Dados:
      - Total Vendas: ${totalSales} Kz
      - Total Despesas: ${totalExpenses} Kz
      - Saldo Atual: ${data.cashBalance} Kz
      - Total em Kilapis (Dívidas de clientes): ${totalDebt} Kz
      - Vasilhames (caixas/garrafas) em falta com clientes: ${totalBottlesMissing} unidades.
      
      Estruture a resposta em HTML simples (sem markdown tags como \`\`\`) usando <h3> para títulos e <ul><li> para pontos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar conselhos no momento.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Erro ao conectar com o consultor virtual. Verifique sua conexão.";
  }
};