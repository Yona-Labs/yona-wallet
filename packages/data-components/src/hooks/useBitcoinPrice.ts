import {
  IGetBitcoinPriceResponse,
  getBitcoinPrice,
} from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import { useEffect, useMemo, useState } from "react";

export const useBitcoinPrice = () => {
  const [data, setData] = useState<IGetBitcoinPriceResponse | null>(null);

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem("bitcoinPrice")) {
      const price = JSON.parse(
        window.localStorage.getItem("bitcoinPrice") as any
      ) as IGetBitcoinPriceResponse;

      setData(price);
    }

    getBitcoinPrice().then((res) => setData(res));
  }, []);

  return useMemo(() => data, [data]);
};
