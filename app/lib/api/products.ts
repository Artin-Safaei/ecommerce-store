import type { Product } from "@/app/types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}