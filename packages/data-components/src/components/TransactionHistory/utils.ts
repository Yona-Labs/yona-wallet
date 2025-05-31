import { formatDate, UNKNOWN_ICON_SRC } from "@coral-xyz/common";
import { useActiveWallet } from "@coral-xyz/recoil";
import moment from "moment";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import { Transaction } from "../../types";

export type ResponseTransaction = Transaction;

export type TransactionGroup = {
  date: string;
  data: Transaction[];
};

/**
 * Group the argued list of transactions by date.
 * @export
 * @param {ResponseTransaction[]} transactions
 * @returns {TransactionGroup[]}
 */
export function getGroupedTransactions(
  transactions: Transaction[]
): TransactionGroup[] {
  const groupedTxs: TransactionGroup[] = [];
  const filteredTxs = transactions.filter((t) => t.blockTime);

  for (let i = 0; i < filteredTxs.length; i++) {
    const date = formatDate(moment.unix(filteredTxs[i].blockTime!).toDate());

    if (
      groupedTxs.length === 0 ||
      groupedTxs[groupedTxs.length - 1].date !== date
    ) {
      groupedTxs.push({
        date,
        data: [filteredTxs[i]],
      });
    } else {
      groupedTxs[groupedTxs.length - 1].data.push(filteredTxs[i]);
    }
  }
  return groupedTxs;
}

export function useTokenLogo({
  name,
  symbol,
}: {
  name?: string;
  symbol?: string;
}): string {
  // const wallet = useActiveWallet();
  // const { data } = useQuery(GET_TOKEN_BALANCES_QUERY, {
  //   returnPartialData: true,
  //   fetchPolicy: "cache-only",
  //   variables: {
  //     address: wallet.publicKey,
  //     providerId: wallet.blockchain.toUpperCase() as ProviderId,
  //   },
  // });

  // const item = useMemo(() => {
  //   const edges = data?.wallet?.balances?.tokens?.edges ?? [];
  //   return edges.find((e) => {
  //     if (name) return e.node.tokenListEntry?.name === name;
  //     return e.node.tokenListEntry?.symbol === symbol;
  //   });
  // }, [data, name, symbol]);

  if (name === "Solana" || symbol === "SOL")
    return BTC_TOKEN.tokenListEntry.logo;

  return UNKNOWN_ICON_SRC;
}
