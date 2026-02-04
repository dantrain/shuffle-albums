import React, {
  Suspense as ReactSuspense,
  SuspenseProps,
  useSyncExternalStore,
} from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const ClientOnlySuspense = (props: SuspenseProps) => {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return mounted ? <ReactSuspense {...props} /> : <>{props.fallback}</>;
};

export default ClientOnlySuspense;
