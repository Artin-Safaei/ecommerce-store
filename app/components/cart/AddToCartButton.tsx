"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/app/types/product";
import { useCartStore } from "../../store/cart-store";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
    >
      <ShoppingBag size={18} />
      Add to Cart
    </button>
  );
}