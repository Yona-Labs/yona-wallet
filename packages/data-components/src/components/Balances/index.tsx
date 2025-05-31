import type { Blockchain } from "@coral-xyz/common";
import { hiddenTokenAddresses } from "@coral-xyz/recoil";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import { YStack } from "@coral-xyz/tamagui";
import { type ReactElement, type ReactNode, Suspense, useMemo } from "react";
import { useRecoilValue } from "recoil";

import {
  BalanceSummary,
  BalanceSummaryLoader,
  type BalanceSummaryProps,
} from "./BalanceSummary";
import { BalancesTable } from "./BalancesTable";
import type { ResponseBalanceSummary, ResponseTokenBalance } from "./utils";
import { useBitcoinPrice, useTokenBalancesRPC } from "../../hooks";
import type { DataComponentScreenProps } from "../common";

export {
  BalanceDetails,
  type BalanceDetailsProps,
  TokenMarketInfoTable,
} from "./BalanceDetails";
export { BalancesTable } from "./BalancesTable";
export type { ResponseBalanceSummary, ResponseTokenBalance };

export type TokenBalancesProps = DataComponentScreenProps & {
  address: string;
  onItemClick?: (args: {
    id: string;
    displayAmount: string;
    symbol: string;
    token: string;
    tokenAccount: string;
  }) => void | Promise<void>;
  providerId: any;
  summaryStyle?: BalanceSummaryProps["style"];
  tableFooterComponent?: ReactElement;
  tableLoaderComponent: ReactNode;
  widgets?: ReactNode;
};

export const TokenBalances = ({
  tableLoaderComponent,
  ...rest
}: TokenBalancesProps) => (
  <Suspense
    fallback={
      <YStack
        alignItems="center"
        gap={30}
        marginHorizontal={16}
        marginVertical={20}
      >
        <BalanceSummaryLoader />
        {tableLoaderComponent}
      </YStack>
    }
  >
    <_TokenBalances {...rest} />
  </Suspense>
);

function _TokenBalances({
  address,
  fetchPolicy,
  onItemClick,
  pollingIntervalSeconds,
  providerId,
  summaryStyle,
  tableFooterComponent,
  widgets,
}: Omit<TokenBalancesProps, "tableLoaderComponent">) {
  const hidden = useRecoilValue(
    hiddenTokenAddresses(providerId.toLowerCase() as Blockchain)
  );

  const { data } = useTokenBalancesRPC({
    publicKey: address,
  });
  const price = useBitcoinPrice();

  /**
   * Memoized value of the individual wallet token balances that
   * returned from the GraphQL query for the page. Also calculates the
   * monetary value and value change to be omitted from the total balance
   * aggregation based on the user's hidden token settings.
   */
  const { balances, omissions } = useMemo<{
    balances: any[];
    omissions: { value: number; valueChange: number };
  }>(() => {
    if (!data || !price) {
      return { balances: [], omissions: { value: 0, valueChange: 0 } };
    }

    let balances = data.map((token) => {
      if (token.token === BTC_TOKEN.token) {
        return {
          ...token,
          marketData: {
            ...token.marketData,
            price: Number(price?.lastPrice),
            percentChange: Number(price?.priceChangePercent),
            value: Number(token.displayAmount) * Number(price?.lastPrice),
            valueChange:
              Number(token.displayAmount) * Number(price?.priceChangePercent),
          },
        };
      }

      return token;
    });

    const omissions = { value: 0, valueChange: 0 };
    if (hidden && hidden.length > 0) {
      balances = balances.filter((b) => {
        if (hidden.includes(b.token)) {
          // if (b.token === BTC_TOKEN.token) {
          //   const value = Number(b.displayAmount) * Number(price?.lastPrice);
          //   const valueChange =
          //     Number(b.displayAmount) * Number(price?.priceChange);

          //   console.log(b, price, value, valueChange);

          //   omissions.value += value ?? 0;
          //   omissions.valueChange += valueChange ?? 0;
          // } else {
          omissions.value += b.marketData?.value ?? 0;
          omissions.valueChange += b.marketData?.valueChange ?? 0;
          // }
          return false;
        }
        return true;
      });
    }

    return { balances, omissions };
  }, [data, hidden, price]);

  /**
   * Memoized value of the inner balance summary aggregate
   * returned from the GraphQL query for the page.
   */
  const aggregate: ResponseBalanceSummary = useMemo(() => {
    const aggregate = {
      id: "",
      percentChange: 0,
      value: 0,
      valueChange: 0,
    };

    for (const node of balances) {
      aggregate.value += node.marketData?.value ?? 0;
      aggregate.valueChange += node.marketData?.valueChange ?? 0;
      aggregate.percentChange += node.marketData?.percentChange ?? 0;
    }

    aggregate.value -= omissions.value;
    aggregate.valueChange -= omissions.valueChange;
    return aggregate;
  }, [omissions, balances]);

  return (
    <YStack alignItems="center" gap={20} marginVertical={16}>
      <BalanceSummary style={summaryStyle} {...aggregate} />
      {widgets}
      <BalancesTable
        balances={balances}
        footerComponent={tableFooterComponent}
        onItemClick={onItemClick}
      />
    </YStack>
  );
}
