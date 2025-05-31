import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { FlatList, type ListRenderItem } from "react-native";
import { useQuery } from "@apollo/client";
import {
  type Blockchain,
  formatWalletAddress,
  UI_RPC_METHOD_HIDDEN_TOKENS_UPDATE,
  UNKNOWN_ICON_SRC,
} from "@coral-xyz/common";
import {
  // GET_TOKEN_BALANCES_QUERY,
  // type ProviderId,
  type ResponseTokenBalance,
  useBitcoinPrice,
  useTokenBalancesRPC,
} from "@coral-xyz/data-components";
import { useTranslation } from "@coral-xyz/i18n";
import { hiddenTokenAddresses, useBackgroundClient } from "@coral-xyz/recoil";
import { BTC_TOKEN } from "@coral-xyz/secure-background/src/blockchain-configs/bitcoin";
import {
  ListItemCore,
  ListItemIconCore,
  StyledText,
  Switch,
  XStack,
  YStack,
} from "@coral-xyz/tamagui";
import { useRecoilValue } from "recoil";

type _TokenListEntryFragmentType = NonNullable<
  ResponseTokenBalance["tokenListEntry"]
>;

export function TokenDisplayManagement({
  address,
  blockchain,
}: {
  address: string;
  blockchain: Blockchain;
}) {
  const { t } = useTranslation();
  return (
    <YStack
      ai="center"
      gap={24}
      height="100%"
      paddingTop={12}
      paddingHorizontal={12}
    >
      <YStack paddingHorizontal={12}>
        <StyledText
          color="$baseTextMedEmphasis"
          fontSize="$sm"
          textAlign="center"
        >
          {t("hidden_tokens_description")}
        </StyledText>
      </YStack>
      <HiddenTokensList address={address} blockchain={blockchain} />
    </YStack>
  );
}

const useTokenBalancesQuery = (address: string, blockchain: Blockchain) => {
  console.log(blockchain);
  // const { data } = useQuery(GET_TOKEN_BALANCES_QUERY, {
  //   fetchPolicy: "cache-only",
  //   variables: {
  //     address,
  //     providerId: blockchain.toUpperCase() as ProviderId,
  //   },
  // });
  const { data: dataRPC } = useTokenBalancesRPC({ publicKey: address });
  const price = useBitcoinPrice();

  if (!dataRPC || !price) return null;

  let response = {
    wallet: {
      balances: {
        aggregate: {
          percentChange: 0,
          value: 0,
          valueChange: 0,
        },
        tokens: {
          edges: dataRPC.map((token) => {
            if (token.token === BTC_TOKEN.token) {
              return {
                node: {
                  ...token,
                  marketData: {
                    price: Number(price?.lastPrice),
                    percentChange: Number(price?.priceChangePercent),
                    value:
                      Number(token.displayAmount) * Number(price?.lastPrice),
                    valueChange:
                      Number(token.displayAmount) *
                      Number(price?.priceChangePercent),
                    marketId: BTC_TOKEN.marketData.marketId,
                    marketUrl: BTC_TOKEN.marketData.marketUrl,
                  },
                },
              };
            }

            return {
              node: {
                ...token,
                tokenListEntry: null,
                marketData: null,
              },
            };
          }),
        },
      },
    },
  };

  return response;

  // if (data?.wallet?.balances?.tokens.edges) {
  //   const balanceIndex = data?.wallet?.balances?.tokens.edges.findIndex(
  //     (balance) => balance.node.token === BTC_TOKEN.token
  //   );

  //   if (balanceIndex >= 0) {
  //     // data.wallet.balances.tokens.edges[balanceIndex] = {
  //     //   node: {
  //     //     ...BTC_TOKEN,
  //     //     id: data.wallet.balances.tokens.edges[balanceIndex].node.id,
  //     //     amount: data.wallet.balances.tokens.edges[balanceIndex].node.amount,
  //     //     displayAmount:
  //     //       data.wallet.balances.tokens.edges[balanceIndex].node.displayAmount,
  //     //     marketData:
  //     //       data.wallet.balances.tokens.edges[balanceIndex].node.marketData,
  //     //     __typename:
  //     //       data.wallet.balances.tokens.edges[balanceIndex].node.__typename,
  //     //   },
  //     // };
  //     data.wallet.balances.tokens.edges[balanceIndex] = {
  //       node: {
  //         ...data.wallet.balances.tokens.edges[balanceIndex].node,
  //         tokenListEntry: {
  //           ...BTC_TOKEN.tokenListEntry,
  //           id:
  //             data.wallet.balances.tokens.edges[balanceIndex].node
  //               .tokenListEntry?.id ?? BTC_TOKEN.tokenListEntry.id,
  //         },
  //         marketData: BTC_TOKEN.marketData,
  //       },
  //     };
  //   }
  // }

  // return data;
};

export function HiddenTokensList({
  address,
  blockchain,
}: {
  address: string;
  blockchain: Blockchain;
}) {
  const hiddenTokens = useRecoilValue(hiddenTokenAddresses(blockchain));
  // const { data } = useQuery(GET_TOKEN_BALANCES_QUERY, {
  //   fetchPolicy: "cache-only",
  //   variables: {
  //     address,
  //     providerId: blockchain.toUpperCase() as ProviderId,
  //   },
  // });
  const data = useTokenBalancesQuery(address, blockchain);

  const ownedTokens = useMemo<_TokenListEntryFragmentType[]>(
    () =>
      (data?.wallet?.balances?.tokens.edges ?? []).reduce<
        _TokenListEntryFragmentType[]
      >((acc, curr) => {
        if (curr.node.tokenListEntry) acc.push(curr.node.tokenListEntry);
        return acc;
      }, []),
    [data]
  );

  const renderItem = useCallback<ListRenderItem<_TokenListEntryFragmentType>>(
    ({ item, index }) => {
      console.log("tokenDisplayManagementDrawer", "renderItem", item);
      const isHidden = hiddenTokens.includes(item.address);
      return (
        <_HiddenTokensListItem
          blockchain={blockchain}
          isHidden={isHidden}
          isLast={index === ownedTokens.length - 1}
          item={item}
        />
      );
    },
    [blockchain, hiddenTokens, ownedTokens]
  );

  return (
    <FlatList
      style={{ width: "100%" }}
      numColumns={1}
      data={ownedTokens}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

function _HiddenTokensListItem({
  blockchain,
  isHidden,
  isLast,
  item,
}: {
  blockchain: Blockchain;
  isHidden?: boolean;
  isLast: boolean;
  item: _TokenListEntryFragmentType;
}) {
  const background = useBackgroundClient();

  const handleClick = useCallback(async () => {
    // ph101pp todo
    await background.request({
      method: UI_RPC_METHOD_HIDDEN_TOKENS_UPDATE,
      params: [
        blockchain.toLowerCase(),
        isHidden ? "remove" : "add",
        item.address,
      ],
    });
  }, [background, blockchain, isHidden, item.address]);

  return (
    <ListItemCore
      style={{
        backgroundColor: "transparent",
        paddingBottom: isLast ? 24 : undefined,
        pointerEvents: "auto",
      }}
      icon={
        <ListItemIconCore
          radius="$circular"
          image={item.logo || UNKNOWN_ICON_SRC}
          size={44}
        />
      }
    >
      <XStack f={1} ai="center" jc="space-between">
        <YStack maxWidth="75%">
          <StyledText
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
          >
            {item.name || formatWalletAddress(item.address)}
          </StyledText>
          <StyledText color="$baseTextMedEmphasis">
            {item.symbol || "?"}
          </StyledText>
        </YStack>
        <Switch
          backgroundColor={isHidden ? "$baseTextMedEmphasis" : "$accentBlue"}
          borderWidth={0}
          checked={!isHidden}
          cursor="pointer"
          onPress={handleClick}
          padding={2}
          size="$2"
        >
          <Switch.Thumb
            backgroundColor="$baseBackgroundL0"
            animation="quick"
            borderWidth={0}
          />
        </Switch>
      </XStack>
    </ListItemCore>
  );
}
