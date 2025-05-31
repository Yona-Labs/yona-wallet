import { useState } from "react";

import { useRefreshableQuery, useTransactionsRPC } from "../../hooks";
import { Transaction } from "../../types";

export const DEFAULT_POLLING_INTERVAL_SECONDS = 120;

export function useGetTransactionsData({
  address,
  fetchPolicy,
  limit,
  pagination,
  providerId,
  tokenMint,
}: {
  address: string;
  fetchPolicy?: any;
  limit?: number;
  pagination?: boolean;
  providerId: any;
  tokenMint?: string;
}): {
  data?: Transaction[] | null;
  loading: boolean;
  isLoadingNextPage: boolean;
  refreshing: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
} {
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const { data, loading, error, invalidate } = useTransactionsRPC({
    publicKey: address,
    limit,
  });

  // const { data, fetchMore, refetch, loading } = useQuery(
  //   GET_TRANSACTIONS_QUERY,
  //   {
  //     fetchPolicy,
  //     errorPolicy: "all",
  //     variables: {
  //       address,
  //       providerId,
  //       filters: {
  //         limit,
  //         token: tokenMint,
  //       },
  //     },
  //   }
  // );

  const { onRefresh, refreshing } = useRefreshableQuery(invalidate);

  const onLoadMore = () => {
    // if (pagination && data?.wallet?.transactions?.pageInfo.hasNextPage) {
    //   setIsLoadingNextPage(true);
    //   startTransition(() => {
    //     const edges = data?.wallet?.transactions?.edges;
    //     fetchMore({
    //       variables: {
    //         filters: {
    //           before: edges?.at(-1)?.node.hash,
    //           offset: edges?.length,
    //         },
    //       },
    //     }).finally(() => {
    //       setIsLoadingNextPage(false);
    //     });
    //   });
    // }
  };

  return {
    data,
    refreshing,
    onLoadMore,
    loading,
    isLoadingNextPage,
    onRefresh,
  };
}

export function useGetSuspenseTransactionsData({
  address,
  fetchPolicy,
  limit,
  pagination,
  pollingIntervalSeconds,
  providerId,
  tokenMint,
}: {
  address: string;
  fetchPolicy?: any;
  limit?: number;
  pagination?: boolean;
  pollingIntervalSeconds?: number | "disabled";
  providerId: any;
  tokenMint?: string;
}): {
  data: Transaction[];
  refreshing: boolean;
  isPending: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
} {
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const { data, loading, error, invalidate } = useTransactionsRPC({
    publicKey: address,
    limit,
  });

  // const { data, fetchMore, refetch, loading } = useQuery(
  //   GET_TRANSACTIONS_QUERY,
  //   {
  //     fetchPolicy,
  //     errorPolicy: "all",
  //     variables: {
  //       address,
  //       providerId,
  //       filters: {
  //         limit,
  //         token: tokenMint,
  //       },
  //     },
  //   }
  // );

  const { onRefresh, refreshing } = useRefreshableQuery(invalidate);

  const onLoadMore = () => {
    // if (pagination && data?.wallet?.transactions?.pageInfo.hasNextPage) {
    //   setIsLoadingNextPage(true);
    //   startTransition(() => {
    //     const edges = data?.wallet?.transactions?.edges;
    //     fetchMore({
    //       variables: {
    //         filters: {
    //           before: edges?.at(-1)?.node.hash,
    //           offset: edges?.length,
    //         },
    //       },
    //     }).finally(() => {
    //       setIsLoadingNextPage(false);
    //     });
    //   });
    // }
  };

  return {
    data: data ?? [],
    refreshing,
    isPending: loading,
    onLoadMore,
    onRefresh,
  };
}
