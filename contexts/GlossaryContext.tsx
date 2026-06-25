"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface GlossaryContextValue {
  activeTerm: string | null;
  openTerm: (id: string) => void;
  closeTerm: () => void;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  activeTerm: null,
  openTerm: () => {},
  closeTerm: () => {},
});

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const openTerm = useCallback((id: string) => setActiveTerm(id), []);
  const closeTerm = useCallback(() => setActiveTerm(null), []);

  return (
    <GlossaryContext.Provider value={{ activeTerm, openTerm, closeTerm }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}
