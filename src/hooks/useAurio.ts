import { useEffect, useState } from "react";

import { getAurioBalance, getSolBalance } from "../core";

interface UseAurioResult {
  solBalance: number;
  aurBalance: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAurio(wallet: string | null | undefined): UseAurioResult {
  const [solBalance, setSolBalance] = useState(0);
  const [aurBalance, setAurBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  async function refresh(): Promise<void> {
    if (!wallet) {
      setSolBalance(0);
      setAurBalance(0);
      return;
    }

    setLoading(true);

    try {
      const [nextSolBalance, nextAurBalance] = await Promise.all([
        getSolBalance(wallet),
        getAurioBalance(wallet),
      ]);

      setSolBalance(nextSolBalance);
      setAurBalance(nextAurBalance);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadBalances(): Promise<void> {
      if (!wallet) {
        if (isActive) {
          setSolBalance(0);
          setAurBalance(0);
        }

        return;
      }

      if (isActive) {
        setLoading(true);
      }

      try {
        const [nextSolBalance, nextAurBalance] = await Promise.all([
          getSolBalance(wallet),
          getAurioBalance(wallet),
        ]);

        if (isActive) {
          setSolBalance(nextSolBalance);
          setAurBalance(nextAurBalance);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadBalances();

    return () => {
      isActive = false;
    };
  }, [wallet]);

  return {
    solBalance,
    aurBalance,
    loading,
    refresh,
  };
}
