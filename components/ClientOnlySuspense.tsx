import React, {
  Suspense as ReactSuspense,
  SuspenseProps,
  useEffect,
  useState,
} from "react";

const ClientOnlySuspense = (props: SuspenseProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && typeof window !== "undefined") {
      setMounted(true);
    }
  }, [mounted]);

  return mounted ? <ReactSuspense {...props} /> : <>{props.fallback}</>;
};

export default ClientOnlySuspense;
