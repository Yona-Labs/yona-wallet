import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { TokenBalance } from "../types";

export const useTokenStore = create<{
  tokens: Record<string, Record<string, TokenBalance>>;
  setTokens: (publicKey: string, tokens: TokenBalance[]) => void;
  lastFetched: number | null;
  clearTokens: () => void;
}>()(
  persist(
    immer((set) => ({
      tokens: {},
      lastFetched: null,
      setTokens: (publicKey: string, tokens: TokenBalance[]) => {
        set((state) => {
          state.tokens[publicKey] = tokens.reduce(
            (acc, token) => {
              acc[token.id] = token;
              return acc;
            },
            {} as Record<string, TokenBalance>
          );

          state.lastFetched = Date.now();

          return state;
        });
      },
      clearTokens: () => set({ tokens: {}, lastFetched: null }),
    })),
    {
      name: "tokens",
    }
  )
);
