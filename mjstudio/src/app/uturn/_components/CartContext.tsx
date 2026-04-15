"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: string;
  priceNum: number;
  variant: string;
  variantLabel: string;
  size: string;
  swatch: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (slug: string, variant: string, size: string) => void;
  updateQty: (slug: string, variant: string, size: string, qty: number) => void;
  total: number;
  count: number;
  bagOpen: boolean;
  setBagOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const addItem = useCallback((incoming: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.slug === incoming.slug &&
          i.variant === incoming.variant &&
          i.size === incoming.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...incoming, qty: 1 }];
    });
    setBagOpen(true);
  }, []);

  const removeItem = useCallback(
    (slug: string, variant: string, size: string) => {
      setItems((prev) =>
        prev.filter(
          (i) => !(i.slug === slug && i.variant === variant && i.size === size)
        )
      );
    },
    []
  );

  const updateQty = useCallback(
    (slug: string, variant: string, size: string, qty: number) => {
      if (qty < 1) {
        setItems((prev) =>
          prev.filter(
            (i) => !(i.slug === slug && i.variant === variant && i.size === size)
          )
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.slug === slug && i.variant === variant && i.size === size
              ? { ...i, qty }
              : i
          )
        );
      }
    },
    []
  );

  const total = items.reduce((sum, i) => sum + i.priceNum * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        total,
        count,
        bagOpen,
        setBagOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
