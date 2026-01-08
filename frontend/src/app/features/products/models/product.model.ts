export interface Product {
  _id: string;
  name: string;
  category: 'fruit' | 'vegetable';
  pricePerKg: number;
  unit: string;
  isAvailable: boolean;
}
