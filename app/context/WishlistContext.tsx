"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type WishlistContextType = {
  wishlistIds: string[];
  loading: boolean;
  updatingId: string;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext =
  createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [wishlistIds, setWishlistIds] = useState<
    string[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const refreshWishlist = useCallback(async () => {
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
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = async (
    productId: string
  ) => {
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
          return current.includes(productId)
            ? current
            : [...current, productId];
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

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        loading,
        updatingId,
        isWishlisted,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}