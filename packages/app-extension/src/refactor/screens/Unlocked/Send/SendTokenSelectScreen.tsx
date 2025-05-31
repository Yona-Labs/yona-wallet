import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import type { ProviderId, TokenBalance } from "@coral-xyz/data-components";
import {
  // GET_TOKEN_BALANCES_QUERY,
  useBitcoinPrice,
  useTokenBalancesRPC,
} from "@coral-xyz/data-components";
import { useTranslation } from "@coral-xyz/i18n";
import { EmptyState, WarningIcon } from "@coral-xyz/react-common";
import { useActiveWallet } from "@coral-xyz/recoil";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import {
  ETH_NATIVE_MINT,
  SOL_NATIVE_MINT,
} from "@coral-xyz/secure-clients/legacyCommon";
import {
  ContentLoader,
  Skeleton,
  useTheme,
  XStack,
  YStack,
} from "@coral-xyz/tamagui";

import { SearchableTokenTable } from "../../../../components/common/TokenTable";
import { ScreenContainer } from "../../../components/ScreenContainer";
import {
  Routes,
  type SendTokenSelectScreenProps,
} from "../../../navigation/SendNavigator";

export function SendTokenSelectScreen(props: SendTokenSelectScreenProps) {
  return (
    <ScreenContainer loading={<Loading />}>
      <Container {...props} />
    </ScreenContainer>
  );
}

function Container({ navigation }: SendTokenSelectScreenProps) {
  const { blockchain, publicKey } = useActiveWallet();
  const { t } = useTranslation();
  // const { data, error } = useQuery(GET_TOKEN_BALANCES_QUERY, {
  //   fetchPolicy: "cache-only",
  //   variables: {
  //     address: publicKey,
  //     providerId: blockchain.toUpperCase() as ProviderId,
  //   },
  // });
  const { data, error } = useTokenBalancesRPC({ publicKey: publicKey });
  const price = useBitcoinPrice();

  const tokens: TokenBalance[] = useMemo(() => {
    if (!data || !price) return [];

    if (data.length === 0) return [];

    return data.map((token) => {
      if (token.token === BTC_TOKEN.token) {
        const btcToken: TokenBalance = {
          ...token,
          marketData: {
            price: Number(price?.lastPrice),
            percentChange: Number(price?.priceChangePercent),
            value: Number(token.displayAmount) * Number(price?.lastPrice),
            valueChange:
              Number(token.displayAmount) * Number(price?.priceChangePercent),
            marketId: BTC_TOKEN.marketData.marketId,
            marketUrl: BTC_TOKEN.marketData.marketUrl,
          },
        };

        return btcToken;
      }

      return token;
    });
  }, [data, price]);

  // const tokens = useMemo(
  //   () =>
  //     data?.wallet?.balances?.tokens.edges.map((e) => {
  //       if (e.node.token === BTC_TOKEN.token) {
  //         const token = JSON.parse(JSON.stringify(e.node));

  //         const value = Number(token.displayAmount) * Number(price?.lastPrice);

  //         token.marketData = {
  //           id: token.marketData?.id ?? "",
  //           price: Number(price?.lastPrice),
  //           percentChange: Number(price?.priceChangePercent),
  //           value,
  //           valueChange: value * Number(price?.priceChangePercent),
  //         };

  //         return token;
  //       } else {
  //         return e.node;
  //       }
  //     }) ?? [],
  //   [data, price]
  // );

  console.log("send navigator tokens", tokens);

  if (error) {
    return (
      <YStack padding="$4" flex={1} justifyContent="center" alignItems="center">
        <EmptyState
          verticallyCentered
          icon={(props: any) => <WarningIcon {...props} />}
          title={t("no_tokens_to_show")}
          subtitle={t("we_couldnt_load_any_tokens_try_again")}
        />
      </YStack>
    );
  }

  return (
    <SearchableTokenTable
      tokens={tokens}
      onClickRow={(blockchain, token) => {
        navigation.push(Routes.SendAddressSelectScreen, {
          blockchain,
          assetId: token.id,
        });
      }}
      customFilter={(token) => {
        console.log("Search custom filter", token);
        if (token.token === SOL_NATIVE_MINT) {
          return true;
        }
        if (token.token === ETH_NATIVE_MINT) {
          return true;
        }
        return parseFloat(token.amount) !== 0;
      }}
    />
  );
}

function Loading() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <LoadingRow key={index} size={24} />
      ))}
    </>
  );
}

function LoadingRow({ size }: { size: number }) {
  const width = size * 2;
  const height = width;
  const theme = useTheme();
  return (
    <YStack gap={24} mb={24}>
      <XStack mx={16} ai="center" jc="space-between">
        <ContentLoader
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          backgroundColor={theme.baseBackgroundL0.val}
          foregroundColor={theme.baseBackgroundL1.val}
        >
          <circle cx={size} cy={size} r={size} />
        </ContentLoader>
        <XStack f={1} jc="flex-start" ml={24}>
          <Skeleton height={12} width={176} radius={10} />
        </XStack>
        <Skeleton height={12} width={74} radius={10} />
      </XStack>
      <XStack mx={16} ai="center" jc="space-between">
        <ContentLoader
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          backgroundColor={theme.baseBackgroundL0.val}
          foregroundColor={theme.baseBackgroundL1.val}
        >
          <circle cx={size} cy={size} r={size} />
        </ContentLoader>
        <XStack f={1} jc="flex-start" ml={24}>
          <Skeleton height={12} width={131} radius={10} />
        </XStack>
        <Skeleton height={12} width={74} radius={10} />
      </XStack>
    </YStack>
  );
}
