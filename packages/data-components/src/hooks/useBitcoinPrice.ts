import {
  IGetSolaxyPriceResponse,
  getSolaxyPrice,
} from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import { useEffect, useMemo, useState } from "react";

export const useSolaxyPrice = () => {
  const [data, setData] = useState<IGetSolaxyPriceResponse | null>(null);

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem("solaxyPrice")) {
      const price = JSON.parse(
        window.localStorage.getItem("solaxyPrice") as any
      ) as IGetSolaxyPriceResponse;

      setData(price);
    }

    getSolaxyPrice().then((res) => setData(res));
  }, []);

  return useMemo(() => data, [data]);
};

// Keep the old name for backward compatibility
export const useBitcoinPrice = useSolaxyPrice;
