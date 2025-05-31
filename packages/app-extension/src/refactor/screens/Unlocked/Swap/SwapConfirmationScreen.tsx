import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { UNKNOWN_ICON_SRC, wait } from "@coral-xyz/common";
// import {
//   GET_TOKEN_BALANCES_QUERY,
//   type ProviderId,
// } from "@coral-xyz/data-components";
import { useTranslation } from "@coral-xyz/i18n";
import { CheckIcon, CrossIcon, Loading } from "@coral-xyz/react-common";
import type { SwapQuoteResponse } from "@coral-xyz/recoil";
import {
  SwapQuoteResponseFormatter,
  SwapState,
  useBlockchainConnectionUrl,
  useBlockchainExplorer,
  useConfirmTransactionSwap,
  useSwapContext,
  useToToken,
} from "@coral-xyz/recoil";
import { explorerUrl } from "@coral-xyz/secure-background/legacyCommon";
import {
  BpPrimaryButton,
  BpSecondaryButton,
  temporarilyMakeStylesForBrowserExtension,
  YStack,
} from "@coral-xyz/tamagui";
import { Typography } from "@mui/material";
import { BigNumber } from "ethers";

import { BottomCard } from "../../../../components/common/Layout/BottomCard";
import { TokenAmountHeader } from "../../../../components/common/TokenAmountHeader";
import { ScreenContainer } from "../../../components/ScreenContainer";
import type { SwapConfirmationScreenProps } from "../../../navigation/SwapNavigator";

export function SwapConfirmationScreen(props: SwapConfirmationScreenProps) {
  return (
    <ScreenContainer loading={<LoadingContainer />}>
      <Container {...props} />
    </ScreenContainer>
  );
}

function LoadingContainer() {
  return null;
}

function Container({ route, navigation }: SwapConfirmationScreenProps) {
  const { receipt, quoteResponse } = route.params;

  const confirmTransaction = useConfirmTransactionSwap({ receipt });
  const { t } = useTranslation();
  const apollo = useApolloClient();
  const { from, to } = useSwapContext();
  const explorer = useBlockchainExplorer(to!.blockchain);
  const connectionUrl = useBlockchainConnectionUrl(to!.blockchain);
  const [swapState, setSwapState] = useState(SwapState.CONFIRMING);

  if (!to) {
    throw new Error("to not found");
  }

  const onViewBalances = () => {
    navigation.popToTop();
    navigation.popToTop();
  };
  const onViewExplorer = () => {
    const url = explorerUrl(explorer, receipt.data.signature, connectionUrl);
    window.open(url);
    navigation.popToTop();
    navigation.popToTop();
  };

  const confirmTx = async () => {
    try {
      await confirmTransaction();
      setSwapState(SwapState.CONFIRMED);

      // Allow asynchronous refetch without awaiting to unblock UI interactions
      await wait(2);
      // TODO: add refresh token balances logic
      // const promises = [
      //   apollo.query({
      //     query: GET_TOKEN_BALANCES_QUERY,
      //     fetchPolicy: "network-only",
      //     variables: {
      //       address: from.walletPublicKey,
      //       providerId: from.blockchain.toUpperCase() as ProviderId,
      //     },
      //   }),
      // ];

      // if (
      //   from.walletPublicKey !== to.walletPublicKey ||
      //   from.blockchain !== to.blockchain
      // ) {
      //   promises.push(
      //     apollo.query({
      //       query: GET_TOKEN_BALANCES_QUERY,
      //       fetchPolicy: "network-only",
      //       variables: {
      //         address: to.walletPublicKey,
      //         providerId: to.blockchain.toUpperCase() as ProviderId,
      //       },
      //     })
      //   );
      // }
      // await Promise.all(promises);
    } catch (e) {
      const error = e as Error | undefined;
      if (error?.message?.includes("Quote Expired")) {
        navigation.pop();
      } else if (
        error?.message?.includes("Approval Denied") ||
        error?.message?.includes("Closed")
      ) {
        navigation.pop();
      } else {
        // show error for anything unexpected
        setSwapState(SwapState.ERROR);
      }
    }
  };

  useEffect(() => {
    // confirm immediately, user confirmation now happens via secureUI
    confirmTx().catch((e) => console.error(e));
  }, []);

  return (
    <YStack jc="space-between" height="100%">
      {swapState === SwapState.CONFIRMING ? (
        <SwapConfirming isConfirmed={false} quoteResponse={quoteResponse} />
      ) : swapState === SwapState.CONFIRMED ? (
        <SwapConfirming isConfirmed quoteResponse={quoteResponse} />
      ) : swapState === SwapState.ERROR ? (
        <SwapError />
      ) : null}
      <YStack
        space="$3"
        style={{
          marginBottom: "24px",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        {swapState === SwapState.ERROR ? (
          <BpPrimaryButton
            onPress={() => {
              navigation.pop();
            }}
            label={t("retry")}
          />
        ) : receipt.data.signature ? (
          <BpPrimaryButton
            onPress={onViewExplorer}
            label={t("view_explorer")}
          />
        ) : null}
        <BpSecondaryButton
          onPress={onViewBalances}
          label={t("view_balances")}
        />
      </YStack>
    </YStack>
  );
}

//
// Bottom drawer displayed so the user can confirm the swap parameters.
//

//
// Bottom card that is displayed while the swap is confirming (i.e. transactions
// are being submitted/confirmed)
//
function SwapConfirming({
  isConfirmed,
  quoteResponse,
}: {
  isConfirmed: boolean;
  quoteResponse: SwapQuoteResponse;
}) {
  const { from, to } = useSwapContext();
  const { toToken } = useToToken({ from, to });
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div
      style={{
        height: "264px",
        paddingTop: "52px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Typography className={classes.confirmationTitle}>
          {isConfirmed
            ? t("swap_confirmed")
            : t("swapping", {
                symbol: toToken?.tokenListEntry?.symbol,
              })}
        </Typography>
        <div style={{ marginTop: "8px", marginBottom: "16px" }}>
          <SwapReceiveAmount quoteResponse={quoteResponse} />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {isConfirmed ? (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <CheckIcon />
            </div>
          ) : (
            <Loading
              size={48}
              iconStyle={{
                display: "flex",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              thickness={6}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SwapReceiveAmount({
  quoteResponse,
}: {
  quoteResponse: SwapQuoteResponse;
}) {
  const { to, from } = useSwapContext();
  const { toToken, isLoading: isLoadingToToken } = useToToken({ to, from });
  const quoteResponseFormatter = new SwapQuoteResponseFormatter(quoteResponse);
  return (
    <TokenAmountHeader
      displayLogo={!isLoadingToToken}
      token={{
        logo: toToken?.tokenListEntry?.logo ?? UNKNOWN_ICON_SRC,
        ticker: toToken?.tokenListEntry?.symbol,
        decimals: toToken?.tokenListEntry?.decimals ?? 0,
      }}
      amount={quoteResponseFormatter?.outAmountBigNumber() ?? BigNumber.from(0)}
    />
  );
}

//
// Bottom card displayed on swap error.
//
function SwapError() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <BottomCard>
      <Typography
        className={classes.confirmationTitle}
        style={{ marginTop: "40px", marginBottom: "16px" }}
      >
        {t("error")}
      </Typography>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <CrossIcon />
      </div>
    </BottomCard>
  );
}

const useStyles = temporarilyMakeStylesForBrowserExtension((theme) => ({
  confirmationTitle: {
    color: theme.baseTextMedEmphasis.val,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    textAlign: "center",
  },
}));
