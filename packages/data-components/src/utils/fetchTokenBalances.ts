import { RPC_API_URL } from "@coral-xyz/common";
import { SplTokenAccount, TokenBalance } from "../types";
import { formatTokenAmount } from "./formatTokenAmount";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/secure-clients/legacyCommon";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import {
  parseSplTokenAccount,
  parseSplTokenAccountWithDecimals,
} from "./decodeSolanaSplTokenData";

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
  try {
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

    let result: TokenBalance[] = [];

    for (let token of tokens.result.value) {
      if (!token.account.data?.parsed) {
        // Если RPC не вернул распарсенные данные, парсим base64 данные вручную
        console.log("Парсим base64 данные для токена:", token.pubkey);

        try {
          // Используем функцию с подгрузкой decimals
          const parsedData = await parseSplTokenAccountWithDecimals(
            token.account.data[0],
            true
          );

          if (parsedData && parsedData.mint && parsedData.amount) {
            // Определяем decimals и displayAmount
            const decimals = parsedData.token?.decimals ?? 0;
            const displayAmount = parsedData.amount.ui ?? parsedData.amount.raw;

            result.push({
              id: parsedData.mint.address,
              address: token.pubkey,
              amount: parsedData.amount.raw,
              decimals: decimals,
              displayAmount: displayAmount,
              marketData: null,
              token: parsedData.mint.address,
              tokenListEntry: null,
            });
          } else {
            console.warn("Не удалось спарсить данные токена:", token.pubkey);
          }
        } catch (parseError) {
          console.error("Ошибка парсинга токена:", token.pubkey, parseError);

          // Фоллбэк на базовый парсинг без decimals
          const basicParsedData = parseSplTokenAccount(token.account.data[0]);
          if (
            basicParsedData &&
            basicParsedData.mint &&
            basicParsedData.amount
          ) {
            result.push({
              id: basicParsedData.mint.address,
              address: token.pubkey,
              amount: basicParsedData.amount.raw,
              decimals: 0, // Неизвестно без RPC
              displayAmount: basicParsedData.amount.raw,
              marketData: null,
              token: basicParsedData.mint.address,
              tokenListEntry: null,
            });
          }
        }
      } else {
        // Используем готовые распарсенные данные из RPC
        result.push({
          id: token.account.data.parsed.info.mint,
          address: token.pubkey,
          amount: token.account.data.parsed.info.tokenAmount.amount,
          decimals: token.account.data.parsed.info.tokenAmount.decimals,
          displayAmount:
            token.account.data.parsed.info.tokenAmount.uiAmountString,
          marketData: null,
          token: token.account.data.parsed.info.mint,
          tokenListEntry: null,
        });
      }
    }

    return result;
  } catch (err) {
    console.log("err fetch tokens", err);
    return [];
  }
};

export async function fetchTokenBalancesRPC({ publicKey }) {
  const balances: TokenBalance[] = [];

  const nativeBalance = await fetchNativeBalance(publicKey);
  balances.push(nativeBalance);

  const splTokenBalances = await fetchSplTokenBalances(publicKey);
  balances.push(...splTokenBalances);
  console.log(balances);
  return balances;
}
