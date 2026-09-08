"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

export type Me = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  lineid: string | null;
  address: string | null;
  role: string;
  purchaseamount: number;
};

type MeState = {
  me: Me | null;
  cartCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
};

const MeContext = createContext<MeState>({
  me: null,
  cartCount: 0,
  loading: true,
  refresh: async () => {},
});

/**
 * One request for the identity the whole app needs. Every page used to fetch
 * `/api/user/<email>` for itself just to learn a name and a role.
 */
export function useMe() {
  return useContext(MeContext);
}

export function MeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [me, setMe] = useState<Me | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      setMe(data.user ?? null);
      setCartCount(data.cartCount ?? 0);
    } catch {
      setMe(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setMe(null);
      setCartCount(0);
      setLoading(false);
      return;
    }
    refresh();
  }, [status, refresh]);

  const value = useMemo(
    () => ({ me, cartCount, loading: loading || status === "loading", refresh }),
    [me, cartCount, loading, status, refresh],
  );

  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}
