import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Transaction } from "../types";

export const useTransactionsStore = create<{
  transactions: Record<string, Record<string, Transaction>>;
  setTransactions: (publicKey: string, transactions: Transaction[]) => void;
  lastFetched: number | null;
  clearTransactions: () => void;
}>()(
  persist(
    immer((set) => ({
      transactions: {},
      lastFetched: null,
      setTransactions: (publicKey: string, transactions: Transaction[]) => {
        set((state) => {
          state.transactions[publicKey] = transactions.reduce(
            (acc, transaction) => {
              acc[transaction.id] = transaction;
              return acc;
            },
            {} as Record<string, Transaction>
          );

          state.lastFetched = Date.now();

          return state;
        });
      },
      clearTransactions: () => set({ transactions: {}, lastFetched: null }),
    })),
    {
      name: "transactions",
    }
  )
);
