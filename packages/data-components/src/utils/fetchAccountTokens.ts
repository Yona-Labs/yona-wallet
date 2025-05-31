import { RPC_API_URL } from "@coral-xyz/common";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/secure-clients/legacyCommon";
import { SplTokenAccount } from "../types";

export const fetchAccountTokensRPC = async (address: string) => {
  const tokensResponse = await fetch(RPC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        address,
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

  return tokens.result.value;
};
