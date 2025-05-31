import { RPC_API_URL } from "@coral-xyz/common";
import { SplTokenAccount, TokenBalance } from "../types";
import { formatTokenAmount } from "./formatTokenAmount";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/secure-clients/legacyCommon";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";

const fetchNativeBalance = async (publicKey: string) => {
  const res = await fetch(RPC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey],
    }),
  });

  if (!res.ok) throw new Error("Ошибка RPC");

  const { result: response }: { result: { value: number } } = await res.json();

  const result: TokenBalance = {
    id: BTC_TOKEN.token,
    address: publicKey,
    amount: response.value.toString(),
    decimals: 9,
    displayAmount: formatTokenAmount(response.value, 9),
    marketData: {
      ...BTC_TOKEN.marketData,
    },
    token: BTC_TOKEN.token,
    tokenListEntry: BTC_TOKEN.tokenListEntry,
  };

  return result;
};

const fetchSplTokenBalances = async (publicKey: string) => {
  const tokensResponse = await fetch(RPC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        publicKey,
        { programId: TOKEN_PROGRAM_ID.toString() },
        { encoding: "jsonParsed" },
      ],
    }),
  });

  const tokens: {
    jsonrpc: string;
    id: number;
    result: {
      value: { account: SplTokenAccount; pubkey: string }[];
    };
  } = await tokensResponse.json();

  const result: TokenBalance[] = tokens.result.value.map((token) => {
    return {
      id: token.account.data.parsed.info.mint,
      address: token.pubkey,
      amount: token.account.data.parsed.info.tokenAmount.amount,
      decimals: token.account.data.parsed.info.tokenAmount.decimals,
      displayAmount: token.account.data.parsed.info.tokenAmount.uiAmountString,
      marketData: null,
      token: token.account.data.parsed.info.mint,
      tokenListEntry: null,
    };
  });

  return result;
};

export async function fetchTokenBalancesRPC({ publicKey }) {
  const balances: TokenBalance[] = [];

  const nativeBalance = await fetchNativeBalance(publicKey);
  balances.push(nativeBalance);

  const splTokenBalances = await fetchSplTokenBalances(publicKey);
  balances.push(...splTokenBalances);

  return balances;
}
