import { useEffect, useMemo, useState } from "react";
import { fetchTransactionsRPC } from "../utils/fetchTransactions";
import { useTransactionsStore } from "../model/transactions";

const CACHE_TTL = 5 * 1000; // 5 seconds

export function useTransactionsRPC({
  publicKey,
  limit = 20,
}: {
  publicKey: string;
  limit?: number;
}) {
  const { transactions, setTransactions, lastFetched } = useTransactionsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const txs = await fetchTransactionsRPC({ publicKey, limit });
      setTransactions(publicKey, txs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      transactions[publicKey] &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_TTL
    ) {
      setLoading(false);
      return;
    }
    refetch();
  }, [publicKey, limit]);

  const data = useMemo(() => {
    return transactions[publicKey]
      ? Object.values(transactions[publicKey])
      : [];
  }, [transactions, publicKey, limit]);

  const store = useMemo(() => {
    return transactions[publicKey] || {};
  }, [transactions, publicKey]);

  return { data, store, loading, error, invalidate: refetch };
}
