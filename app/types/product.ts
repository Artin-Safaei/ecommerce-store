export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  stock: number;
  categoryId: string;

  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  };
};