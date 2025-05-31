import { Suspense, useMemo } from "react";

import { CollectibleList } from "./CollectibleList";
import { type CollectiblesContextType, CollectiblesProvider } from "./context";
import {
  type CollectibleGroup,
  getGroupedCollectibles,
  type ResponseCollectible,
} from "./utils";
import { usePolledSuspenseQuery } from "../../hooks";
import type { DataComponentScreenProps } from "../common";

export type { CollectibleGroup, ResponseCollectible };
export {
  CollectibleDetails,
  CollectibleInscriptionTable,
} from "./CollectibleDetails";
export { CollectibleGroupView } from "./CollectibleGroupView";
export { LockCollectionToggle } from "./LockCollectionToggle";
export { ShowUnverifiedToggle } from "./ShowUnverifiedToggle";

const DEFAULT_POLLING_INTERVAL_SECONDS = 60;

export type CollectiblesProps = Omit<
  DataComponentScreenProps,
  "emptyStateComponent"
> & {
  address: string;
  EmptyStateComponent: (props: any) => JSX.Element;
  onCardClick: CollectiblesContextType["onCardClick"];
  onOpenSendDrawer?: CollectiblesContextType["onOpenSendDrawer"];
  onViewClick: CollectiblesContextType["onViewClick"];
  providerId: any;
};

export const Collectibles = ({
  loaderComponent,
  onCardClick,
  onOpenSendDrawer,
  onViewClick,
  ...rest
}: CollectiblesProps) => (
  <Suspense fallback={loaderComponent}>
    <CollectiblesProvider
      showItemCount
      onCardClick={onCardClick}
      onOpenSendDrawer={onOpenSendDrawer}
      onViewClick={onViewClick}
    >
      <_Collectibles {...rest} />
    </CollectiblesProvider>
  </Suspense>
);

function _Collectibles({
  address,
  EmptyStateComponent,
  fetchPolicy,
  pollingIntervalSeconds,
  providerId,
}: Pick<
  CollectiblesProps,
  | "address"
  | "EmptyStateComponent"
  | "fetchPolicy"
  | "pollingIntervalSeconds"
  | "providerId"
>) {
  // const { data } = usePolledSuspenseQuery(
  //   pollingIntervalSeconds ?? DEFAULT_POLLING_INTERVAL_SECONDS,
  //   GET_COLLECTIBLES_QUERY,
  //   {
  //     fetchPolicy,
  //     errorPolicy: "all",
  //     variables: {
  //       address,
  //       providerId,
  //     },
  //   }
  // );

  /**
   * Memoized value of the collectible items owned by the wallet that are
   * grouped by collection address, or singletons by their mint if they have no parent
   */
  const groupedCollectibles = useMemo(
    () =>
      getGroupedCollectibles(
        // data?.wallet?.nfts?.edges.map((e) => e.node) ?? [] TODO: maybe rewrite to rpc call
        []
      ),
    []
  );

  return (
    <CollectibleList
      enableShowUnverifiedButton
      collectibleGroups={groupedCollectibles}
      EmptyStateComponent={EmptyStateComponent}
    />
  );
}
