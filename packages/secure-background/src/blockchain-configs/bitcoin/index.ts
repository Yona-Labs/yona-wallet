export const BTC_TOKEN = {
  id: "U09MQU5BX25hdGl2ZV9hZGRyZXNzOkFYaFkzejdyUVl3djdiRHVOSm82ZjZEQ2hmUHdmZGNRQzFXRWR3aFZYSFFv",
  address: "AXhY3z7rQYwv7bDuNJo6f6DChfPwfdcQC1WEdwhVXHQo",
  amount: "0",
  decimals: 9,
  displayAmount: "0.0",
  marketData: {
    id: "Y29pbmdlY2tvX21hcmtldF9kYXRhOkFYaFkzejdyUVl3djdiRHVOSm82ZjZEQ2hmUHdmZGNRQzFXRWR3aFZYSFFvL3NvbGFuYQ==",
    percentChange: 0,
    price: 0,
    value: 0,
    valueChange: 0,
    marketId: "bitcoin",
    marketUrl: "https://www.coingecko.com/en/coins/bitcoin",
  },
  token: "11111111111111111111111111111111",
  tokenListEntry: {
    id: "U09MQU5BX3Rva2VuX2xpc3RfZW50cnk6MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE=",
    address: "11111111111111111111111111111111",
    decimals: 9,
    logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png",
    name: "Bitcoin",
    symbol: "BTC",
  },
};

export interface IGetBitcoinPriceResponse {
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

export const getBitcoinPrice = async (): Promise<IGetBitcoinPriceResponse> => {
  const data = await fetch(
    "https://api.backpack.exchange/api/v1/ticker?symbol=BTC_USDC",
    {
      method: "GET",
    }
  ).then((res) => res.json());

  window.localStorage.setItem("bitcoinPrice", JSON.stringify(data));

  return data;
};
