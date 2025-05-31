export interface Transaction {
  id: string;
  hash: string;
  timestamp: number;
  blockTime: number;
  meta: {
    computeUnitsConsumed: number;
    err: null;
    fee: number;
    innerInstructions: [];
    logMessages: string[];
    postBalances: number[];
    postTokenBalances: [];
    preBalances: number[];
    preTokenBalances: [];
    rewards: [];
    status: {
      Ok: null;
    };
  };
  slot: number;
  transaction: {
    message: {
      accountKeys: {
        pubkey: string;
        signer: boolean;
        source: string;
        writable: boolean;
      }[];
      instructions: {
        parsed: {
          info: {
            destination: string;
            lamports: number;
            source: string;
          };
          type: string;
        };
        program: string;
        programId: string;
        stackHeight: null;
      }[];
      recentBlockhash: string;
    };
    signatures: string[];
  };
}

export interface TransactionHistoryItem {
  blockTime: number;
  confirmationStatus: string;
  err: null;
  memo: null;
  signature: string;
  slot: number;
}

export type ProviderId = any; // TODO: maybe can set defined type

export type TokenBalance = {
  id: string;
  address: string;
  amount: string;
  decimals: number;
  displayAmount: string;
  marketData: {
    price: number;
    percentChange: number;
    value: number;
    valueChange: number;
    marketId: string;
    marketUrl: string;
  } | null;
  token: string;
  tokenListEntry: {
    address: string;
    decimals: number;
    logo: string;
    name: string;
    symbol: string;
  } | null;
};

export type SplTokenAccountInfo = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
};

export type SplTokenAccount = {
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
  data: {
    parsed: {
      info: SplTokenAccountInfo;
      type: "account";
    };
    program: string;
    space: number;
  };
};
