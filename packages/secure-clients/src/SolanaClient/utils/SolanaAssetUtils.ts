import { BACKEND_API_URL, RPC_API_URL } from "@coral-xyz/common";
import { SOL_NATIVE_MINT } from "../solanaLegacy";

type GetAssetProofResponse = {
  id: string;
  proof: string[];
  root: string;
} | null;

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
      decimals: 9,
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

  return {
    mint: account.data.parsed.info.mint,
    decimals: account.data.parsed.info.tokenAmount.decimals,
    fungibleAta: pubkey,
    __typename: "TokenBalance",
  };
}
