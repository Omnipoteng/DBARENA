export interface Product {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: "New" | "Hot" | "Sale" | "Limited";
}

export interface CartItem extends Product {
  quantity: number;
}
