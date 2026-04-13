"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function ButtonAddComponent({ product }) {
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isLoading || adding) return;

    if (!product) {
      toast.error("Invalid product");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product);
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95 ${
        isLoading || adding ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onPress={handleAddToCart}
      disabled={isLoading || adding}
    >
      {isLoading || adding ? "..." : "+"}
    </Button>
  );
}
