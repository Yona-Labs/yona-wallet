import { RPC_API_URL } from "@coral-xyz/common";
import { Transaction, TransactionHistoryItem } from "../types";

/**
 * Получить список транзакций по адресу (только сигнатуры)
 * @param {string} publicKey - адрес кошелька
 * @param {number} [limit=20] - максимальное количество транзакций
 */
export async function fetchTransactionsRPC({ publicKey, limit = 20 }) {
  // Получаем список сигнатур
  const res = await fetch(RPC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [publicKey, { limit }],
    }),
  });
  if (!res.ok) throw new Error("Ошибка RPC");
  const {
    result: signatures,
  }: {
    jsonrpc: string;
    result: TransactionHistoryItem[];
    id: number;
  } = await res.json();

  // Получаем подробности по каждой транзакции (можно параллельно)
  const txs = await Promise.all(
    signatures.map(async (sig) => {
      const txRes = await fetch(RPC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTransaction",
          params: [sig.signature, { encoding: "jsonParsed" }],
        }),
      });
      if (!txRes.ok) return null;
      const { result }: { result: Transaction } = await txRes.json();
      return {
        ...result,
        id: sig.signature,
        timestamp: result.blockTime,
        hash: sig.signature,
      };
    })
  );

  // Фильтруем несуществующие транзакции
  return txs.filter((tx): tx is Transaction => tx !== null);
}
