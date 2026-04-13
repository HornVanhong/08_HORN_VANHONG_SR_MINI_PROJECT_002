"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../context/CartContext";

export default function Provider({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
      </CartProvider>
    </SessionProvider>
  );
}
