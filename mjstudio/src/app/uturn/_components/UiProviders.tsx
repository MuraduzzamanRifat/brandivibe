"use client";

import { CartProvider } from "./CartContext";
import { BagDrawer } from "./BagDrawer";
import { SearchOverlay } from "./SearchOverlay";

export function UiProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <BagDrawer />
      <SearchOverlay />
    </CartProvider>
  );
}
