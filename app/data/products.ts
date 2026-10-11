export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Minimal Headphones",
    category: "Audio",
    price: 129,
    description:
      "Premium wireless headphones designed for immersive sound and everyday comfort.",
    image: "/products/headphones.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Wearables",
    price: 249,
    description:
      "A modern smartwatch combining fitness tracking, notifications and a premium design.",
    image: "/products/smart-watch.jpg",
    featured: true,
  },
  {
    id: 3,
    name: "Premium Backpack",
    category: "Accessories",
    price: 89,
    description:
      "A minimal everyday backpack designed to carry your essentials comfortably.",
    image: "/products/backpack.jpg",
    featured: true,
  },
  {
    id: 4,
    name: "Wireless Keyboard",
    category: "Workspace",
    price: 119,
    description:
      "A clean wireless keyboard designed for productive and comfortable workspaces.",
    image: "/products/keyboard.jpg",
    featured: true,
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    category: "Workspace",
    price: 159,
    description:
      "A premium mechanical keyboard built for developers, creators and professionals.",
    image: "/products/mechanical-keyboard.jpg",
    featured: false,
  },
  {
    id: 6,
    name: "Wireless Mouse",
    category: "Workspace",
    price: 79,
    description:
      "A precise and comfortable wireless mouse designed for everyday productivity.",
    image: "/products/mouse.jpg",
    featured: false,
  },
  {
    id: 7,
    name: "Running Shoes",
    category: "Lifestyle",
    price: 139,
    description:
      "Lightweight running shoes designed for comfort, movement and everyday training.",
    image: "/products/running-shoes.jpg",
    featured: false,
  },
  {
    id: 8,
    name: "Premium Hoodie",
    category: "Clothing",
    price: 99,
    description:
      "A premium everyday hoodie with a clean silhouette and comfortable fit.",
    image: "/products/hoodie.jpg",
    featured: false,
  },
];