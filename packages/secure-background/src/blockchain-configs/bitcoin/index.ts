export interface IGetSolaxyPriceResponse {
  firstPrice: string;
  high: string;
  lastPrice: string;
  low: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
}

export const getSolaxyPrice = async (): Promise<IGetSolaxyPriceResponse> => {
  try {
    // Try CoinGecko first (free API)
    const coingeckoResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solaxy&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (coingeckoResponse.ok) {
      const data = await coingeckoResponse.json();
      if (data.solaxy) {
        const solaxyData = data.solaxy;
        const transformedData: IGetSolaxyPriceResponse = {
          firstPrice: solaxyData.usd?.toString() || "0",
          high: solaxyData.usd?.toString() || "0",
          lastPrice: solaxyData.usd?.toString() || "0",
          low: solaxyData.usd?.toString() || "0",
          priceChange: "0", // CoinGecko doesn't provide this directly
          priceChangePercent: solaxyData.usd_24h_change?.toString() || "0",
          quoteVolume: solaxyData.usd_24h_vol?.toString() || "0",
          symbol: "SOLX_USD",
          trades: "0",
          volume: solaxyData.usd_24h_vol?.toString() || "0",
        };

        window.localStorage.setItem(
          "solaxyPrice",
          JSON.stringify(transformedData)
        );
        return transformedData;
      }
    }

    // If CoinGecko doesn't have Solaxy, try alternative approach
    // Check if token exists on Solana blockchain and get price from DEX
    const solanaResponse = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0xe0B701F1a9c9D68B5C4c4c3B7FA4Ddec0fCF48",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (solanaResponse.ok) {
      const dexData = await solanaResponse.json();
      if (dexData.pairs && dexData.pairs.length > 0) {
        const pair = dexData.pairs[0];
        const transformedData: IGetSolaxyPriceResponse = {
          firstPrice: pair.priceUsd || "0",
          high: pair.priceUsd || "0",
          lastPrice: pair.priceUsd || "0",
          low: pair.priceUsd || "0",
          priceChange: pair.priceChange24h || "0",
          priceChangePercent: pair.priceChange24h || "0",
          quoteVolume: pair.volume24h || "0",
          symbol: "SOLX_USD",
          trades: "0",
          volume: pair.volume24h || "0",
        };

        window.localStorage.setItem(
          "solaxyPrice",
          JSON.stringify(transformedData)
        );
        return transformedData;
      }
    }

    // If all APIs fail, throw error
    throw new Error("No API returned Solaxy data");
  } catch (error) {
    console.error("Error fetching Solaxy price:", error);

    // Only fallback to cached data if available
    const cachedData = window.localStorage.getItem("solaxyPrice");
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (parseError) {
        console.error("Error parsing cached data:", parseError);
      }
    }

    // No fallback data - throw error
    throw new Error(
      "Failed to fetch Solaxy price from all sources and no cached data available"
    );
  }
};

export const SOLAXY_TOKEN = {
  id: "U09MQU5BX25hdGl2ZV9hZGRyZXNzOkFYaFkzejdyUVl3djdiRHVOSm82ZjZEQ2hmUHdmZGNRQzFXRWR3aFZYSFFv",
  address: "AXhY3z7rQYwv7bDuNJo6f6DChfPwfdcQC1WEdwhVXHQo",
  amount: "0",
  decimals: 6,
  displayAmount: "0.0",
  marketData: {
    id: "Y29pbmdlY2tvX21hcmtldF9kYXRhOkFYaFkzejdyUVl3djdiRHVOSm82ZjZEQ2hmUHdmZGNRQzFXRWR3aFZYSFFvL3NvbGFuYQ==",
    percentChange: 8.28,
    price: 0.0006876,
    value: 0,
    valueChange: 0.0000524,
    marketId: "solaxy",
    marketUrl: "https://coinmarketcap.com/currencies/solaxy/",
  },
  token: "11111111111111111111111111111111",
  tokenListEntry: {
    id: "U09MQU5BX3Rva2VuX2xpc3RfZW50cnk6MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE=",
    address: "11111111111111111111111111111111",
    decimals: 6,
    logo: "./solaxy.png",
    name: "Solaxy",
    symbol: "SOLX",
    coingeckoId: "solaxy",
    coinMarketCapId: "36867",
  },
  usdValue: 0,
};

// Keep the old name for backward compatibility
export const BTC_TOKEN = SOLAXY_TOKEN;

// Also export with both names for clarity
export { SOLAXY_TOKEN as NATIVE_TOKEN };
