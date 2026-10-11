"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useWishlist() {
  const router = useRouter();

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/wishlist");

      if (response.status === 401) {
        setWishlistIds([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load wishlist."
        );
      }

      const ids = data.items.map(
        (item: { product: { id: string } }) =>
          item.product.id
      );

      setWishlistIds(ids);
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggleWishlist = async (productId: string) => {
    try {
      setUpdatingId(productId);

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update wishlist."
        );
      }

      setWishlistIds((current) => {
        if (data.wishlisted) {
          return [...current, productId];
        }

        return current.filter(
          (id) => id !== productId
        );
      });
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );
    } finally {
      setUpdatingId("");
    }
  };

  const isWishlisted = (productId: string) =>
    wishlistIds.includes(productId);

  return {
    wishlistIds,
    loading,
    updatingId,
    isWishlisted,
    toggleWishlist,
    refreshWishlist: loadWishlist,
  };
}