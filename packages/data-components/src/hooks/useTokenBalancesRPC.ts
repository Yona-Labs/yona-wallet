import { useEffect, useMemo, useState } from "react";
import { fetchTokenBalancesRPC } from "../utils";
import { useTokenStore } from "../model/tokens";

const CACHE_TTL = 5 * 1000; // 5 seconds

export function useTokenBalancesRPC({ publicKey }: { publicKey: string }) {
  const { tokens, setTokens, lastFetched } = useTokenStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTokenBalancesRPC({ publicKey });
      setTokens(publicKey, data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      tokens[publicKey] &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_TTL
    ) {
      setLoading(false);
      return;
    }
    refetch();
  }, [publicKey]);

  const data = useMemo(() => {
    return tokens[publicKey] ? Object.values(tokens[publicKey]) : [];
  }, [tokens, publicKey]);

  const store = useMemo(() => {
    return tokens[publicKey] || {};
  }, [tokens, publicKey]);

  return { data, store, loading, error, invalidate: refetch };
}
