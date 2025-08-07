import { BACKEND_API_URL, RPC_API_URL } from "@coral-xyz/common";
import { SOL_NATIVE_MINT } from "../solanaLegacy";
import { AccountLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

type GetAssetProofResponse = {
  id: string;
  proof: string[];
  root: string;
} | null;

/**
 * Парсит данные токен аккаунта из base64 используя SPL Token AccountLayout
 */
function parseTokenAccountData(
  base64Data: string
): { mint: string; amount: string; decimals?: number } | null {
  try {
    const buffer = Buffer.from(base64Data, "base64");

    // Используем официальный AccountLayout из @solana/spl-token
    const accountInfo = AccountLayout.decode(buffer);

    return {
      mint: accountInfo.mint.toBase58(),
      amount: accountInfo.amount.toString(),
    };
  } catch (error) {
    console.error(
      "Ошибка при парсинге токен аккаунта с помощью SPL Token AccountLayout:",
      error
    );
    return null;
  }
}

export async function getAssetProof(
  assetId: string
): Promise<GetAssetProofResponse> {
  // const resp = await fetch(`${BACKEND_API_URL}/v2/graphql`, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       query GetAssetProofForNft($assetId: String!) {
  //         assetProof(assetId: $assetId) {
  //           id
  //           proof
  //           root
  //         }
  //       }
  //     `,
  //     variables: {
  //       assetId,
  //     },
  //     operationName: "GetAssetProofForNft",
  //   }),
  // });

  // const json = await resp.json();
  // return json.data.assetProof;

  return new Promise((res) => res(null));
}

export type SolanaAsset =
  | {
      __typename: "Nft";
      mint: string;
      nonFungibleAta: string;
      compressed: boolean;
      compressionData?: {
        creatorHash: string;
        dataHash: string;
        id: string;
        leaf: number;
        tree: string;
      };
      proofData?: {
        id: string;
        proof: string[];
        root: string;
      };
    }
  | {
      __typename: "TokenBalance";
      mint: string;
      fungibleAta: string;
      decimals: number;
    };

export async function getSolanaAssetById(
  assetId: string,
  address: string
): Promise<SolanaAsset> {
  if (assetId === SOL_NATIVE_MINT) {
    return {
      decimals: 6,
      fungibleAta: address,
      mint: SOL_NATIVE_MINT,
      __typename: "TokenBalance",
    };
  }
  // const resp = await fetch(`${BACKEND_API_URL}/v2/graphql`, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       query GetSolanaAssetForId($assetId: ID!, $assetIdStr: String!) {
  //         assetProof(assetId: $assetIdStr) {
  //           id
  //           proof
  //           root
  //         }
  //         node(id: $assetId) {
  //           __typename

  //           ... on TokenBalance {
  //             mint: token
  //             fungibleAta: address
  //             decimals
  //           }

  //           ... on Nft {
  //             mint: address
  //             nonFungibleAta: token
  //             compressed
  //             compressionData {
  //               creatorHash
  //               dataHash
  //               id
  //               leaf
  //               tree
  //             }
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       assetId,
  //       assetIdStr: assetId,
  //     },
  //     operationName: "GetSolanaAssetForId",
  //   }),
  // });
  // const json = await resp.json();
  const response = await fetch(RPC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "getTokenAccountsByOwner",
      params: [
        address,
        { mint: assetId },
        {
          encoding: "jsonParsed",
        },
      ],
      id: 1,
    }),
  });

  const data: {
    jsonrpc: string;
    result: {
      context: {
        apiVersion: string;
        slot: number;
      };
      value: {
        account: {
          data: {
            parsed: {
              info: {
                isNative: boolean;
                mint: string;
                owner: string;
                state: string;
                tokenAmount: {
                  amount: string;
                  decimals: number;
                  uiAmount: number;
                  uiAmountString: string;
                };
              };
              type: string;
            };
            program: string;
            space: number;
          };
          executable: false;
          lamports: number;
          owner: string;
          rentEpoch: number;
          space: number;
        };
        pubkey: string;
      }[];
    };
    id: number;
  } = await response.json();

  if (data.result.value.length === 0) {
    throw new Error("Asset not found");
  }

  const { account, pubkey } = data.result.value[0];

  // Если есть parsed данные, используем их
  if (account.data.parsed?.info) {
    return {
      mint: account.data.parsed.info.mint,
      decimals: account.data.parsed.info.tokenAmount.decimals,
      fungibleAta: pubkey,
      __typename: "TokenBalance",
    };
  }

  // Если нет parsed данных, используем кастомный парсер
  if (account.data[0] && account.data[1] === "base64") {
    const parsedAccount = parseTokenAccountData(account.data[0]);
    if (parsedAccount) {
      return {
        mint: parsedAccount.mint,
        decimals: parsedAccount.decimals || 6, // decimals нужно получать отдельно для mint
        fungibleAta: pubkey,
        __typename: "TokenBalance",
      };
    }
  }

  throw new Error("Unable to parse token account data");
}
