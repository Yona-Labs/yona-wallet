import { Connection, PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { RPC_API_URL } from "@coral-xyz/common";
import { metadataAddress } from "@coral-xyz/secure-clients/legacyCommon";

// export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
//   "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
// );
const connection = new Connection(RPC_API_URL);

/**
 * Типы для JSON-метаданных токена
 */
export interface TokenJsonMetadata {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  creator?: string;
  [key: string]: any; // Дополнительные поля
}

/**
 * Полная информация о токене с on-chain и off-chain метаданными
 */
export interface TokenMetadataResponse {
  // On-chain метаданные
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: string[];
  // Off-chain JSON метаданные
  jsonMetadata: TokenJsonMetadata | null;
}

/**
 * Очищает строку от нулевых байтов в конце (padding)
 * @param str строка для очистки
 * @returns очищенная строка
 */
function cleanMetadataString(str: string): string {
  return str.replace(/\0+$/, "").trim();
}

/**
 * Загружает JSON-метаданные по URI
 * @param uri ссылка на JSON-метаданные
 * @returns объект с метаданными или null при ошибке
 */
async function fetchJsonMetadata(
  uri: string
): Promise<TokenJsonMetadata | null> {
  try {
    if (!uri || uri.length === 0) {
      return null;
    }

    const response = await fetch(uri, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Таймаут 10 секунд
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`Failed to fetch metadata from ${uri}: ${response.status}`);
      return null;
    }

    const jsonData = await response.json();
    return jsonData as TokenJsonMetadata;
  } catch (error) {
    console.warn(`Error fetching JSON metadata from ${uri}:`, error);
    return null;
  }
}

/**
 * Получает metadata PDA для указанного mint
 */
// async function getMetadataPda(mint: PublicKey): Promise<PublicKey> {
//   return (
//     await PublicKey.findProgramAddress(
//       [
//         Buffer.from("metadata"),
//         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//         mint.toBuffer(),
//       ],
//       TOKEN_METADATA_PROGRAM_ID
//     )
//   )[0];
// }

export async function fetchTokenMetadata(
  mintAddress: string
): Promise<TokenMetadataResponse> {
  const mintPublicKey = new PublicKey(mintAddress);

  const metadataPda = await metadataAddress(mintPublicKey);

  const accountInfo = await connection.getAccountInfo(metadataPda);
  if (!accountInfo) {
    throw new Error("Metadata account not found");
  }

  const metadata = Metadata.deserialize(accountInfo.data)[0];

  // Очищаем строковые поля от нулевых байтов
  const cleanedName = cleanMetadataString(metadata.data.name);
  const cleanedSymbol = cleanMetadataString(metadata.data.symbol);
  const cleanedUri = cleanMetadataString(metadata.data.uri);

  // Загружаем JSON-метаданные по URI
  const jsonMetadata = await fetchJsonMetadata(cleanedUri);

  return {
    name: cleanedName,
    symbol: cleanedSymbol,
    uri: cleanedUri,
    sellerFeeBasisPoints: metadata.data.sellerFeeBasisPoints,
    creators: metadata.data.creators?.map((c) => c.address.toBase58()),
    jsonMetadata,
  };
}
