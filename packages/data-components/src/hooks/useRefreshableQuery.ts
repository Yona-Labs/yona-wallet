import { useCallback, useState } from "react";

/**
 * Custom hook to made an Apollo query refreshable with a `SectionList`.
 * @export
 * @param {() => Promise<void>} refetch
 * @returns {{ onRefresh: () => Promise<void>, refreshing: boolean }}
 */
export function useRefreshableQuery(refetch: () => Promise<void>): {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
} {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, setRefreshing]);

  return { onRefresh, refreshing };
}
