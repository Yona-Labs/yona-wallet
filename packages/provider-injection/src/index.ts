Object.defineProperty(globalThis, "_yona_injected_provider", {
  value: true,
  writable: false,
});

import {
  MOBILE_APP_TRANSPORT_SENDER_EVENTS,
  FromContentScriptTransportSender,
  ToMobileAppTransportSender,
} from "@coral-xyz/secure-clients";

// This is a bit of a hack, it's speicifically at the top of this file
// to ensure it's loaded before other code
if (globalThis.ReactNativeWebView && !globalThis.isHiddenWebView) {
  Object.defineProperty(window, "___fromApp", {
    value: (ev) => {
      MOBILE_APP_TRANSPORT_SENDER_EVENTS.emit("message", {
        // hardcoded because importing the constant would import common before this code
        channel: "channel-secure-ui-background-response",
        data: ev,
      });
    },
  });
  Object.defineProperty(window, "___toApp", {
    value: (data) => {
      globalThis.ReactNativeWebView.postMessage(JSON.stringify(data));
    },
  });
}

import {
  CHANNEL_PLUGIN_RPC_REQUEST,
  CHANNEL_PLUGIN_RPC_RESPONSE,
  getLogger,
} from "@coral-xyz/common";
import {
  ChainedRequestManager,
  ProviderEthereumInjection,
  ProviderRootXnftInjection,
  ProviderSolanaInjection,
} from "@coral-xyz/provider-core";
import { initialize } from "@coral-xyz/wallet-standard";
import { v4 as uuidV4 } from "uuid";

import type {
  EIP1193Provider,
  EIP6963RequestProviderEvent,
  WindowEthereum,
} from "./types";
import { TransportSender } from "@coral-xyz/secure-clients/types";
import { UserClient } from "@coral-xyz/secure-clients";

const logger = getLogger("provider-injection");

// Entry.
function main() {
  logger.debug("starting injected script");

  const Sender = globalThis.chrome
    ? FromContentScriptTransportSender
    : ToMobileAppTransportSender;
  const secureClientSender = new Sender({
    origin: {
      context: "browser",
      name: document.title,
      address: window.location.origin,
    },
  });
  initSolana(secureClientSender);
  initEthereum(secureClientSender);
  logger.debug("provider ready");
}

function initSolana(secureClientSender: TransportSender) {
  const solana = new ProviderSolanaInjection(secureClientSender);

  try {
    Object.defineProperty(window, "yona", { value: solana });
  } catch (e) {
    console.warn(
      "Yona couldn't override `window.yona`. Disable other Solana wallets to use Yona Wallet."
    );
  }

  try {
    Object.defineProperty(window, "yonaXnft", {
      value: (() => {
        //
        // XNFT Providers
        //
        const requestManager = new ChainedRequestManager(
          CHANNEL_PLUGIN_RPC_REQUEST,
          CHANNEL_PLUGIN_RPC_RESPONSE
        );
        const xnft = new ProviderRootXnftInjection(requestManager, {
          solana,
        });
        return xnft;
      })(),
    });
  } catch (e) {
    console.warn(
      "Yona couldn't override `window.yonaXnft`. Disable other xNFT wallets to use Yona Wallet."
    );
  }

  initialize(solana);
}

/**
 * Initialise window.ethereum with a proxy that can handle multiple wallets
 * colliding on `window.ethereum`.
 */
function initEthereum(secureClientSender: TransportSender) {
  const backpackEthereum = new ProviderEthereumInjection(secureClientSender);

  // Setup the wallet router
  if (!window.yonaWalletRouter) {
    Object.defineProperty(window, "yonaWalletRouter", {
      value: {
        currentProvider: window.ethereum ? window.ethereum : backpackEthereum,

        providers: [
          ...new Set([
            ...(window.ethereum
              ? // Coinbase wallet uses a providers array on window.ethereum, so
                // include those if already registered
                Array.isArray(window.ethereum.providers)
                ? [...window.ethereum.providers, window.ethereum]
                : // Else just window.ethereum if it is registered
                  [window.ethereum]
              : []),
            backpackEthereum,
          ]),
        ],

        setProvider(predicate: (provider: EIP1193Provider) => boolean) {
          const match = this.providers.find(predicate);
          if (!match) {
            throw new Error("No matching provider found");
          }
          this.previousProvider = this.currentProvider;
          this.currentProvider = match;
        },

        addProvider(newProvider: EIP1193Provider) {
          if (!this.providers.includes(newProvider)) {
            this.providers.push(newProvider);
          }
        },
      },
    });
  }

  // Preserve equality between component renders to avoid mistaken provider
  // detection changes
  let cachedWindowEthereumProxy: WindowEthereum;
  // If the cached provider changes, we want to change the cached proxy as well
  let cachedCurrentProvider: EIP1193Provider;

  Object.defineProperty(window, "ethereum", {
    get() {
      if (!window.yonaWalletRouter)
        throw new Error("Expected window.yonaWalletRouter to be set");

      // Provider cache exists
      if (
        cachedWindowEthereumProxy &&
        cachedCurrentProvider === window.yonaWalletRouter.currentProvider
      ) {
        return cachedWindowEthereumProxy;
      }

      cachedWindowEthereumProxy = new Proxy(
        window.yonaWalletRouter.currentProvider,
        {
          get(target, prop, receiver) {
            // Sites using web3-react force metamask usage by searching the
            // providers array, so remove it for specific sites
            // https://github.com/Uniswap/web3-react/blob/f5a54af645a4a2e125ee2f5ead6dd1ecd5d01dda/packages/metamask/src/index.ts#L56-L59
            if (
              window.yonaWalletRouter &&
              !(prop in window.yonaWalletRouter.currentProvider) &&
              prop in window.yonaWalletRouter
            ) {
              if (
                window.location.href.endsWith(".app.uniswap.org") ||
                window.location.href === "app.uniswap.org" ||
                ((window.location.href === "kwenta.io" ||
                  window.location.href.endsWith(".kwenta.io")) &&
                  prop === "providers")
              ) {
                return null;
              }
              return window.yonaWalletRouter[prop];
            }

            return Reflect.get(target, prop, receiver);
          },
        }
      );

      cachedCurrentProvider = window.yonaWalletRouter.currentProvider;

      return cachedWindowEthereumProxy;
    },

    set(newProvider) {
      window.yonaWalletRouter?.addProvider(newProvider);
    },
  });

  // EIP-6963: https://eips.ethereum.org/EIPS/eip-6963
  const info = {
    uuid: uuidV4(),
    name: "Yona Wallet",
    icon: "",
    rdns: "app.yona",
  };

  function announceProvider() {
    window.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: Object.freeze({ info, provider: backpackEthereum }),
      })
    );
  }
  window.addEventListener("eip6963:requestProvider", announceProvider);
  announceProvider();
}

main();
