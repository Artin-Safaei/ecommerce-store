"use client";

import { Heart, Loader2 } from "lucide-react";

import { useWishlist } from "@/app/context/WishlistContext";

type WishlistButtonProps = {
  productId: string;
  size?: "sm" | "md";
};

export default function WishlistButton({
  productId,
  size = "md",
}: WishlistButtonProps) {
  const {
    isWishlisted,
    updatingId,
    toggleWishlist,
  } = useWishlist();

  const active = isWishlisted(productId);
  const updating = updatingId === productId;

  const sizeClasses =
    size === "sm"
      ? "h-9 w-9"
      : "h-11 w-11";

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      disabled={updating}
      aria-label={
        active
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`flex ${sizeClasses} items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur transition hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {updating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 transition ${
            active
              ? "fill-red-500 text-red-500"
              : "text-zinc-400 hover:text-white"
          }`}
        />
      )}
    </button>
  );
}